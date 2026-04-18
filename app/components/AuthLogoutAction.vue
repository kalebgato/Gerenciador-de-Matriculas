<template>
  <component
    :is="as"
    v-bind="attrs"
    :disabled="isButton ? loading : undefined"
    @click="handleLogout"
  >
    <slot>
      {{ loading ? loadingText : text }}
    </slot>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

const props = withDefaults(
  defineProps<{
    as?: "button" | "p" | "a" | "span";
    redirectTo?: string;
    text?: string;
    loadingText?: string;
  }>(),
  {
    as: "button",
    redirectTo: "/login",
    text: "Logout",
    loadingText: "Saindo...",
  }
);

const attrs = useAttrs();
const loading = ref(false);
const { logout } = useAuth();
const isButton = computed(() => props.as === "button");

const handleLogout = async () => {
  if (loading.value) return;

  try {
    loading.value = true;
    await logout();
  } finally {
    loading.value = false;
    await navigateTo(props.redirectTo);
  }
};
</script>
