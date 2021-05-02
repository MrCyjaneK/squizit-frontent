<template>
  <nav v-if="fetched && answers.length">
    <button
      class="bg-light rounded-full font-extrabold shadow-center py-1 px-2 top-10 left-5 text-3xl z-10 duration-250 fixed material-icons dark:bg-dark hover:bg-green-300 hover:text-dark focus:outline-none active:bg-green-400"
      @click="resetAnswers"
    >
      arrow_back
    </button>
  </nav>
  <div v-else-if="fetching && !fetched" class="text-center">
    <span
      class="text-dark text-center animate-spin text-6xl material-icons pointer-events-none select-none dark:text-light"
    >
      donut_large
    </span>
    <br />
    <p class="text-4xl">Getting answers</p>
  </div>
  <div v-else-if="fetched && !answers.length" class="text-center">
    <span
      class="text-red-500 text-6xl material-icons pointer-events-none select-none"
    >
      cancel
    </span>
    <br />
    <span class="text-4xl">
      Failed to fetch answers <br />
      <p class="text-sm">{{ fetchError }}</p>
    </span>
  </div>
  <app-donates
    v-else-if="!fetched || !answers.length"
    :websiteInfo="websiteInfo"
  />

  <transition name="fade">
    <div
      v-if="zoomedImage"
      class="bg-light rounded-3xl shadow-center p-5 transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed dark:bg-dark"
    >
      <button
        class="bg-light rounded-full font-extrabold shadow-center py-1 px-2 top-6 right-6 text-3xl z-10 duration-250 absolute fixed material-icons dark:bg-dark hover:bg-red-300 hover:text-dark focus:outline-none active:bg-red-400"
        @click="zoomedImage = ''"
      >
        close
      </button>
      <img class="rounded-3xl shadow-center" :src="zoomedImage" />
    </div>
  </transition>

  <transition name="fade">
    <div
      v-if="!fetched || !answers.length"
      class="flex mx-auto my-10 max-w-150 transform w-11/12 items-center"
    >
      <div
        v-if="syntaxError"
        class="bg-light rounded-bl-none rounded-xl flex shadow-center p-3 transform right-0 -translate-y-20 items-center absolute dark:bg-dark"
      >
        <h1 class="font-extrabold mx-3 text-3xl text-red-500">!</h1>
        {{ syntaxError }}
      </div>
      <input
        class="outline-none rounded-l-3xl h-15 shadow-center w-full p-3 duration-250"
        :class="{
          'bg-light dark:bg-dark': !syntaxError,
          'bg-red-500': syntaxError,
        }"
        type="text"
        placeholder="Pin"
        v-model="pin"
      />
      <input
        class="outline-none bg-green-400 rounded-r-3xl h-15 shadow-center text-dark p-3 duration-250 hover:bg-green-300 active:bg-green-400 disabled:bg-red-300"
        :disabled="!!syntaxError"
        type="submit"
        value="Submit"
        @click="getAnswers"
      />
    </div>
  </transition>

  <div
    class="mx-auto max-w-350 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  >
    <app-answers :answers="answers" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from "vue";

import AppDonates from "../components/AppDonates.vue";
import AppAnswers from "../components/AppAnswers.vue";
import {
  Answer,
  FormattedObject,
  FormattedAnswer,
  SquizitInfo,
} from "../assets/types";

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
    AppDonates,
    AppAnswers,
  },
  setup() {
    const pin = ref("");

    const fetchError = ref("");
    const syntaxError = ref("");

    const fetching = ref(false);
    const fetched = ref(false);
    const fetchedAnswers = ref([]);

    const zoomedImage = ref("");

    const resetAnswers = () => {
      fetching.value = false;
      fetched.value = false;
      fetchedAnswers.value = [];
    };

    const getAnswers = async () => {
      fetching.value = true;
      fetched.value = false;

      const json = await await fetch(
        `http://127.0.0.1:15932` +
          (pin.value.length ? `/api/hack?pin=${pin.value}` : `/api/answers`)
      )
        .then((r) => r.json())
        .catch((error) => ({ error }));

      fetching.value = false;
      fetched.value = true;

      if (!json.ok || !json.answers) {
        fetchError.value = json.message || json.error || "";
        fetchedAnswers.value = [];
        return;
      }

      fetchedAnswers.value = json.answers;

      setTimeout(() => {
        Array.from(document.images).forEach((image) => {
          image.addEventListener("click", () => {
            zoomedImage.value = image.src;
          });
        });
      }, 100);
    };

    watch(pin, (value) => {
      if (value && /[^0-9]/.test(value)) {
        syntaxError.value = "PIN should only contain numbers";
        return;
      }
      syntaxError.value = "";
    });

    const answers = computed(() => fetchedAnswers.value.map(getQuestionData));

    const getQuestionData = (answerData: Answer) => {
      const type = answerData.type;

      const question: FormattedObject = {
        text: answerData.structure.query.text,
        image: answerData.structure.query.media?.length
          ? answerData.structure.query.media[0].url
          : "",
      };

      const hasCorrectAnswer = !!(
        answerData.structure.settings &&
        answerData.structure.settings.hasCorrectAnswer
      );

      const answerOptions = answerData.answer.options;
      const options = answerOptions || answerData.structure.options;
      const answer = answerData.answer.answer;

      const answers: FormattedObject[] = [];

      if (hasCorrectAnswer) {
        const format = (answerIndex: any) => {
          const formatted = options[answerIndex];
          const { text, math, hasMath, media } = formatted;

          let image = "";
          if (media?.length) image = media[0].url;

          const answer = {
            text: text ? text : hasMath ? math.latex.join("<br />") : "",
            image: image || "",
          };

          if (answer.text || answer.image) answers.push(answer);
        };

        if (Array.isArray(answer)) answer.forEach(format);
        if (typeof answer === "number") format(answer);
        if (answerOptions !== null) for (let i in answerOptions) format(i);

        if (!answers.length)
          answers.push({
            text: "No answers have been found for this question",
            image: "",
          });
      } else {
        answers.push({
          text: "This question has no correct answers",
          image: "",
        });
      }

      return {
        type,
        question,
        answers,
      } as FormattedAnswer;
    };

    return {
      pin,
      answers,
      fetchError,
      syntaxError,
      fetching,
      fetched,
      fetchedAnswers,
      getAnswers,
      resetAnswers,
      zoomedImage,
    };
  },
});
</script>
