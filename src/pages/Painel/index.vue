

<template>
  <TitleContainer title="Agendamentos" isColunaDisplay="true">
    <p class="subtitulo">Visualizar agendamentos realizados</p>
  </TitleContainer>
  <v-row dense>
    <v-col cols="12" md="3">
      <v-card
        elevation="0"
        class="mb-2"
        :disabled="carregamentoDisponibilidades"
      >
        <v-card-subtitle class="mt-3 mb-2">
          <strong>Disponibilidade Sala(s) ou Veiculo(s):</strong>
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            density="compact"
            variant="outlined"
            label="Selecione uma DATA:"
            type="date"
            placeholder="Digite seu nome completo:"
            color="#018538"
            v-model="date"
          ></v-text-field>
          <v-select
            label="Selecionar Sala ou Veiculos:"
            variant="outlined"
            :items="salas"
            v-model="salaHash"
            item-value="hash"
            item-title="nome"
            density="compact"
            color="#018538"
          >
          </v-select>
          <v-btn
            size="small"
            color="#018538"
            @click="doLoadAgendaDisponibilidade"
          >
            <v-icon left>mdi-magnify</v-icon>Verificar</v-btn
          >
        </v-card-text>
        <div class="loading" v-if="carregamentoDisponibilidades">
          <v-progress-circular
            color="#018538"
            indeterminate
          ></v-progress-circular>
        </div>
        <div v-else-if="disponibilidade && disponibilidade?.nome" class="pa-4">
          <h3 class="mb-2 titulo">{{ disponibilidade.nome }}</h3>
          <v-alert
            v-if="filtrarDatasFuturas(disponibilidade?.horarios, date) <= 0"
            density="compact"
            border-color="error"
            text="Sem disponibilidade no momento."
            border="start"
          ></v-alert>
          <v-row dense v-else class="mt-2 mb-2">
            <v-col
              v-for="horario in filtrarDatasFuturas(
                disponibilidade?.horarios,
                date
              )"
              :key="horario.ID"
              cols="12"
              md="6"
            >
              <v-card elevation="1">
                <v-card-subtitle class="text-center">
                  <strong>
                    {{ formatData(horario.inicial, "HH:mm", "HH:mm") }} -
                    {{ formatData(horario.final, "HH:mm", "HH:mm") }}</strong
                  >
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card>

      <v-card elevation="0" class="mb-2" v-if="salas && salas.length > 0">
        <v-card-subtitle class="mt-3 mb-2">
          <strong>Legenda Calendário:</strong>
        </v-card-subtitle>
        <v-divider></v-divider>
        <div class="loading" v-if="carregamentoLegenda">
          <v-progress-circular
            color="#018538"
            indeterminate
          ></v-progress-circular>
        </div>
        <v-row dense class="pa-4" v-else>
          <v-col cols="12" v-for="legenda in salas" :key="legenda.id">
            <v-btn
              readonly
              size="small"
              height="15"
              :color="legenda.color"
              elevation="0"
            />
            <span class="ml-2">{{ legenda.nome }}</span>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12" md="9">
      <div class="loading" v-if="carregamentoCalender">
        <v-progress-circular
          color="#018538"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-card class="pa-5" elevation="0" v-else>
        <FullCalendar :options="calendarOptions" />
      </v-card>
    </v-col>
  </v-row>
  <v-dialog v-model="modalRegistro" width="auto">
    <v-card
      max-width="400"
      prepend-icon="mdi-calendar-month"
      :title="'#' + registro?.id + ' - Reserva'"
    >
      <template v-slot:text>
        <h4>{{ registro?.title }}</h4>
        <p class="mt-2">
          Horário:
          {{ formatData(registro?.start, "YYYY-MM-DDTHH:mm:ss", "HH:mm:ss") }}
          ÁS
          {{ formatData(registro?.end, "YYYY-MM-DDTHH:mm:ss", "HH:mm:ss") }}
        </p>
      </template>
      <template v-slot:actions>
        <v-btn color="#018538" @click="modalRegistro = false"
          ><v-icon left>mdi-close</v-icon>Fechar</v-btn
        >
        <v-btn color="red" @click="excluirRegistro(registro?.id)"
          ><v-icon left>mdi-delete</v-icon>Cancelar Reserva</v-btn
        >
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import api from "@/globais/api";
import { ref, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import Swal from "sweetalert2";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import TitleContainer from "@/components/TituloContainer.vue";
import { toast } from "vue3-toastify";
import { filtrarDatasFuturas, formatData } from "@/utils/index";

const date = ref(formatData(new Date(), "YYYY-MM-DD", "YYYY-MM-DD"));
const modalRegistro = ref(false);
const registro = ref(null);
const carregamentoCalender = ref(false);
const carregamentoDisponibilidades = ref(false);
const carregamentoLegenda = ref(false);
const disponibilidade = ref([]);
const salas = ref([]);
const salaHash = ref(null);

const calendarOptions = ref({
  plugins: [timeGridPlugin, dayGridPlugin, listPlugin],
  initialView: "listMonth",
  locales: allLocales,
  locale: "pt-br",
  dayMaxEvents: true,
  validRange: { start: new Date() },
  events: [],
  headerToolbar: {
    left: "prev,next",
    center: "title",
    right: "listMonth,dayGridMonth,timeGridWeek,timeGridDay",
  },
  eventClick: function (info) {
    const reserva = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
    };

    registro.value = reserva;
    modalRegistro.value = true;
  },
});

const doLoadAgenda = async (load = true) => {
  try {
    carregamentoCalender.value = load;

    const { data } = await api.get(`/api/salas-visualizar-agenda`);

    calendarOptions.value.events = data ?? [];
  } catch (error) {
    toast.error("Não foi possível carregar agenda!");
  } finally {
    carregamentoCalender.value = false;
  }
};

const doLoadSalas = async () => {
  try {
    carregamentoLegenda.value = true;

    const { data } = await api.get(`/publico/salas`);

    salas.value = data ?? [];
  } catch (error) {
    toast.error("Não foi possível carregar salas!");
  } finally {
    carregamentoLegenda.value = false;
  }
};

const doLoadAgendaDisponibilidade = async () => {
  try {
    carregamentoDisponibilidades.value = true;

    const { data } = await api.get(
      `/publico/sala-agendamento/${salaHash.value}/${date.value}`
    );

    disponibilidade.value = data;
  } catch (error) {
    toast.error("Não foi possível carregar agenda disponibilidade!");
  } finally {
    carregamentoDisponibilidades.value = false;
  }
};

const excluirRegistro = async (id) => {
  try {
    modalRegistro.value = false;

    const result = await Swal.fire({
      title: "Cancelar reserva",
      text: "Deseja efetuar o cancelamento da reserva?",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#018538",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sim, cancelar",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const { data } = await api.delete(`/api/sala-reserva/${id}`);

      toast.success(data.message);

      await doLoadAgenda(false);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

onMounted(async () => {
  await doLoadAgenda();

  await doLoadSalas();
});

setInterval(() => {
  doLoadAgenda(false);
}, 60000);
</script>

 