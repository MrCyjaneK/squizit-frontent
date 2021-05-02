<template>
  <app-header />
  <!-- 3.75*3 = 11.25, *2=7.5 -->
  <main class="center">
    <router-view :websiteInfo="websiteInfo" />
  </main>

  <!-- ads -->
  <div
    class="mx-auto mb-5 max-w-150 grid w-11/12 grid-cols-3"
    :style="`grid-template-columns: repeat(${websiteInfo.ads.length}, minmax(0, 1fr))`"
  >
    <div
      v-for="(ad, index) in websiteInfo.ads"
      :key="index"
      v-html="ad"
      class="rounded-3xl h-40 shadow-center mx-1 p-3"
    ></div>
  </div>

  <app-footer />
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { SquizitInfo } from "./assets/types";

import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";

export default defineComponent({
  components: {
    AppFooter,
    AppHeader,
  },
  setup() {
    const websiteInfo: Ref<SquizitInfo> = ref({
      ads: [],
      info: "",
      address: [],
      donates: {
        donators: [],
        amount: 0,
      },
    });

    fetch("https://mrcyjanek.net/projects/squizit/info.json")
      .then((res) => res.json())
      .then((json) => {
        websiteInfo.value = json;
      })
      .catch((e) => {
        console.log(e);
      });

    return { websiteInfo };
  },
});
</script>

<style scoped>
.center {
  min-height: calc(91.667% - 22.5rem);
  @media (min-width: 640px) {
    min-height: calc(91.667% - 18.75rem);
  }
}
</style>
