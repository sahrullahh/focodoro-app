<template>
  <div class="home p-20">
    <div class="container max-w-2xl mx-auto box-border">
      <div class="text-center pb-10">
        <h2 class="text-2xl text-white font-bold">Focus your Activites</h2>
      </div>
      <div class="w-full p-8 box-border bg-white/20 rounded-md shadow">
        <div class="pb-3 flex gap-5 justify-center">
          <button
            @click="focusTime(7200)"
            :class="{ 'bg-green-800': timeTofocus }"
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
            :class="{ 'bg-green-800': timeTobreak }"
            class="p-1 px-3 rounded text-white"
            @click="breakTime(900)"
          >
            Break 15 Minutes
          </button>
        </div>
        <h1 class="text-9xl box-border text-center font-semibold text-white">
          {{ !remainingTime ? formatTime(7200) : formatTime(remainingTime) }}
        </h1>
        <div class="flex justify-center gap-5 mt-10">
          <button
            v-if="!remainingTime"
            @click="focusTime(7200)"
            class="btn uppercase bg-white text-green-600 text-lg px-12 py-2 shadow rounded-sm shadow-green-700 font-bold"
          >
            Start
          </button>
          <button
            v-else-if="!isPaused"
            @click="pause"
            class="btn uppercase bg-white text-green-600 text-lg px-12 py-2 shadow rounded-sm shadow-green-700 font-bold"
          >
            Pause
          </button>
          <button
            v-else
            @click="resume"
            class="btn uppercase bg-white text-green-600 text-lg px-12 py-2 shadow rounded-sm shadow-green-700 font-bold"
          >
            Resume
          </button>
          <button
            v-if="remainingTime"
            @click="stop"
            class="btn uppercase bg-white text-green-600 text-lg px-12 py-2 shadow rounded-sm shadow-green-700 font-bold"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import { useHead } from "unhead";
  export default defineComponent({
    name: "HomeView",
    data() {
      return {
        remainingTime: 0,
        interval: 0,
        isPaused: false,
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
              this.timeTofocus = true;
              this.pomodoro = false;
              this.timeTobreak = false;
              useHead({
                title: "Times up!",
              });
              this.sound();
              this.breakTime(900, false);
            }
          }
        }, 1000);
      },
      sound() {
        let url: string = require("@/assets/media/bell.mp3");
        let audio = new Audio(url);
        audio.play();
      },
      focusTime(time: number): void {
        this.stop();
        setTimeout(() => {
          this.start(time);
          this.timeTofocus = true;
          this.pomodoro = false;
          this.timeTobreak = false;
        }, 10);
      },
      breakTime(time: number, repeat?: boolean): void {
        this.stop();
        if (repeat) {
          setTimeout(() => {
            this.start(time);
            this.timeTofocus = false;
            this.pomodoro = false;
            this.timeTobreak = true;
          }, 10);
        }
      },
      pomodoroTime(time: number): void {
        this.stop();
        setTimeout(() => {
          this.start(time);
          this.timeTofocus = false;
          this.pomodoro = true;
          this.timeTobreak = false;
        }, 10);
      },
      stop(): void {
        clearInterval(this.interval);
        this.interval = 0;
        this.isPaused = false;
        this.remainingTime = 0;
        this.timeTofocus = true;
        this.pomodoro = false;
        this.timeTobreak = false;
      },
      pause(): void {
        clearInterval(this.interval);
        this.interval = 0;
        this.isPaused = true;
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
              ? "Time to focus"
              : this.pomodoro
              ? "Pomodoro Time"
              : "Break Time"
          }`,
        });
        return h + ":" + m + ":" + s;
      },
    },
    mounted() {
      useHead({
        title: "Time for focus - Build with Moh Sahrullah",
      });
    },
  });
</script>

<style>
  body {
    @apply bg-green-600;
  }
</style>
