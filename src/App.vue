<template>
  <div>
    <v-app v-if="route.meta.allowAnonymous">
      <router-view></router-view>
    </v-app>
    <v-app v-else>
      <Sidebar />
      <v-main class="bg-grey-lighten-3">
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script setup>

import {  useRoute } from "vue-router";
import Sidebar from "./components/Sidebar.vue";

const route = useRoute();

</script>

<style >
.v-navigation-drawer__content::-webkit-scrollbar {
  display: none;
} 
</style>