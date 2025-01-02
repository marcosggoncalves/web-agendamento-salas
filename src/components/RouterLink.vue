<template>
  <router-link class="button" :to="path" @click="metodo">
    
    <span class="material-icons mb-2">{{ icon }}</span>
 
    <v-tooltip
        activator="parent"
        location="start"
      >{{text}}
    </v-tooltip>
  </router-link>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  path: String,
  icon: String,
  text: String,
  metodo: Function,
});
</script>