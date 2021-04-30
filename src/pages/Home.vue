<template>
  <nav v-if="fetched && answers.length">
    <button
      class="bg-light rounded-full font-extrabold shadow-center py-1 px-2 top-10 left-5 text-3xl z-10 duration-250 fixed material-icons dark:bg-dark hover:bg-green-300 hover:text-dark focus:outline-none active:bg-green-400"
      @click="resetAnswers"
    >
      arrow_back
    </button>
  </nav>

  <div
    v-if="zoomedImage"
    class="bg-light rounded-3xl shadow-center p-5 transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed dark:bg-dark"
  >
    <button
      class="absolute top-6 right-6 bg-light rounded-full font-extrabold shadow-center py-1 px-2 text-3xl z-10 duration-250 fixed material-icons dark:bg-dark hover:bg-red-300 hover:text-dark focus:outline-none active:bg-red-400"
      @click="zoomedImage = ''"
    >
      close
    </button>
    <img class="rounded-3xl" :src="zoomedImage" />
  </div>

  <transition name="fade">
    <div
      v-if="!fetched || !answers.length"
      class="flex max-w-150 transform top-1/3 left-1/2 w-11/12 -translate-x-1/2 -translate-y-1/2 relative items-center absolute"
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
            class="mx-auto max-h-20"
            v-if="answer.question.image"
            :src="answer.question.image"
          />
        </div>

        <div class="mt-5">
          <p>Answer{{ answer.answers.length > 1 ? "s" : "" }}:</p>
          <div
            class="bg-light rounded-xl bg-opacity-10 m-1 text-left p-2"
            v-for="formattedAnswer in answer.answers"
            :key="formattedAnswer"
          >
            <p v-if="formattedAnswer.text" v-html="formattedAnswer.text"></p>
            <img
              class="mx-auto max-h-20"
              v-if="formattedAnswer.image"
              :src="formattedAnswer.image"
            />
          </div>
        </div>
      </div>
    </transition-group>
  </div>

  <div v-if="fetching && !fetched" class="text-center">
    <span
      class="text-dark text-center animate-spin text-6xl material-icons pointer-events-none select-none dark:text-light"
    >
      donut_large
    </span>
    <p class="text-4xl">Getting answers</p>
  </div>
  <div v-else-if="fetched && !answers.length" class="text-center">
    <span
      class="text-red-500 text-6xl material-icons pointer-events-none select-none"
    >
      cancel
    </span>
    <p class="text-4xl">Failed to get answers</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, provide, ref, watch } from "vue";

export default defineComponent({
  setup() {
    const pin = ref("");

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
        pin.value.length ? `/api/hack?pin=${pin.value}` : `/api/answers`
      )
        .then((r) => r.json())
        .catch(() => ({}));

      fetching.value = false;
      fetched.value = true;

      if (!json.answers) {
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

    const getQuestionData = (answerData: any) => {
      const type = answerData.type;
      const question = {
        text: answerData.structure.query.text,
        image: answerData.structure.query.media?.length
          ? answerData.structure.query.media[0].url
          : "",
      };
      const answerOptions = answerData.answer.options;
      const options = answerOptions || answerData.structure.options;
      const answer = answerData.answer.answer;

      const answers: any[] = [];

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

      return {
        type,
        question,
        answers,
      };
    };

    return {
      pin,
      answers,
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
