import { defineStore } from 'pinia'
import api from '@/globais/api';

export const useAuthStore = defineStore("auth", {
  state: () => ({
    usuario: null,
    isAuthenticated: false,
    token: null
  }),
  actions: {
    async entrar(login) {
      try {
        const response = await api.post("/auth/login", login);
        const { token, usuario } = response.data;

        this.usuario = usuario;
        this.token = token;
        this.isAuthenticated = true;
      } catch (res) {
        if (res.response.data && res.response.data.errors) {
          return {
            status: false,
            message: res.response.data.message,
            errors: res.response.data.errors
          }
        }
        return {
          status: false,
          message: res.response.data.error
        };
      }
    },
    reset() {
      this.usuario = null,
      this.isAuthenticated = false,
      this.token = null; 
    }
  }
})


