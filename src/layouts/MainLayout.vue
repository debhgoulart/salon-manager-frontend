<template>
  <q-layout view="hHh Lpr lFf">
    <!-- Header Superior -->
    <AppHeader />

    <!-- Sidebar Lateral -->
    <AppSidebar />

    <!-- Área de Conteúdo da Página -->
    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/navigation/AppHeader.vue';
import AppSidebar from 'src/components/navigation/AppSidebar.vue';
</script>

<style scoped lang="scss">
.page-container {
  min-height: calc(100vh - 50px);
}
</style>
