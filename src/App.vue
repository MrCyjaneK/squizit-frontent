<template>
  <app-header />

  <router-view />

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
