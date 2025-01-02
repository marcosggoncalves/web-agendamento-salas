<template>
  <div>
    <TitleContainer title="Usuários Sistema" isColunaDisplay="true">
      <p class="subtitulo">
        Listagem de usuários cadastrado para acesso ao sistema
      </p>
    </TitleContainer>
    <!-- Modal registro -->
    <v-dialog
      v-model="modalRegistro"
      :max-width="registro?.horarios?.length > 0 ? 800 : 600"
    >
      <v-card>
        <v-toolbar height="60" color="#018538" density="compact">
          <v-btn icon="mdi-close" @click="toggleModalUsuarios(null)"></v-btn>
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
                      v-model.string="registro.nome"
                      :error="errors?.Nome"
                      label="Nome"
                      variant="outlined"
                      required
                      density="compact"
                      color="#018538"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.string="registro.email"
                      :error="errors?.Email"
                      label="Email"
                      variant="outlined"
                      required
                      density="compact"
                      color="#018538"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.string="registro.cpf"
                      :error="errors?.CPF"
                      v-mask="'###.###.###-##'"
                      label="CPF"
                      variant="outlined"
                      required
                      density="compact"
                      color="#018538"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      id="senha"
                      density="compact"
                      variant="outlined"
                      label="Senha"
                      color="#018538"
                      placeholder="Senha:"
                      :type="showSenha ? 'text' : 'password'"
                      v-model="registro.senha"
                      :append-inner-icon="showSenha ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append-inner="showSenha = !showSenha"
                      :error="errors?.Senha"
                    />
                  </v-col>
                </v-row>
              </v-form>
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
                  <v-card class="elevation-2">
                    <v-card-subtitle>
                      <strong
                        >{{ horario.inicial }} - {{ horario.final }}</strong
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
            @click="toggleModalUsuarios(null)"
            :disabled="carregamentoSalvar"
            ><v-icon left>mdi-close</v-icon>Cancelar</v-btn
          >
          <v-btn
            color="#018538"
            @click="salvarRegistro"
            :loading="carregamentoSalvar"
            ><v-icon left>mdi-check</v-icon>Salvar</v-btn
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
              @click="toggleModalUsuarios(null)"
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
                  <th>Email</th>
                  <th>CPF</th>
                  <th class="text-center">Cadastrado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in registros?.items" :key="index">
                  <td>{{ item.ID }}</td>
                  <td>
                    {{ item.nome }}
                  </td>
                  <td>
                    {{ item.email }}
                  </td>
                  <td>
                    {{ item.cpf }}
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
                        <v-list-item @click="toggleModalUsuarios(item)">
                          <v-list-item-title>Alterar dados</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="excluirRegistro(item.ID)">
                          <v-list-item-title
                            >Excluir cadastro</v-list-item-title
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
import { formatData } from "@/utils/index";
import TitleContainer from "@/components/TituloContainer.vue";

const carregamentoregistros = ref(false);
const carregamentoSalvar = ref(false);
const showSenha = ref(false);
const registros = ref([]);
const errors = ref({});
const registro = ref({});
const modalRegistro = ref(false);

const toggleModalUsuarios = async (value = null) => {
  modalRegistro.value = !modalRegistro.value;

  registro.value = {};
  errors.value = {};

  if (value != null) {
    registro.value = value;
  }
};

const doLoadUsuarios = async (load = true, page = 1) => {
  try {
    carregamentoregistros.value = load;

    const { data } = await api.get(`/api/usuarios`, {
      params: { page },
    });

    registros.value = data;
  } catch (error) {
    toast.error("Não foi possível carregar listagem de usuários sistema!");
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
      const { data } = await api.delete(`/api/usuarios/${id}`);

      toast.success(data.message);

      await doLoadUsuarios(false);
    }
  } catch (error) {
    toast.error(error.response?.data?.error || error.message);
  }
};

const salvarRegistro = async () => {
  carregamentoSalvar.value = true;

  try {
    const { ID } = registro.value || {};

    const apiMethod = ID != null ? api.put : api.post;

    const { data } = await apiMethod("api/usuarios", registro.value);

    toast.success(data.message);

    toggleModalUsuarios(null);

    await doLoadUsuarios(false);
  } catch (error) {
    toast.error(error.response?.data?.error || error.message);
    errors.value = error.response?.data?.errors || {};
  } finally {
    carregamentoSalvar.value = false;
  }
};

onMounted(async () => {
  /// Carregar departamentos
  await doLoadUsuarios();
});
</script>