<template>
  <v-app-bar :elevation="1">
    <v-app-bar-title class="text-center">
      <v-container>
        <v-img
          src="@/assets/imagens/logo.png"
          alt="Canal Verde"
          class="img_full_publico"
        />
      </v-container>
    </v-app-bar-title>
  </v-app-bar>

  <v-main class="wrapper">
    <v-container class="d-flex justify-center align-center fill-height">
      <v-card max-width="420">
        <v-row dense>
          <v-col cols="12">
            <v-card elevation="0" :loading="carregamentoRegistros">
              <v-card-item>
                <v-card-title>{{ sala?.nome }}</v-card-title>
                <v-card-subtitle>{{ sala?.descricao }}</v-card-subtitle>
              </v-card-item>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <h4>Selecione o dia desejado:</h4>
                    <DatePicker
                      @click="doLoadSala"
                      borderless
                      expanded
                      :min-date="dateMin"
                      v-model="date"
                      mode="date"
                      title-position="right"
                    />
                  </v-col>
                  <v-col cols="12" v-if="sala?.horarios?.length > 0">
                    <v-row dense>
                      <v-col cols="12" class="mb-2">
                        <h5>
                          Selecionar intervalo de datas, caso seja um periodo
                          maior:
                        </h5>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          id="DtInicial"
                          label="Horário inicial:"
                          type="time"
                          density="compact"
                          v-model="timeInicial"
                          variant="outlined"
                          color="#018538"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          id="DtFim"
                          label="Horário final: "
                          v-model="timeFinal"
                          type="time"
                          density="compact"
                          variant="outlined"
                          color="#018538"
                          @change="selecionarHorariosIntervalo"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-alert
                      v-if="!sala?.horarios?.length"
                      border-color="error"
                      text="Sem disponibilidade no momento."
                      border="start"
                    ></v-alert>

                    <div v-else>
                      <h4 class="mb-2">
                        Selecione horário desejado:
                        <span
                          v-if="errors?.SalaGradeHorarioID"
                          class="span-error"
                        >
                          (SELECIONE UM HORÁRIO ABAIXO:)
                        </span>
                      </h4>
                      <v-chip-group
                        v-model="horario"
                        multiple
                        column
                        class="horarios"
                      >
                        <div v-if="sala && sala.horarios.length <= 3">
                          <v-chip
                            v-for="horario in sala.horarios"
                            :key="`${colIndex}-${horario.ID}`"
                            filter
                            variant="tonal"
                            :value="horario.ID"
                            density="compact"
                            color="#018538"
                          >
                            <div class="titulo-chip">
                              {{ formatarHorario(horario) }}
                            </div>
                          </v-chip>
                        </div>
                        <v-row dense v-else>
                          <template
                            v-for="colIndex in 3"
                            :key="`col-${colIndex}`"
                          >
                            <v-col cols="4">
                              <v-chip
                                v-for="horario in getHorariosPorColuna(
                                  colIndex - 1
                                )"
                                :key="`col-${colIndex}-${horario.ID}`"
                                class="mt-1"
                                filter
                                variant="tonal"
                                :value="horario.ID"
                                density="compact"
                                color="#018538"
                              >
                                <div class="titulo-chip">
                                  {{ formatarHorario(horario) }}
                                </div>
                              </v-chip>
                            </v-col>
                          </template>
                        </v-row>
                      </v-chip-group>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- Formulário de reserva -->
          <v-col cols="12" v-if="horario && horario.length > 0">
            <v-card elevation="0">
              <v-card-item>
                <v-card-title>Responsável pelo agendamento</v-card-title>
                <v-card-subtitle>
                  Preencha o formulário abaixo para identificação
                </v-card-subtitle>
              </v-card-item>
              <v-card-text>
                <v-form @submit.prevent="finalizar">
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field
                        id="Nome"
                        label="Nome"
                        placeholder="Digite seu nome completo:"
                        v-model="reserva.nome"
                        :error="errors?.Nome"
                        density="compact"
                        variant="outlined"
                        color="#018538"
                      />
                      <v-autocomplete
                        v-model="reserva.departamento_id"
                        :items="departamentos"
                        item-value="ID"
                        item-title="descricao"
                        label="Departamento"
                        :error="!!errors?.DepartamentoID"
                        :error-messages="errors?.DepartamentoID"
                        density="compact"
                        variant="outlined"
                        color="#018538"
                      />
                    </v-col>
                  </v-row>
                  <v-btn
                    to="/nova-reserva"
                    variant="text"
                        size="small"
                    color="red"
                    class="mr-1"
                  >
                    <v-icon left>mdi-close</v-icon>
                    Cancelar
                  </v-btn>
                  <v-btn
                    type="submit"
                    size="small"
                    :loading="carregamentoSalvar"
                    color="#018538"
                  >
                    <v-icon left>mdi-check</v-icon>
                    Confirmar
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/globais/api";
import { useRoute } from "vue-router";
import { filtrarDatasFuturas, formatData } from "@/utils";
import { toast } from "vue3-toastify";
import Swal from "sweetalert2";

const route = useRoute();
const date = ref(new Date());
const dateMin = ref(new Date());

const horario = ref([]);
const reserva = ref({});
const errors = ref({});

const timeInicial = ref(null);
const timeFinal = ref(null);

const sala = ref({});
const departamentos = ref([]);
const carregamentoRegistros = ref(false);
const carregamentoSalvar = ref(false);

const selecionarHorariosIntervalo = async () => {
  horario.value = [];

  sala.value.horarios?.map((time) => {
    if (
      formatData(time.inicial, "HH:mm", "HH:mm") >= timeInicial.value &&
      formatData(time.final, "HH:mm", "HH:mm") <= timeFinal.value
    ) {
      horario.value.push(time.ID);
    }
  });
};

const doLoadSala = async () => {
  try {
    if (!date.value) {
      sala.value.horarios = [];
      return toast.error("Selecione o dia da reserva.");
    }
    carregamentoRegistros.value = true;

    const formattedDate = formatData(date.value, "YYYY-MM-DD", "YYYY-MM-DD");

    const { data } = await api.get(
      `/publico/sala-agendamento/${route.params.hash}/${formattedDate}`
    );

    const horarios = filtrarDatasFuturas(data.horarios, date.value);

    sala.value = { ...data, horarios };
  } catch {
    toast.error("Não foi possível carregar informações da sala.");
  } finally {
    carregamentoRegistros.value = false;
  }
};

const doLoadDepartamentos = async () => {
  try {
    const { data } = await api.get("/publico/departamentos");
    departamentos.value = data;
  } catch {
    toast.error("Não foi possível carregar a lista de departamentos.");
  }
};

const finalizar = async () => {
  carregamentoSalvar.value = true;
  try {
    const formattedDate = formatData(date.value, "YYYY-MM-DD", "YYYY-MM-DD");

    const agenda = {
      ...reserva.value,
      data_reserva: formattedDate,
      horarios: horario.value,
    };
    const { data } = await api.post("publico/sala-agendamento", agenda);
    Swal.fire({
      title: "Agendamento realizado!",
      text: data.message,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
    resetarFormulario();
  } catch (error) {
    toast.error(error.response?.data?.message || "Erro ao salvar.");
    errors.value = error.response?.data?.errors || {};
  } finally {
    carregamentoSalvar.value = false;
  }
};

const getHorariosPorColuna = (colIndex) =>
  sala.value.horarios?.filter((_, idx) => idx % 3 === colIndex) || [];

const formatarHorario = (horario) =>
  horario.dia_inteiro
    ? "Dia inteiro"
    : `${formatData(horario.inicial, "HH:mm", "HH:mm")} - ${formatData(
        horario.final,
        "HH:mm",
        "HH:mm"
      )}`;

const resetarFormulario = () => {
  reserva.value = {};
  horario.value = [];
  errors.value = {};
  date.value = new Date();
  timeInicial.value = null;
  timeFinal.value = null;

  doLoadSala();
};

onMounted(() => {
  doLoadSala();
  doLoadDepartamentos();
});
</script>
