<script lang="ts" setup>
import type { Ref } from 'vue'
import { onMounted, onUpdated, ref } from 'vue'
import QRCode from 'qrcode'
import { onUnmounted } from 'vue'
import router from '@/router'

const qrCanvas = ref() as Ref<HTMLCanvasElement | undefined>

const image = ref('')
const imageLoaded = ref(false)

const renderQrCode = () => {
  if (qrCanvas.value == null) {
    return
  }
  QRCode.toCanvas(
    qrCanvas.value,
    window._settings.picturesUrl,
    {
      errorCorrectionLevel: 'H',
      width: 200
    },
    function (error: any) {
      if (error) console.error(error)
    }
  )
}

const countdown: Ref<number | null> = ref(null)
const inactivityTime = 30
const timeoutSeconds = 10
let inactivityTimeout: NodeJS.Timeout | null = null
let countdownInterval: NodeJS.Timeout | null = null

const startGoToHomeCountdown = async () => {
  countdown.value = timeoutSeconds
  countdownInterval = setInterval(async () => {
    if (countdown.value == 0) {
      await router.replace('/')
    }
    countdown.value = countdown.value! - 1
  }, 1000)
}

const imStillHere = () => {
  clearInterval(countdownInterval!)
  countdown.value = null
  inactivityTimeout = setTimeout(() => {
    startGoToHomeCountdown()
  }, inactivityTime * 1000)
}

onMounted(() => {
  const imgName = router.currentRoute.value.params.imageName as string
  image.value = window._settings.backendUrl + '/pictures/' + imgName + '.jpg'
  renderQrCode()
  inactivityTimeout = setTimeout(() => {
    startGoToHomeCountdown()
  }, inactivityTime * 1000)
})

onUnmounted(() => {
  if (inactivityTimeout != null) {
    clearTimeout(inactivityTimeout)
  }

  if (countdownInterval != null) {
    clearInterval(countdownInterval)
  }
})

onUpdated(() => {
  renderQrCode()
})
</script>

<template>
  <main>
    <div id="countdown-overlay" v-if="countdown != null && countdown > 0">
      <div class="centered-message">
        <h1>Are you still there?</h1>
        <div class="countdown-explanation">
          This page will automatically redirect to the home page in
        </div>
        <div class="countdown-text">{{ countdown }}</div>
        <v-btn color="blue" @click="imStillHere" class="still-here-btn">I'm still here!</v-btn>
      </div>
    </div>
    <div id="qr-code">
      <div class="google-photos-desc">
        <img src="/public/google-photos-logo.svg" class="google-photos-logo" />
        <p>Scan the QR code <br />to view all the pictures</p>
      </div>
      <canvas ref="qrCanvas" class="qr-code"></canvas>
    </div>
    <v-card class="card">
      <v-card-title>Here is your picture!</v-card-title>
      <v-card-subtitle>
        The picture has been automatically uploaded to Google Photos! <br />You can now take another
        picture or terminate your session.
      </v-card-subtitle>
      <v-card-text>
        <img
          ref="imageElement"
          class="full-screen-image"
          :class="{ pictureVisible: imageLoaded }"
          @load="imageLoaded = true"
          :src="image"
        />
      </v-card-text>
      <v-card-actions class="card-actions">
        <v-btn color="deep-purple" prepend-icon="mdi-camera-plus" variant="tonal" to="/take-picture"
          >Take another picture</v-btn
        >
        <v-btn prepend-icon="mdi-home" color="blue" variant="tonal" to="/">Home</v-btn>
      </v-card-actions>
    </v-card>
  </main>
</template>

<style lang="scss" scoped>
#countdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  .centered-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .countdown-text {
    font-size: 10rem;
    color: white;
    text-align: center;
  }

  .still-here-btn {
    margin-top: 1rem;
  }
}

#qr-code {
  color: #000;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px 0px #0000005b;
  border-radius: 5px;
  text-align: center;
  align-items: center;
  $padding: 20px;
  $size: 300px;
  background-color: #fff;
  padding: 20px 5px 20px 5px;
  position: fixed;

  $space: 10px;
  top: $space;
  right: $space;

  width: $size;
  z-index: 100;

  img.google-photos-logo {
    max-height: 50px;
    width: 100%;
    margin-bottom: 10px;
  }
}
.card {
  display: flex;
  flex-direction: column;
  position: absolute;
  $space: 50px;
  top: $space;
  right: $space;
  left: $space;
  bottom: $space;
}

.full-screen-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-height: 65vh;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.5s;
  &.pictureVisible {
    opacity: 1;
  }
}

.card-actions {
  display: flex;
  column-gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}
</style>
