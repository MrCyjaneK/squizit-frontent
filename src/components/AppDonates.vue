<template>
  <div class="text-center">
    <h1 class="text-2xl">Info</h1>
    <p class="text-md" v-html="websiteInfo.info"></p>

    <p class="font-semibold mt-3">You can donate here:</p>

    <div class="flex flex-row mt-2 items-center justify-center">
      <a
        v-for="(address, index) in websiteInfo.address"
        :key="index"
        :href="address.href"
        target="_blank"
      >
        <img :alt="address.name" :src="address.icon" class="logo" />
      </a>
    </div>

    <div class="flex flex-col mt-3 justify-center items-center">
      <h1 class="font-semibold">Status:</h1>
      <app-progress-bar
        class="w-full max-w-75"
        :value="websiteInfo.donates.amount"
        :max="15"
        suffix="€"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { SquizitInfo } from "../assets/types";

import AppProgressBar from "./AppProgressBar.vue";

export default defineComponent({
  props: {
    websiteInfo: {
      type: Object as PropType<SquizitInfo>,
      default: {
        ads: [],
        info: "",
        address: [],
        donates: {
          donators: [],
          amount: 0,
        },
      },
    },
  },
  components: {
    AppProgressBar,
  },
});
</script>
