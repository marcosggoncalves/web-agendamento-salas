

<template>
  <v-app>
    <v-main class="wrapper">
      <v-container class="d-flex flex-column justify-center align-center">
        <div class="mt-8 mb-5">
          <v-img
            src="@/assets/imagens/logo.png"
            alt="Canal Verde"
            width="120"
          />
        </div>
        <v-progress-circular
          color="#027532"
          indeterminate
          v-if="carregamentoRegistros"
        ></v-progress-circular>
        <v-alert
          v-else-if="salas && salas.length == 0"
          border-color="error"
          text="Não possivel localizar opções!"
          border="start"
        ></v-alert>

        <v-card v-else max-width="420" class="text-center" elevation="0">
          <v-card-title class="text-h5"> Nova Reserva </v-card-title>
          <v-card-subtitle class="mb-2">
            Disponibilidade Sala(s) ou Veiculo(s):
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" v-for="legenda in salas" :key="legenda.id">
                <v-btn size="small" @click="getUrl(legenda.hash)" color="#018538" block>
                  {{ legenda.nome }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup>
import { ref, onMounted } from "vue";
import api from "@/globais/api";
import { getUrl } from "@/utils";
import { toast } from "vue3-toastify";

const salas = ref([]);
const carregamentoRegistros = ref(false);

const doLoadSalas = async () => {
  try {
    carregamentoRegistros.value = true;

    const { data } = await api.get(`/publico/salas`);

    salas.value = data;
  } catch (error) {
    toast.error("Não foi possível carregar listas de agendamentos!");
  } finally {
    carregamentoRegistros.value = false;
  }
};

onMounted(async () => {
  await doLoadSalas();
});
</script>

