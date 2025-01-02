<template>
    <div>
        <TitleContainer title="Departamentos" isColunaDisplay="true">
            <p class="subtitulo">Listagem de setores cadastrados</p>
        </TitleContainer>
        <!-- Modal registro -->
        <v-dialog v-model="modalRegistro" :max-width="400">
            <v-card>
                <v-toolbar height="60" color="#018538">
                    <v-btn icon="mdi-close" density="compact" @click="toggleModalDepartamento(null)"></v-btn>
                    <v-toolbar-title>{{ registro && registro.ID ? 'Alterar dados' : 'Novo Cadastro'
                        }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="form" v-model="valid" class="mt-5">
                        <v-row dense>
                            <v-col cols="12" >
                                <v-text-field v-model="registro.descricao" :error="errors?.Descricao" label="Descrição"
                                    variant="outlined" required density="compact" color="#018538"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pt-0">
                    <v-btn color="red" @click="toggleModalDepartamento(null)"
                        :disabled="carregamentoSalvar"><v-icon left>mdi-close</v-icon>Cancelar</v-btn>
                    <v-btn color="#018538" @click="salvarRegistro" :loading="carregamentoSalvar"><v-icon left>mdi-check</v-icon>Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- fim -->
        <v-row dense class="mt-1">
            <v-col cols="12">
                <v-card elevation="0" :loading="carregamentoregistros">
                    <v-card-title class="d-flex">
                        <div class="tabela-titulo">
                            <span> ({{ registros.length }}) - Total de registros</span>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn size="small" color="#018538" class="white--text" @click="toggleModalDepartamento(null)">
                            <v-icon color="white">mdi-plus</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-alert color="#018538" v-if="(registros && registros.length == 0) && !carregamentoregistros" density="compact"
                            text="Nenhum registro encontrado." type="warning"></v-alert>
                        <v-table  density="compact" v-else>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Setor</th> 
                                    <th class="text-center">Cadastrado</th>
                                    <th class="text-center">Última alteração</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in registros" :key="index">
                                    <td>{{ item.ID }}</td>
                                    <td>{{ item.descricao }}</td> 
                                    <td class="text-center">{{ formatData(item?.CreatedAt) }}</td>
                                    <td class="text-center">{{ formatData(item?.UpdatedAt) }}</td>
                                    <td>
                                        <v-menu > 
                                            <template v-slot:activator="{ props }">
                                                <v-btn  density="compact" icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                                            </template>
                                            <v-list >
                                                <v-list-item @click="toggleModalDepartamento(item)">
                                                    <v-list-item-title>Alterar dados</v-list-item-title>
                                                </v-list-item>
                                                <v-list-item @click="excluirRegistro(item.ID)">
                                                    <v-list-item-title>Excluir cadastro</v-list-item-title>
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

import { ref, onMounted } from 'vue';
import api from '@/globais/api'; 
import Swal from 'sweetalert2';
import { toast } from 'vue3-toastify';
import { formatData } from '@/utils/index';
import TitleContainer from '@/components/TituloContainer.vue';

const carregamentoregistros = ref(false);
const carregamentoSalvar = ref(false);

const registros = ref([]); 

const errors = ref({});
const registro = ref({});

const modalRegistro = ref(false);

const toggleModalDepartamento = async (value = null) => {
    modalRegistro.value = !modalRegistro.value;
    
    registro.value = {};
    errors.value = {};

    if (value != null) {
        registro.value = value
    }
};

const doLoadDepartamentos = async (load = true) => {
    try {
        carregamentoregistros.value = load;

        const { data } = await api.get(`/api/departamentos`);

        registros.value = data;

    } catch (error) {
        toast.error("Não foi possível carregar lista de departamentos!");
    } finally {
        carregamentoregistros.value = false;
    }
}

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
            const { data } = await api.delete(`/api/departamentos/${id}`);

            toast.success(data.message);

            await doLoadDepartamentos(false);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || error.message);
    }
}

const salvarRegistro = async () => {
    carregamentoSalvar.value = true;

    try {
        const { ID } = registro.value || {};

        const apiMethod = ID != null ? api.put : api.post;
        
        const { data } = await apiMethod('api/departamentos', registro.value);

        toast.success(data.message);

        toggleModalDepartamento(null);

        await doLoadDepartamentos(false);
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        toast.error(message);
        errors.value = error.response?.data?.errors || {};
    } finally {
        carregamentoSalvar.value = false;
    }
};

onMounted(async () => {
    /// Carregar departamentos
    await doLoadDepartamentos(); 
});
</script>