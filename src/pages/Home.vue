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
      class="flex max-w-150 transform top-1/2 left-1/2 w-11/12 -translate-x-1/2 -translate-y-full items-center absolute"
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
        "http://127.0.0.1:15932" +
          (pin.value.length ? `/api/hack?pin=${pin.value}` : `/api/answers`)
      )
        .then((r) => r.json())
        .catch(() => ({}));

      fetching.value = false;
      fetched.value = true;

      const x = {
        ok: true,
        message: "",
        version: "v2",
        answers: [
          {
            _id: "608aa2e1c51cee001b8f4b8a",
            type: "MCQ",
            structure: {
              settings: { hasCorrectAnswer: true },
              kind: "MCQ",
              query: {
                math: { latex: [], template: "" },
                type: "",
                hasMath: false,
                text: "\u003cp\u003eMultiple choice\u003c/p\u003e",
                media: [],
              },
              options: [
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e1\u003c/p\u003e",
                  media: [],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e2\u003c/p\u003e",
                  media: [],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e3 \u0026lt;--\u003c/p\u003e",
                  media: [],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e4\u003c/p\u003e",
                  media: [],
                },
              ],
              hasMath: false,
            },
            answer: { answer: 2, options: null },
          },
          {
            _id: "608aa2ef573b30001f1beb4c",
            type: "MSQ",
            structure: {
              settings: { hasCorrectAnswer: true },
              kind: "MSQ",
              query: {
                math: { latex: [], template: "" },
                type: "",
                hasMath: false,
                text: "\u003cp\u003eCheckbox\u003c/p\u003e",
                media: [],
              },
              options: [
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e1\u003c/p\u003e",
                  media: [],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e2 \u0026lt;--\u003c/p\u003e",
                  media: [],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e3\u003c/p\u003e",
                  media: [],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e4\u003c/p\u003e",
                  media: [],
                },
              ],
              hasMath: false,
            },
            answer: { answer: [1], options: null },
          },
          {
            _id: "608aa2fa554ee6001dded5f0",
            type: "BLANK",
            structure: {
              settings: { hasCorrectAnswer: true },
              kind: "BLANK",
              query: {
                math: { latex: [], template: "" },
                type: "",
                hasMath: false,
                text: "\u003cp\u003eFill in the blank\u003c/p\u003e",
                media: [],
              },
              options: null,
              hasMath: false,
            },
            answer: {
              answer: [],
              options: [
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "to",
                  media: [],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "albo to",
                  media: [],
                },
              ],
            },
          },
          {
            _id: "608aa3058234ca001ba11b33",
            type: "OPEN",
            structure: {
              settings: { hasCorrectAnswer: false },
              kind: "OPEN",
              query: {
                math: { latex: [], template: "" },
                type: "",
                hasMath: false,
                text: "\u003cp\u003eOpen ended\u003c/p\u003e",
                media: [],
              },
              options: [],
              hasMath: false,
            },
            answer: { answer: [], options: null },
          },
          {
            _id: "608aa336726ed7001bc51678",
            type: "MCQ",
            structure: {
              settings: { hasCorrectAnswer: true },
              kind: "MCQ",
              query: {
                math: {
                  latex: [
                    "\\sqrt{\\beta\\equiv\\frac{\\frac{\\partial x}{\\partial y}}{\\theta}}",
                  ],
                  template:
                    "\u003cp\u003e{$0}\u0026nbsp;Multiple choice latex\u003cbr\u003e\u003c/p\u003e",
                },
                type: "",
                hasMath: true,
                text:
                  '\u003cp\u003e\u003c/p\u003e\u003cp\u003e\u003cspan class="katex-container" data-idx="0" contenteditable="false"\u003e\u0026nbsp;\u003cspan class="katex-display"\u003e\u003cspan class="katex"\u003e\u003cspan class="katex-mathml"\u003e\u003cmath\u003e\u003csemantics\u003e\u003cmrow\u003e\u003cmsqrt\u003e\u003cmrow\u003e\u003cmi\u003eβ\u003c/mi\u003e\u003cmo\u003e≡\u003c/mo\u003e\u003cmfrac\u003e\u003cmfrac\u003e\u003cmrow\u003e\u003cmi mathvariant="normal"\u003e∂\u003c/mi\u003e\u003cmi\u003ex\u003c/mi\u003e\u003c/mrow\u003e\u003cmrow\u003e\u003cmi mathvariant="normal"\u003e∂\u003c/mi\u003e\u003cmi\u003ey\u003c/mi\u003e\u003c/mrow\u003e\u003c/mfrac\u003e\u003cmi\u003eθ\u003c/mi\u003e\u003c/mfrac\u003e\u003c/mrow\u003e\u003c/msqrt\u003e\u003c/mrow\u003e\u003cannotation encoding="application/x-tex"\u003e\\sqrt{\\beta\\equiv\\frac{\\frac{\\partial x}{\\partial y}}{\\theta}}\u003c/annotation\u003e\u003c/semantics\u003e\u003c/math\u003e\u003c/span\u003e\u003cspan class="katex-html" aria-hidden="true"\u003e\u003cspan class="base"\u003e\u003cspan class="strut" style="height:3.04em;vertical-align:-0.8735170000000001em;"\u003e\u003c/span\u003e\u003cspan class="mord sqrt"\u003e\u003cspan class="vlist-t vlist-t2"\u003e\u003cspan class="vlist-r"\u003e\u003cspan class="vlist" style="height:2.166483em;"\u003e\u003cspan class="svg-align" style="top:-5em;"\u003e\u003cspan class="pstrut" style="height:5em;"\u003e\u003c/span\u003e\u003cspan class="mord" style="padding-left:1em;"\u003e\u003cspan class="mord mathdefault" style="margin-right:0.05278em;"\u003eβ\u003c/span\u003e\u003cspan class="mspace" style="margin-right:0.2777777777777778em;"\u003e\u003c/span\u003e\u003cspan class="mrel"\u003e≡\u003c/span\u003e\u003cspan class="mspace" style="margin-right:0.2777777777777778em;"\u003e\u003c/span\u003e\u003cspan class="mord"\u003e\u003cspan class="mopen nulldelimiter"\u003e\u003c/span\u003e\u003cspan class="mfrac"\u003e\u003cspan class="vlist-t vlist-t2"\u003e\u003cspan class="vlist-r"\u003e\u003cspan class="vlist" style="height:1.7512159999999999em;"\u003e\u003cspan style="top:-2.314em;"\u003e\u003cspan class="pstrut" style="height:3em;"\u003e\u003c/span\u003e\u003cspan class="mord"\u003e\u003cspan class="mord mathdefault" style="margin-right:0.02778em;"\u003eθ\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style="top:-3.23em;"\u003e\u003cspan class="pstrut" style="height:3em;"\u003e\u003c/span\u003e\u003cspan class="frac-line" style="border-bottom-width:0.04em;"\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style="top:-3.871108em;"\u003e\u003cspan class="pstrut" style="height:3em;"\u003e\u003c/span\u003e\u003cspan class="mord"\u003e\u003cspan class="mord"\u003e\u003cspan class="mopen nulldelimiter"\u003e\u003c/span\u003e\u003cspan class="mfrac"\u003e\u003cspan class="vlist-t vlist-t2"\u003e\u003cspan class="vlist-r"\u003e\u003cspan class="vlist" style="height:0.8801079999999999em;"\u003e\u003cspan style="top:-2.6550000000000002em;"\u003e\u003cspan class="pstrut" style="height:3em;"\u003e\u003c/span\u003e\u003cspan class="sizing reset-size6 size3 mtight"\u003e\u003cspan class="mord mtight"\u003e\u003cspan class="mord mtight" style="margin-right:0.05556em;"\u003e∂\u003c/span\u003e\u003cspan class="mord mathdefault mtight" style="margin-right:0.03588em;"\u003ey\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style="top:-3.23em;"\u003e\u003cspan class="pstrut" style="height:3em;"\u003e\u003c/span\u003e\u003cspan class="frac-line" style="border-bottom-width:0.04em;"\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style="top:-3.394em;"\u003e\u003cspan class="pstrut" style="height:3em;"\u003e\u003c/span\u003e\u003cspan class="sizing reset-size6 size3 mtight"\u003e\u003cspan class="mord mtight"\u003e\u003cspan class="mord mtight" style="margin-right:0.05556em;"\u003e∂\u003c/span\u003e\u003cspan class="mord mathdefault mtight"\u003ex\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan class="vlist-s"\u003e​\u003c/span\u003e\u003c/span\u003e\u003cspan class="vlist-r"\u003e\u003cspan class="vlist" style="height:0.481108em;"\u003e\u003cspan\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan class="mclose nulldelimiter"\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan class="vlist-s"\u003e​\u003c/span\u003e\u003c/span\u003e\u003cspan class="vlist-r"\u003e\u003cspan class="vlist" style="height:0.686em;"\u003e\u003cspan\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan class="mclose nulldelimiter"\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style="top:-4.126483em;"\u003e\u003cspan class="pstrut" style="height:5em;"\u003e\u003c/span\u003e\u003cspan class="hide-tail" style="min-width:1.02em;height:3.08em;"\u003e\u003csvg width="400em" height="3.08em" viewBox="0 0 400000 3240" preserveAspectRatio="xMinYMin slice"\u003e\u003cpath d="M473,2793c339.3,-1799.3,509.3,-2700,510,-2702\nc3.3,-7.3,9.3,-11,18,-11H400000v40H1017.7s-90.5,478,-276.2,1466c-185.7,988,\n-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,\n-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200c0,-1.3,-5.3,8.7,-16,30c-10.7,\n21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26s76,-153,76,-153s77,-151,\n77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,606z\nM1001 80H400000v40H1017z"\u003e\u003c/path\u003e\u003c/svg\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan class="vlist-s"\u003e​\u003c/span\u003e\u003c/span\u003e\u003cspan class="vlist-r"\u003e\u003cspan class="vlist" style="height:0.8735170000000001em;"\u003e\u003cspan\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u0026nbsp;\u003c/span\u003e\u0026nbsp;Multiple choice latex\u003cbr\u003e\u003c/p\u003e\u003cp\u003e\u003c/p\u003e',
                media: [],
              },
              options: [
                {
                  math: {
                    latex: ["\\beta\\left|\\left|3\\right|\\right|"],
                    template: "{$0}\u0026nbsp;",
                  },
                  type: "text",
                  hasMath: true,
                  text:
                    '\u003cp\u003e\u003cspan class="katex-container" data-idx="0" contenteditable="false"\u003e\u0026nbsp;\u003cspan class="katex-display"\u003e\u003cspan class="katex"\u003e\u003cspan class="katex-mathml"\u003e\u003cmath\u003e\u003csemantics\u003e\u003cmrow\u003e\u003cmi\u003eβ\u003c/mi\u003e\u003cmrow\u003e\u003cmo fence="true"\u003e∣\u003c/mo\u003e\u003cmrow\u003e\u003cmo fence="true"\u003e∣\u003c/mo\u003e\u003cmn\u003e3\u003c/mn\u003e\u003cmo fence="true"\u003e∣\u003c/mo\u003e\u003c/mrow\u003e\u003cmo fence="true"\u003e∣\u003c/mo\u003e\u003c/mrow\u003e\u003c/mrow\u003e\u003cannotation encoding="application/x-tex"\u003e\\beta\\left|\\left|3\\right|\\right|\u003c/annotation\u003e\u003c/semantics\u003e\u003c/math\u003e\u003c/span\u003e\u003cspan class="katex-html" aria-hidden="true"\u003e\u003cspan class="base"\u003e\u003cspan class="strut" style="height:1em;vertical-align:-0.25em;"\u003e\u003c/span\u003e\u003cspan class="mord mathdefault" style="margin-right:0.05278em;"\u003eβ\u003c/span\u003e\u003cspan class="mspace" style="margin-right:0.16666666666666666em;"\u003e\u003c/span\u003e\u003cspan class="minner"\u003e\u003cspan class="mopen delimcenter" style="top:0em;"\u003e∣\u003c/span\u003e\u003cspan class="minner"\u003e\u003cspan class="mopen delimcenter" style="top:0em;"\u003e∣\u003c/span\u003e\u003cspan class="mord"\u003e3\u003c/span\u003e\u003cspan class="mclose delimcenter" style="top:0em;"\u003e∣\u003c/span\u003e\u003c/span\u003e\u003cspan class="mclose delimcenter" style="top:0em;"\u003e∣\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u0026nbsp;\u003c/span\u003e\u0026nbsp;\u003c/p\u003e',
                  media: [],
                },
                {
                  math: {
                    latex: ["\\oint_x^y\\oint_x^y123"],
                    template:
                      "\u003cp\u003e{$0}\u0026nbsp;\u0026lt;--\u003c/p\u003e",
                  },
                  type: "text",
                  hasMath: true,
                  text:
                    '\u003cp\u003e\u003cspan class="katex-container" data-idx="0" contenteditable="false"\u003e\u0026nbsp;\u003cspan class="katex-display"\u003e\u003cspan class="katex"\u003e\u003cspan class="katex-mathml"\u003e\u003cmath\u003e\u003csemantics\u003e\u003cmrow\u003e\u003cmsubsup\u003e\u003cmo\u003e∮\u003c/mo\u003e\u003cmi\u003ex\u003c/mi\u003e\u003cmi\u003ey\u003c/mi\u003e\u003c/msubsup\u003e\u003cmsubsup\u003e\u003cmo\u003e∮\u003c/mo\u003e\u003cmi\u003ex\u003c/mi\u003e\u003cmi\u003ey\u003c/mi\u003e\u003c/msubsup\u003e\u003cmn\u003e123\u003c/mn\u003e\u003c/mrow\u003e\u003cannotation encoding="application/x-tex"\u003e\\oint_x^y\\oint_x^y123\u003c/annotation\u003e\u003c/semantics\u003e\u003c/math\u003e\u003c/span\u003e\u003cspan class="katex-html" aria-hidden="true"\u003e\u003cspan class="base"\u003e\u003cspan class="strut" style="height:2.326242em;vertical-align:-0.9119499999999999em;"\u003e\u003c/span\u003e\u003cspan class="mop"\u003e\u003cspan class="mop op-symbol large-op" style="margin-right:0.44445em;position:relative;top:-0.0011249999999999316em;"\u003e∮\u003c/span\u003e\u003cspan class="msupsub"\u003e\u003cspan class="vlist-t vlist-t2"\u003e\u003cspan class="vlist-r"\u003e\u003cspan class="vlist" style="height:1.4142920000000003em;"\u003e\u003cspan style="top:-1.7880500000000001em;margin-left:-0.44445em;margin-right:0.05em;"\u003e\u003cspan class="pstrut" style="height:2.7em;"\u003e\u003c/span\u003e\u003cspan class="sizing reset-size6 size3 mtight"\u003e\u003cspan class="mord mathdefault mtight"\u003ex\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style="top:-3.812900000000001em;margin-right:0.05em;"\u003e\u003cspan class="pstrut" style="height:2.7em;"\u003e\u003c/span\u003e\u003cspan class="sizing reset-size6 size3 mtight"\u003e\u003cspan class="mord mathdefault mtight" style="margin-right:0.03588em;"\u003ey\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan class="vlist-s"\u003e​\u003c/span\u003e\u003c/span\u003e\u003cspan class="vlist-r"\u003e\u003cspan class="vlist" style="height:0.9119499999999999em;"\u003e\u003cspan\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan class="mspace" style="margin-right:0.16666666666666666em;"\u003e\u003c/span\u003e\u003cspan class="mop"\u003e\u003cspan class="mop op-symbol large-op" style="margin-right:0.44445em;position:relative;top:-0.0011249999999999316em;"\u003e∮\u003c/span\u003e\u003cspan class="msupsub"\u003e\u003cspan class="vlist-t vlist-t2"\u003e\u003cspan class="vlist-r"\u003e\u003cspan class="vlist" style="height:1.4142920000000003em;"\u003e\u003cspan style="top:-1.7880500000000001em;margin-left:-0.44445em;margin-right:0.05em;"\u003e\u003cspan class="pstrut" style="height:2.7em;"\u003e\u003c/span\u003e\u003cspan class="sizing reset-size6 size3 mtight"\u003e\u003cspan class="mord mathdefault mtight"\u003ex\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style="top:-3.812900000000001em;margin-right:0.05em;"\u003e\u003cspan class="pstrut" style="height:2.7em;"\u003e\u003c/span\u003e\u003cspan class="sizing reset-size6 size3 mtight"\u003e\u003cspan class="mord mathdefault mtight" style="margin-right:0.03588em;"\u003ey\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan class="vlist-s"\u003e​\u003c/span\u003e\u003c/span\u003e\u003cspan class="vlist-r"\u003e\u003cspan class="vlist" style="height:0.9119499999999999em;"\u003e\u003cspan\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan class="mspace" style="margin-right:0.16666666666666666em;"\u003e\u003c/span\u003e\u003cspan class="mord"\u003e1\u003c/span\u003e\u003cspan class="mord"\u003e2\u003c/span\u003e\u003cspan class="mord"\u003e3\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u0026nbsp;\u003c/span\u003e\u0026nbsp;\u0026lt;--\u003c/p\u003e',
                  media: [],
                },
                {
                  math: {
                    latex: [],
                    template: "\u003cp\u003e11\u003c/p\u003e",
                  },
                  type: "text",
                  hasMath: true,
                  text: "\u003cp\u003e11\u003c/p\u003e",
                  media: [],
                },
                {
                  math: {
                    latex: [],
                    template: "\u003cp\u003e66\u003c/p\u003e",
                  },
                  type: "text",
                  hasMath: true,
                  text: "\u003cp\u003e66\u003c/p\u003e",
                  media: [],
                },
              ],
              hasMath: true,
            },
            answer: { answer: 1, options: null },
          },
          {
            _id: "608adef4742f38001b8a374a",
            type: "MCQ",
            structure: {
              settings: { hasCorrectAnswer: true },
              kind: "MCQ",
              query: {
                math: { latex: [], template: "" },
                type: "",
                hasMath: false,
                text: "\u003cp\u003eMultiple choice with image\u003c/p\u003e",
                media: [
                  {
                    type: "image",
                    url:
                      "https://quizizz.com/media/resource/gs/quizizz-media/quizzes/1ab3a0cb-0d92-4f5e-9fd2-44882b63aa4e",
                    meta: { width: 460, height: 460, text: "", bgColor: "" },
                  },
                ],
              },
              options: [
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e1\u003c/p\u003e",
                  media: [],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e2\u003c/p\u003e",
                  media: [],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e3 \u0026lt;-\u003c/p\u003e",
                  media: [],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e4\u003c/p\u003e",
                  media: [],
                },
              ],
              hasMath: false,
            },
            answer: { answer: 2, options: null },
          },
          {
            _id: "608adf82742f38001b8a3772",
            type: "MSQ",
            structure: {
              settings: { hasCorrectAnswer: true },
              kind: "MSQ",
              query: {
                math: { latex: [], template: "" },
                type: "",
                hasMath: false,
                text:
                  "\u003cp\u003echeckbox with image in question and answers\u003c/p\u003e",
                media: [
                  {
                    type: "image",
                    url:
                      "https://quizizz.com/media/resource/gs/quizizz-media/quizzes/4b92577d-6cc1-43af-99f1-5b967d6d6755",
                    meta: { width: 459, height: 459, text: "", bgColor: "" },
                  },
                ],
              },
              options: [
                {
                  math: { latex: [], template: "" },
                  type: "image",
                  hasMath: false,
                  text: "",
                  media: [
                    {
                      type: "image",
                      url:
                        "https://quizizz.com/media/resource/gs/quizizz-media/quizzes/df67b574-0be0-41a0-85e9-39e8e56ee3a1",
                      meta: { width: 512, height: 403, text: "", bgColor: "" },
                    },
                  ],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e2\u003c/p\u003e",
                  media: [],
                },
                {
                  math: { latex: [], template: "" },
                  type: "image",
                  hasMath: false,
                  text: "",
                  media: [
                    {
                      type: "image",
                      url:
                        "https://quizizz.com/media/resource/gs/quizizz-media/quizzes/f9e2a3b5-ae3b-4fe8-a59c-a9177248e484",
                      meta: { width: 800, height: 800, text: "", bgColor: "" },
                    },
                  ],
                },
                {
                  math: { latex: [], template: "" },
                  type: "text",
                  hasMath: false,
                  text: "\u003cp\u003e4\u003c/p\u003e",
                  media: [],
                },
              ],
              hasMath: false,
            },
            answer: { answer: [0, 2], options: null },
          },
        ],
      };

      /*if (!json.answers) {
        fetchedAnswers.value = [];
        return;
      }*/

      fetchedAnswers.value = x.answers as any; //json.answers;

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
