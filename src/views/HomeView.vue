<template>
  <div class="home lg:p-20 p-5 lg:mt-0 mt-20">
    <div class="container lg:max-w-2xl max-w-full mx-auto box-border">
      <div class="text-center pb-10 space-y-3">
        <h2 class="text-4xl text-white font-bold">Focodoro</h2>
        <p class="text-sm font-semibold text-white">
          {{
            !message
              ? "helps you to be more consistent in managing your focus time better, doing daily activities"
              : message
          }}
        </p>
      </div>
      <div class="w-full p-8 box-border bg-white/20 rounded-md shadow">
        <div class="pb-3 flex gap-5 justify-center">
          <button
            @click="focusTime(7200)"
            :class="{ 'bg-red-600': timeTofocus }"
            class="p-1 px-3 rounded text-white"
          >
            Focus
          </button>
          <button
            :class="{ 'bg-green-800': pomodoro }"
            class="p-1 px-3 rounded text-white"
            @click="pomodoroTime(1500)"
          >
            Pomodoro
          </button>
          <button
            :class="{ 'bg-orange-600': timeTobreak }"
            class="p-1 px-3 rounded text-white"
            @click="breakTime(900)"
          >
            Break 15 Minutes
          </button>
        </div>
        <h1
          class="lg:text-9xl text-5xl box-border text-center font-semibold text-white"
        >
          {{
            !remainingTime ? formatTime(timeUsed) : formatTime(remainingTime)
          }}
        </h1>
        <div class="flex justify-center gap-5 mt-10">
          <button
            v-if="!remainingTime"
            @click="start(timeUsed)"
            :class="
              timeTofocus
                ? 'text-red-600 shadow-red-700'
                : pomodoro
                ? 'text-green-600 shadow-green-700'
                : 'text-orange-600 shadow-orange-700'
            "
            class="btn uppercase bg-white text-lg px-12 py-2 shadow rounded-sm font-bold"
          >
            Start
          </button>
          <button
            v-else-if="!isPaused"
            @click="pause"
            :class="
              timeTofocus
                ? 'text-red-600 shadow-red-700'
                : pomodoro
                ? 'text-green-600 shadow-green-700'
                : 'text-orange-600 shadow-orange-700'
            "
            class="btn uppercase bg-white text-lg px-12 py-2 shadow rounded-sm font-bold"
          >
            Pause
          </button>
          <button
            v-else
            @click="resume"
            :class="
              timeTofocus
                ? 'text-red-600 shadow-red-700'
                : pomodoro
                ? 'text-green-600 shadow-green-700'
                : 'text-orange-600 shadow-orange-700'
            "
            class="btn uppercase bg-white text-lg px-12 py-2 shadow rounded-sm font-bold"
          >
            Resume
          </button>
          <button
            v-if="remainingTime"
            @click="stop"
            :class="
              timeTofocus
                ? 'text-red-600 shadow-red-700'
                : pomodoro
                ? 'text-green-600 shadow-green-700'
                : 'text-orange-600 shadow-orange-700'
            "
            class="btn uppercase bg-white text-lg px-12 py-2 shadow rounded-sm font-bold"
          >
            Stop
          </button>
        </div>
      </div>
      <h2 class="text-sm text-white text-center mt-5">
        Created by Mohammad Sahrullah
      </h2>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import { useHead } from "unhead";
  import { identifier } from "@babel/types";
  export default defineComponent({
    name: "HomeView",
    data() {
      return {
        remainingTime: 0,
        interval: 0,
        isPaused: false,
        message: "",
        speedInterval: 1000,
        timeUsed: 7200,
        timeTofocus: true,
        timeTobreak: false,
        pomodoro: false,
      };
    },
    methods: {
      start(time: number): void {
        // 2 jam = 7200
        this.remainingTime = time;
        this.interval = setInterval(() => {
          if (!this.isPaused) {
            this.remainingTime--;
            if (this.remainingTime === 0) {
              clearInterval(this.interval);
              useHead({
                title: "Times up!",
              });
              this.sound("bell");
              if (this.pomodoro) {
                this.breakTime(900);
                this.start(900);
              } else if (this.timeTobreak) {
                this.pomodoroTime(1500);
                this.start(1500);
              }
            }
          }
        }, this.speedInterval);
        this.sound("click");
      },

      sound(type: string): void {
        let bell: string = require("@/assets/media/bell.mp3");
        let click: string = require("@/assets/media/click.wav");
        let clickclose: string = require("@/assets/media/click-close.wav");
        let sound: string =
          type === "bell" ? bell : type === "click" ? click : clickclose;
        let audio = new Audio(sound);
        audio.play();
      },
      focusTime(time: number): void {
        document.body.classList.add("bg-red-500");
        document.body.classList.remove("bg-orange-600");
        document.body.classList.remove("bg-green-600");
        this.timeUsed = time;
        this.stop();
        this.timeTofocus = true;
        this.pomodoro = false;
        this.timeTobreak = false;
        this.message =
          " it's time to maintain your mood and focus in activities or your work, good luck";
      },
      breakTime(time: number): void {
        document.body.classList.add("bg-orange-600");
        document.body.classList.remove("bg-red-500");
        document.body.classList.remove("bg-green-600");
        this.timeUsed = time;
        this.stop();
        this.timeTofocus = false;
        this.pomodoro = false;
        this.timeTobreak = true;
        this.message = "it's time to rest in 15 minutes to restore your energy";
      },
      pomodoroTime(time: number): void {
        this.timeUsed = time;
        document.body.classList.add("bg-green-600");
        document.body.classList.remove("bg-orange-600");
        document.body.classList.remove("bg-red-500");
        this.stop();
        this.timeTofocus = false;
        this.pomodoro = true;
        this.timeTobreak = false;
        this.message =
          "it's time to be consistent and stay focused on your activities or your work, good luck";
      },
      stop(): void {
        clearInterval(this.interval);
        this.interval = 0;
        this.isPaused = false;
        this.remainingTime = 0;
        this.sound("clickclose");
      },
      pause(): void {
        clearInterval(this.interval);
        this.interval = 0;
        this.isPaused = true;
        this.sound("click");
      },
      resume(): void {
        if (this.interval === 0) {
          this.interval = setInterval(() => {
            if (!this.isPaused) {
              this.remainingTime--;
              if (this.remainingTime === 0) {
                clearInterval(this.interval);
              }
            }
          }, 1000);
        }
        this.isPaused = false;
        this.sound("click");
      },
      formatTime(time: number): string {
        let hours: number = Math.floor(time / 3600);
        let minutes: number = Math.floor((time % 3600) / 60);
        let seconds: number = time % 60;
        let h = hours < 10 ? "0" + hours : hours;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;
        let times: any = h + ":" + m + ":" + s;
        useHead({
          title: `${times} - ${
            this.timeTofocus
              ? "Time to focus . Focodoro"
              : this.pomodoro
              ? "Pomodoro Time . Focodoro"
              : "Break Time . Focodoro"
          }`,
        });
        return h + ":" + m + ":" + s;
      },
    },
    mounted() {
      document.body.classList.add("bg-red-500");
      useHead({
        title: "Focodoro - Time To Focus",
      });
    },
  });
</script>

<style>
  body {
    @apply transition-colors duration-300;
  }
</style>
