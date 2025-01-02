<template>
  <v-navigation-drawer 
    rail
    permanent
    elevation="0"
    class="aside"
  >
    <div class="logo"> 
      <img 
        src="@/assets/imagens/logo_icon.png"
        alt="Canal Verde"
        class="img_full"
      />
    </div>
    <h3>Bem Vindo, {{ getName() }}</h3>
    <div class="menu">
      <base-router-link
        v-for="route in mainRoutes"
        :key="route.path"
        :path="route.path"
        :icon="route.icon"
        :text="route.text"
      />
    </div>
    <div class="menu menu-config">
      <base-router-link
        v-for="route in secondaryRoutes"
        :key="route.path"
        :path="route.path"
        :icon="route.icon"
        :text="route.text"
        :metodo="route.metodo"
      />
    </div>
  </v-navigation-drawer>
</template>
<script setup>
import router from "@/router/index";
import BaseRouterLink from "@/components/RouterLink.vue";

import Swal from 'sweetalert2';
import { useAuthStore } from "@/stores/useAuthStore";

const getName = () => {
  return useAuthStore()?.usuario?.nome
};

function sair() {
  Swal.fire({
    title: "Finalizar Sessão!",
    text: "Deseja encerrar seu acesso ao sistema?",
    icon: "error",
    showCancelButton: true,
    confirmButtonColor: "#018538",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Sim, pode finalizar",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      window.localStorage.clear();
      router.push('/');
    }
  });
}

const mainRoutes = [
  { path: "/painel", icon: "calendar_month", text: "Visualizar Agenda" },
  { path: "/nova-reserva", icon: "event_available", text: "Realizar Nova Reserva" }, 
  { path: "/salas", icon: "meeting_room", text: "Salas Reuniões" }, 
  { path: "/departamentos", icon: "badge", text: "Departamentos" }, 
  { path: "/usuarios-sistema", icon: "group_add", text: "Usuários Sistemas" }, 
];

const secondaryRoutes = [{ path: "", icon: "logout", text: "Sair da plataforma", metodo: sair }];

</script>
  
<style  lang="postcss">
 
.aside {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.75rem;

  .logo {
    margin-bottom: 0.5rem;
    transition: 0.3s ease-in-out;
    img {
      width: 2rem;
    }
  }

  h3,
  .button .text {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  h3 {
    color: var(--grey);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .menu {
    .button {
      display: flex;
      align-items: center;
      text-decoration: none;
      transition: 0.3s ease-in-out;
     
      .material-icons {
        font-size: 1.6rem;
        color: var(--light);
        transition: 0.3s ease-in-out;
      }
      .text {
        color: var(--light);
        transition: 0.3s ease-in-out;
      }

      &:hover {
        .material-icons,
        .text {
          color: var(--primary);
        }
      }

      &.router-link-exact-active { 
        .material-icons,
        .text {
          color: var(--primary);
        }
      }
    }
  }
}
</style>