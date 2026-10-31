<template>
  <NuxtLoadingIndicator color="#c62828" :height="3" />

  <button
    class="theme-toggle"
    type="button"
    :aria-label="colorMode.value === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'"
    :title="colorMode.value === 'dark' ? 'Modo claro' : 'Modo escuro'"
    @click="alternarTema"
  >
    {{ colorMode.value === 'dark' ? '☀️' : '🌙' }}
  </button>

  <NuxtPage />
</template>

<script setup lang="ts">
const colorMode = useColorMode();

function alternarTema() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}
</script>