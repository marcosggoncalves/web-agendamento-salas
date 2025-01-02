
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import NotFound from '@/components/NotFound.vue'
 
import Login from '../pages/Login/index.vue' 
import Departamentos from '../pages/Departamentos/index.vue' 
import Salas from '../pages/Salas/index.vue' 
import Painel from '../pages/Painel/index.vue' 
import Usuarios from '../pages/Usuarios/index.vue' 

import Agendamento from '../pages/Agendamento/nova_reserva.vue' 
import NovaReserva from '../pages/Agendamento/index.vue' 

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      allowAnonymous: true,
      auth: false
    },
  }, 
  {
    path: '/nova-reserva',
    name: 'NovaReserva',
    component: NovaReserva,
    meta: {
      allowAnonymous: true,
      auth: false
    },
  }, 
  {
    path: '/agendamento-sala/:hash?',
    name: 'Agendamento',
    component: Agendamento,
    meta: {
      allowAnonymous: true,
      auth: false
    },
  }, 
  {
    path: '/painel',
    name: 'Painel',
    component: Painel,
    meta: {
      allowAnonymous: false,
      auth: true
    },
  },
  {
    path: '/usuarios-sistema',
    name: 'Usuarios',
    component: Usuarios,
    meta: {
      allowAnonymous: false,
      auth: true
    },
  },
  {
    path: '/departamentos',
    name: 'Departamentos',
    component: Departamentos,
    meta: {
      allowAnonymous: false,
      auth: true
    },
  },
  {
    path: '/salas',
    name: 'Salas',
    component: Salas,
    meta: {
      allowAnonymous: false,
      auth: true
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: {
      allowAnonymous: true,
      auth: false
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.auth && !authStore.isAuthenticated) {
    next({
      path: '/',
    })
  }
  return next()
})

export default router
