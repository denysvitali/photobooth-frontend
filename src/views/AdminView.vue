<script lang="ts" setup>
import { ref } from 'vue'

const logs = ref('')
const addToLog = (msg: string) => {
  const now = new Date().toLocaleTimeString()
  logs.value += `${now}: ${msg}\n`
}
const resetCamera = async () => {
  try {
    let req = new Request(`${window._settings.backendUrl}/api/v1/camera/reinit`, {
      method: 'POST'
    })
    let res = await fetch(req)
    if (res.ok) {
      addToLog('Camera reset successful')
    } else {
      addToLog('Camera reset failed')
    }
  } catch (e: any) {
    addToLog(e.toString())
  }
}

const enableLeds = async () => {
  addToLog('Enabling LEDs')
  setLight(16)
}

const disableLeds = async () => {
  addToLog('Disabling LEDs')
  setLight(0)
}

const setLight = async (value: number) => {
  addToLog(`Setting light to ${value}`)
  try {
    let req = new Request(`${window._settings.lightdUrl}/api/v1/set`, {
      method: 'POST',
      body: JSON.stringify({
        on: value != 0,
        brightness: value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let res = await fetch(req)
    if (res.ok) {
      addToLog('Light set successful')
    } else {
      addToLog('Light set failed')
    }
  } catch (e: any) {
    addToLog(e.toString())
  }
}
</script>

<template>
  <main>
    <h1>Admin</h1>
    <h3>Navigate to</h3>
    <ul class="navigate-to">
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/start">Start</RouterLink></li>
    </ul>
    <h2>Options</h2>
    <div class="options">
      <v-btn color="blue" @click="resetCamera" prepend-icon="mdi-camera-retake" variant="tonal"
        >Reset Camera</v-btn
      >
      <v-btn color="blue" @click="enableLeds" prepend-icon="mdi-led-strip-variant" variant="tonal"
        >Enable LEDs (50%)</v-btn
      >
      <v-btn
        color="blue"
        @click="disableLeds"
        prepend-icon="mdi-led-strip-variant-off"
        variant="tonal"
        >Disable LEDs</v-btn
      >
    </div>

    <h2>Logs</h2>
    <pre class="logs" v-text="logs"></pre>
  </main>
</template>

<style lang="scss" scoped>
ul.navigate-to {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  list-style-type: none;
}

h1,
h2,
h3 {
  $m: 0.5em;
  margin-top: $m;
  margin-bottom: $m;
}

.options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

pre.logs {
  display: flex;
  flex-direction: column-reverse;
  font-size: 0.8rem;
  max-height: 300px;
  overflow-y: scroll;
}
</style>
