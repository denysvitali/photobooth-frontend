<script lang="ts" setup>
import { onDeactivated } from 'vue'
import { onBeforeUnmount } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'

const mpjeg: Ref<HTMLImageElement | null> = ref(null)
let ws: WebSocket | null
const wsEndpoint = window._settings.backendUrl
  .replace('http://', 'ws://')
  .replace('https://', 'wss"//')
const wsUrl = `${wsEndpoint}/api/v1/ws`

const log = (msg: string) => {
  console.log(`[Video] ${msg}`)
}

onMounted(() => {
  log('Component mounted')
  if (ws != null) {
    ws.close()
  }
  connectWs()
})

onBeforeUnmount(() => {
  console.log('Component before unmounted')
  console.log(ws)
})

onUnmounted(() => {
  console.log('Component unmounted')
  if (ws != null) {
    ws.onclose = () => {}
    ws.close()
  }
})

onDeactivated(() => {
  console.log('Component deactivated')
  if (ws != null) {
    ws.onclose = () => {}
    ws.close()
  }
})

const connectWs = () => {
  ws = new WebSocket(wsUrl)
  ws.onopen = async () => {
    log('Connected to WebSocket')
  }
  ws.onmessage = async (event) => {
    const blob = event.data as Blob
    if (blob.size === 0) {
      console.log('Received empty blob')
      ws?.close()
      return
    }
    if (mpjeg.value != null) {
      const oldUrl = mpjeg.value.src
      mpjeg.value.src = URL.createObjectURL(blob)
      if (oldUrl != '') {
        URL.revokeObjectURL(oldUrl)
      }
    }
  }
  ws.onclose = () => {
    log('WebSocket closed, reconnecting...')
    setTimeout(() => {
      connectWs()
    }, 500)
  }
}
</script>

<template>
  <img id="mjpeg-video" ref="mpjeg" />
</template>
