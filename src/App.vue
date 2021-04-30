<template>
  <app-header />
  <main class="min-h-9/12">
    <router-view />
  </main>
  <app-footer />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";

export default defineComponent({
  components: {
    AppFooter,
    AppHeader,
  },
});
</script>
