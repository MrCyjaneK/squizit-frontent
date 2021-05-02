<template>
  <transition-group name="fade">
    <div
      class="rounded-xl m-3 shadow-center p-3"
      v-for="(answer, index) in answers"
      :key="index"
    >
      <div>
        <p>Question:</p>
        <p
          v-if="answer.question.text"
          class="font-bold ml-2"
          v-html="answer.question.text"
        />
        <img
          class="mx-auto shadow-center max-h-20 zoomable-img"
          v-if="answer.question.image"
          :src="answer.question.image"
        />
      </div>

      <div class="mt-5">
        <p>Answer{{ answer.answers.length > 1 ? "s" : "" }}:</p>
        <div
          class="bg-light rounded-xl bg-opacity-10 m-1 text-left p-2"
          v-for="(formattedAnswer, index) in answer.answers"
          :key="index"
        >
          <p v-if="formattedAnswer.text" v-html="formattedAnswer.text"></p>
          <img
            class="mx-auto shadow-center max-h-20 zoomable-img"
            v-if="formattedAnswer.image"
            :src="formattedAnswer.image"
          />
        </div>
      </div>
    </div>
  </transition-group>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { FormattedAnswer } from "../assets/types";

export default defineComponent({
  props: {
    answers: {
      type: Array as PropType<FormattedAnswer[]>,
      default: [],
    },
  },
});
</script>

<style scoped>
.zoomable-img {
  cursor: zoom-in;
}
</style>
