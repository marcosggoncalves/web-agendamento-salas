<template>
  <div>
    <TitleContainer title="Salas Reuniões" isColunaDisplay="true">
      <p class="subtitulo">Listagem de salas cadastradas</p>
    </TitleContainer>
    <!-- Modal registro -->
    <v-dialog
      v-model="modalRegistro"
      :max-width="registro?.horarios?.length > 0 ? 800 : 600"
    >
      <v-card>
        <v-toolbar height="60" color="#018538" density="compact">
          <v-btn icon="mdi-close" @click="toggleModalSalas(null)"></v-btn>
          <v-toolbar-title>{{
            registro && registro.ID ? "Alterar dados" : "Novo Cadastro"
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" :md="registro?.horarios?.length > 0 ? 6 : 12">
              <v-form ref="form" v-model="valid" class="mt-5">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.string="registro.color"
                      :error="errors?.Color"
                      label="Escolha uma COR para classificação dos agendamentos:"
                      variant="outlined"
                      required
                      type="color"
                      density="compact"
                      color="#018538"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="registro.intervalo_por_agendamento"
                      :error="errors?.IntervaloPorAgendamento"
                      label="Intrevalo entre cada reunião:"
                      variant="outlined"
                      required
                      type="number"
                      density="compact"
                      color="#018538"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model.string="registro.nome"
                      :error="errors?.Nome"
                      label="Nome"
                      variant="outlined"
                      required
                      density="compact"
                      color="#018538"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model.string="registro.descricao"
                      :error="errors?.Descricao"
                      label="Descrição"
                      variant="outlined"
                      required
                      density="compact"
                      color="#018538"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.string="registro.horario_ini_funcionamento"
                      :error="errors?.HorarioIniFuncionamento"
                      label="Horário Funcionamento(Inicial):"
                      variant="outlined"
                      required
                      step="2"
                      type="time"
                      density="compact"
                      color="#018538"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.string="registro.horario_fim_funcionamento"
                      :error="errors?.HorarioFimFuncionamento"
                      label="Horário Funcionamento(Final):"
                      variant="outlined"
                      required
                      step="2"
                      type="time"
                      density="compact"
                      color="#018538"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-switch
                      color="#018538"
                      v-model="isAtualizarGrade"
                      label="Atualizar Grade"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-form>
              <div class="qrcode" v-if="registro?.horarios?.length > 0">
                <span>QRCODE para efetuar a reserva:</span>
                <qrcode-vue
                  :value="urlQrcode(registro?.hash)"
                  :size="140"
                  level="H"
                  render-as="svg"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6" v-if="registro?.horarios?.length > 0">
              <div class="tabela-titulo mb-3">
                <span>
                  ({{ registro?.horarios?.length }}) - Grade Disponivel</span
                >
              </div>
              <v-row dense>
                <v-col
                  v-for="horario in registro?.horarios"
                  :key="horario.ID"
                  cols="12"
                  md="6"
                >
                  <v-card class="elevation-2 text-center">
                    <v-card-subtitle>
                      <strong>
                        {{ formatData(horario.inicial, "HH:mm", "HH:mm") }} -
                        {{
                          formatData(horario.final, "HH:mm", "HH:mm")
                        }}</strong
                      >
                    </v-card-subtitle>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-btn
            color="red"
            @click="toggleModalSalas(null)"
            :disabled="carregamentoSalvar"
            ><v-icon left>mdi-close</v-icon>Cancelar</v-btn
          >
          <v-btn
            color="#018538"
            @click="salvarRegistro"
            :loading="carregamentoSalvar"
          >
            <v-icon left>mdi-check</v-icon>Salvar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- fim -->
    <v-row dense class="mt-1">
      <v-col cols="12">
        <v-card elevation="0" :loading="carregamentoregistros">
          <v-card-title class="d-flex">
            <div class="tabela-titulo">
              <span> ({{ registros.total_records }}) - Total de registros</span>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              size="small"
              color="#018538"
              class="white--text"
              @click="toggleModalSalas(null)"
            >
              <v-icon color="white">mdi-plus</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-alert
              color="#018538"
              v-if="registros && registros.total_pages == 0"
              density="compact"
              text="Nenhum registro encontrado."
              type="warning"
            ></v-alert>
            <v-table density="compact" v-else>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th class="text-center">Intervalo cada reunião</th>
                  <th>Funcionamento</th>
                  <th class="text-center">Cadastrado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in registros?.items" :key="index">
                  <td>{{ item.ID }}</td>
                  <td>{{ item.nome }} - ({{ item.descricao }})</td>
                  <td class="text-center">
                    {{ item.intervalo_por_agendamento }}
                  </td>
                  <td>
                    <b>{{
                      item.horario_ini_funcionamento +
                      " ÁS " +
                      item.horario_fim_funcionamento
                    }}</b>
                  </td>
                  <td class="text-center">{{ formatData(item?.CreatedAt) }}</td>
                  <td>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn
                          density="compact"
                          icon="mdi-dots-vertical"
                          variant="text"
                          v-bind="props"
                        ></v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="toggleModalSalas(item)">
                          <v-list-item-title>Alterar dados</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="excluirRegistro(item.ID)">
                          <v-list-item-title
                            >Excluir cadastro</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item @click="getUrl(item.hash)">
                          <v-list-item-title
                            >Compartilhar Link</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/globais/api";
import Swal from "sweetalert2";
import { toast } from "vue3-toastify";
import { formatData, getUrl, urlQrcode } from "@/utils/index";
import TitleContainer from "@/components/TituloContainer.vue";
import QrcodeVue from "qrcode.vue";

const carregamentoregistros = ref(false);
const carregamentoSalvar = ref(false);
const registros = ref([]);
const errors = ref({});
const isAtualizarGrade = ref(false);
const registro = ref({});
const modalRegistro = ref(false);

const toggleModalSalas = async (value = null) => {
  modalRegistro.value = !modalRegistro.value;

  registro.value = {};
  errors.value = {};
  isAtualizarGrade.value = false;

  if (value != null) {
    registro.value = value;
  }
};

const doLoadSalas = async (load = true, page = 1) => {
  try {
    carregamentoregistros.value = load;

    const { data } = await api.get(`/api/salas`, {
      params: { page },
    });

    registros.value = data;
  } catch (error) {
    toast.error("Não foi possível carregar listagem de salas!");
  } finally {
    carregamentoregistros.value = false;
  }
};

const excluirRegistro = async (id) => {
  try {
    const result = await Swal.fire({
      title: "Excluir Registri",
      text: "Deseja realmente excluir?",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#018538",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sim, pode excluir",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const { data } = await api.delete(`/api/salas/${id}`);

      toast.success(data.message);

      await doLoadSalas(false);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

const salvarRegistro = async () => {
  carregamentoSalvar.value = true;

  try {
    const { ID } = registro.value || {};

    if (isAtualizarGrade.value) {
      registro.value["gerar_grade"] = "generate";
    }

    const apiMethod = ID != null ? api.put : api.post;

    const { data } = await apiMethod("api/salas", registro.value);

    toast.success(data.message);

    toggleModalSalas(null);

    await doLoadSalas(false);
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    errors.value = error.response?.data?.errors || {};
  } finally {
    carregamentoSalvar.value = false;
  }
};

onMounted(async () => {
  await doLoadSalas();
});
</script>