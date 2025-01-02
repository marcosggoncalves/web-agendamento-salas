<template>
  <v-container class="fill-height d-flex flex-column justify-center align-center">
  
    <v-card class="pa-5 text-center" max-width="600" elevation="0">
      <v-card-title>404</v-card-title>
      <v-card-subtitle class="mb-4">Página não encontrada</v-card-subtitle>
      <v-card-text>
        <p>Desculpe, a página que você procura não foi encontrada!</p>
      </v-card-text>
      <v-btn  color="#018538" variant="tonal" to="/painel">Voltar para Dashboard</v-btn>
    </v-card>
  </v-container>
</template>

<script setup> 
</script>

<style scoped> 
.v-card {
  max-width: 100%;
}

.v-card-title {
  color: #018538;
  font-size: 45px;
  line-height: 2rem;
}

.v-btn {
  text-decoration: none;
}
</style>
