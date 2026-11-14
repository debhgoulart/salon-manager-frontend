<template>
  <q-layout view="lHh Lpr lFf" class="auth-layout">
    <q-page-container>
      <q-page class="flex flex-center q-pa-md auth-page">
        <div class="auth-card-wrapper">
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// Layout editorial para fluxos de autenticação
</script>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  background-color: #fafafa;
  background-image: radial-gradient(#e4e4e7 1px, transparent 1px);
  background-size: 24px 24px;
}

body.body--dark .auth-layout {
  background-color: #09090b;
  background-image: radial-gradient(#27272a 1px, transparent 1px);
  background-size: 24px 24px;
}

.auth-card-wrapper {
  width: 100%;
  max-width: 440px;
}
</style>
