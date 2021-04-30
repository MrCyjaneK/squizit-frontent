<template>
  <header
    class="relative mt-10 h-1/12 flex items-center justify-center w-80 my-5 mx-auto"
    @mouseover="squish = true"
    @mouseleave="squish = false"
  >
    <h1
      class="text-5xl font-bold h-max transform duration-250 pointer-events-none"
      :class="{
        'scale-y-50 rotate-5': squish,
      }"
      to="/"
    >
      SquizIT
    </h1>

    <h1
      class="absolute text-5xl right-5 transform duration-250 pointer-events-none"
      :class="{
        'scale-y-50 rotate-5': squish,
        'opacity-0': !squish,
      }"
    >
      🤏
    </h1>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const squish = ref(false);
    return { squish };
  },
});
</script>
