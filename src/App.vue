<script setup lang="ts">
import { RouterView } from 'vue-router'
import router from './router'
import { ref } from 'vue'
import type { Ref } from 'vue'

const debug = false
let seq: Ref<number[]> = ref([])
let lastTouch = -1
const highlight: Ref<boolean[]> = ref([false, false, false])

const correctSequence = (seq: number[]) => {
  return seq.join('') === '123'
}
const touch = async (area: number) => {
  highlight.value[area - 1] = true
  setTimeout(() => {
    highlight.value[area - 1] = false
  }, 100)
  if (Date.now() - lastTouch < 1000) {
    seq.value = []
    lastTouch = Date.now()
    seq.value.push(area)
    return
  }
  seq.value.push(area)
  // take just the last three touches
  seq.value = seq.value.slice(-3)
  if (correctSequence(seq.value)) {
    console.log('Valid sequence detected, redirecting to /admin')
    await router.push('/admin')
    seq.value = []
  }
}
</script>

<template>
  <VApp>
    <div
      class="secret-touch-area touch-area-1"
      @click="touch(1)"
      :class="{
        touched: highlight[0]
      }"
    ></div>
    <div
      class="secret-touch-area touch-area-2"
      @click="touch(2)"
      :class="{
        touched: highlight[1]
      }"
    ></div>
    <div
      class="secret-touch-area touch-area-3"
      @click="touch(3)"
      :class="{
        touched: highlight[2]
      }"
    ></div>
    <div
      class="secret-touch-area touch-area-4"
      @click="touch(4)"
      :class="{
        touched: highlight[3]
      }"
    ></div>
    <div class="secret-touch-sequence" v-if="debug">{{ seq }}</div>
    <VMain>
      <VContainer fluid class="full-screen">
        <RouterView :key="$router.currentRoute.value.fullPath" />
      </VContainer>
    </VMain>
  </VApp>
</template>

<style scoped>
.full-screen {
  height: 100%;
  padding: 100px;
}

.secret-touch-area {
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: rgba(255, 0, 0, 0.007);
  z-index: 3000;
}

.secret-touch-area.touched {
  background-color: rgba(255, 0, 0, 0.7);
}

.touch-area-1 {
  top: 0;
  left: 0;
}

.touch-area-2 {
  top: 0;
  right: 0;
}

.touch-area-3 {
  bottom: 0;
  left: 0;
}

.touch-area-4 {
  bottom: 0;
  right: 0;
}

.secret-touch-sequence {
  position: fixed;
  top: 0;
  right: 50vw;
  z-index: 3000;
  background-color: white;
  padding: 10px;
  font-size: 2rem;
  font-weight: bold;
  color: black;
}
</style>
