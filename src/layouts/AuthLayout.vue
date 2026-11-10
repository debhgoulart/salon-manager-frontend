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
// Layout limpo para autenticação
</script>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  background: radial-gradient(circle at 10% 20%, rgba(123, 63, 97, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(197, 155, 109, 0.08) 0%, transparent 40%);
}

.auth-card-wrapper {
  width: 100%;
  max-width: 440px;
}
</style>
