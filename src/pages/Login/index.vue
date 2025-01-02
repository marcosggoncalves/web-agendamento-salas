<template>
  <div class="wrapper">
    <div class="login-page">
      <div class="container">
        <a href="https://www.canalverdeenergia.com.br/">
          <img src="@/assets/imagens/logo.webp" alt="Canal Verde" class="img_full" />
        </a>
      </div>
      <div class="login-content">
        <v-form class="form" @submit.prevent="doLogin">
          <v-text-field
            id="CPF"
            density="compact"
            variant="outlined"
            label="CPF"
            v-mask="'###.###.###-##'"
            placeholder="Digite seu CPF:"
            v-model="entrar.CPF"
            :error="errors && errors.CPF"
            color="#018538"
          ></v-text-field>

          <v-text-field
            id="senha"
            density="compact"
            variant="outlined" 
            label="Senha"
            placeholder="Digite sua senha:"
            :type="showSenha ? 'text' : 'password'"
            v-model="entrar.senha"
            :append-inner-icon="showSenha ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showSenha = !showSenha"
            :error="errors && errors.Senha"
            color="#018538"
          />

          <v-btn
            type="submit"
            :loading="carregamento"
            color="#018538"
          >
          <v-icon left>mdi-login</v-icon>
            Entrar
          </v-btn> 
        </v-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import router from "@/router/index";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "vue3-toastify";
 
const entrar = ref({});
const carregamento = ref(false);
const showSenha = ref(false);
const errors = ref({});

const reset = () => {
  errors.value = {};
  entrar.value = {};
  carregamento.value = false;
};

const doLogin = async () => {
  try {
    carregamento.value = true;

    const response = await useAuthStore().entrar(entrar.value);

    if (response && !response.status) {
      toast.error(response.message);
      errors.value = response.errors;
      carregamento.value = false;
      return;
    }

    router.push("/painel");
    reset();
  } catch (error) {
    toast.error(error.toString());
    carregamento.value = false;
  }
};
</script>

<style scoped lang="postcss">
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.login-page { 
  padding-bottom: 10rem;
}

.img_full {
  width: 150px;
  margin-bottom: 5px;
}

.login-content {
  align-items: center;
  justify-content: center;
  display: flex;
  width: 100%;
}

.login-content img {
  padding: 0px 30px;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.form {
  display: inline-block;
  background-color: var(--grey);
  border-radius: 10px;
  box-shadow: 0px 0px 30px 0px var(--dark);
  color: var(--light);
  width: 300px;
  padding: 40px;

  label {
    color: var(--light);
    font-size: 1em;
    padding-right: 5px;
    font-weight: 500;
  }

  input {
    color: var(--grey);
    font-size: 1em;
    padding: 2px;
    border-color: var(--primary);
  }

  &::placeholder {
    color: var(--grey);
    opacity: 0.8;
  }

  button {
    width: 100%;
  }
}

@media screen and (max-width: 767px) {
  img {
    display: none;
  }

  .img_full {
    display: block;
    margin-bottom: 10px;
  }
}

@media screen and (max-width: 1024px) and (min-width: 768px) {
  .login-content {
    width: auto;
  }

  .login-content .description {
    margin: 0 auto;
    max-width: 350px;
    width: auto;
  }

  img {
    display: none;
  }

  .img_full {
    display: block;
    margin-bottom: 10px;
  }
}
</style>
