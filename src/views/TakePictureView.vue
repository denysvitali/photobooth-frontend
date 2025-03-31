<script setup lang="ts">
import { computed, watch } from 'vue'
import { ref, type Ref } from 'vue'
import Video from '../components/Video.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { onUnmounted } from 'vue'

const debug = true
let debugResult = ref('')

type CaptureResponse = {
  success: boolean
  imageName: string
}

const userError: Ref<string | null> = ref(null)
const router = useRouter()

const showUserError = (message: string) => {
  userError.value = message
  setTimeout(() => {
    userError.value = null
  }, 5000)
}

const countdown: Ref<number | null> = ref(null)
const sendTakePictureRequest = async () => {
  try {
    const url = window._settings.backendUrl + '/api/v1/take-picture'
    debugResult.value = `Sending request to ${url}`
    let req = new Request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
    let res = await fetch(req)
    if (res.ok) {
      let captureResponse = (await res.json()) as CaptureResponse
      log('Picture taken')
      try {
        await router.push('/view-picture/' + captureResponse.imageName)
      } catch (error) {
        log(`Failed to navigate to view picture: ${error}`)
      }
    } else {
      log('Failed to take picture')
      showUserError('Sorry - something went wrong. Please try again.')
    }
  } catch (error) {
    debugResult.value = error as string
  }
}

const takePicture = async () => {
  // Starts a countdown timer
  countdown.value = 3
  let interval = setInterval(async () => {
    if (countdown.value == null) {
      clearInterval(interval)
      return
    }
    countdown.value--
    if (countdown.value == 0) {
      clearInterval(interval)
      await sendTakePictureRequest()
      countdown.value = null
    }
  }, 1000)
}

interface ParamsResponse {
  allowedParams: string[]
  value: string
}

const getParamValue = async (name: string): Promise<ParamsResponse | null> => {
  let url = `${window._settings.backendUrl}/api/v1/camera/params/${name}`
  let res = await fetch(url)
  if (res.ok) {
    return (await res.json()) as ParamsResponse
  } else {
    return null
  }
}

let refreshParamsInterval: NodeJS.Timeout | null = null

onMounted(async () => {
  try {
    await refreshParams()
    refreshParamsInterval = setInterval(async () => {
      try {
        await refreshParams()
      } catch (error) {
        log(`Failed to refresh camera params: ${error}`)
      }
    }, 10 * 1000)
  } catch (error) {
    log(`Failed to refresh camera params: ${error}`)
  }
})

onUnmounted(() => {
  if (refreshParamsInterval != null) {
    clearInterval(refreshParamsInterval)
    console.log('Cleared refreshParamsInterval')
  }
})

const logMessages = ref('')
const log = (message: string) => {
  console.log('LOG: ' + message)
  logMessages.value += message + '\n'
}

interface CameraValue {
  allowedParams: string[]
  value: string
}

interface CameraInfo {
  aperture: CameraValue
  iso: CameraValue
  shutterspeed: CameraValue
  meteringmode: CameraValue
}

const allowedValues: Map<string, string[]> = new Map([])

const refreshParams = async () => {
  let url = `${window._settings.backendUrl}/api/v1/camera/info`
  let res = await fetch(url)
  if (res.ok) {
    const data = (await res.json()) as CameraInfo
    cameraSettings.value = {
      iso: data.iso.value,
      aperture: data.aperture.value,
      shutterspeed: data.shutterspeed.value,
      meteringmode: data.meteringmode.value,
      exposure: '',
      whiteBalance: ''
    }
    allowedValues.set('iso', data.iso.allowedParams)
    allowedValues.set('aperture', data.aperture.allowedParams)
    allowedValues.set('shutterspeed', data.shutterspeed.allowedParams)
    allowedValues.set('meteringmode', data.meteringmode.allowedParams)
  }
}

const setSetting = async (name: string, value: string) => {
  dialog.value = false
  let url = `${window._settings.backendUrl}/api/v1/camera/params/${name}`
  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value })
  })
  if (res.ok) {
    log(`Set ${name} to ${value}`)
    cameraSettings.value[name] = value
  } else {
    log(`Failed to set ${name} to ${value}: ${res.status}`)
  }
}

type CameraSettings = Record<string, string>
const cameraSettings: Ref<CameraSettings> = ref({
  iso: '',
  aperture: '',
  shutterspeed: '',
  exposure: '',
  meteringmode: '',
  whiteBalance: ''
})

const dialog = ref(false)
const dialogTitle = ref('')
const dialogChoice = ref('')

const lightSliderDialog = ref(false)
const brightness = ref(0)

watch(brightness, async (value) => {
  let url = `${window._settings.lightdUrl}/api/v1/set`
  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      on: true,
      brightness: value
    })
  })
  if (!res.ok) {
    log(`Failed to set LED brightness to ${value}: ${res.status}`)
  }
})

const openDialog = (name: string) => {
  lightSliderDialog.value = false
  dialog.value = true
  dialogTitle.value = name
}

const openLightSliderDialog = () => {
  dialog.value = false
  lightSliderDialog.value = true
}

const shutterSpeed = computed(() => {
  let ss = cameraSettings.value.shutterspeed
  if (ss == '' || ss == null) {
    return 'N/A'
  }
  if (ss.includes('/')) {
    return ss
  }
  if (ss == 'auto') {
    return 'Auto'
  }
  return ss + '"'
})
</script>

<template>
  <main>
    <v-dialog max-width="500" v-model="lightSliderDialog">
      <v-card title="Set LED brightness" class="light-dialog">
        <v-card-text>
          <v-slider v-model="brightness" min="0" max="32" step="1" />
          <p class="brightness">{{ Math.round((brightness / 32) * 100) }}%</p>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500" v-model="dialog" scrollable>
      <v-card :title="dialogTitle">
        <v-card-text class="px-4" style="height: 300px">
          <v-radio-group v-model="dialogChoice" row>
            <v-radio
              v-for="choice in allowedValues.get(dialogTitle)"
              :key="choice"
              :label="choice"
              :value="choice"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text="Close" color="gray" @click="dialog = false"></v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" text="Save" @click="setSetting(dialogTitle, dialogChoice)"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="countdown-overlay" v-if="countdown != null">
      <span class="text" v-if="countdown > 0">{{ countdown }}</span>
      <div class="smile-prompt" v-else>
        <VIcon>mdi-camera</VIcon>
        <span class="text">Smile!</span>
      </div>
    </div>
    <div class="usererror-overlay" v-if="userError != null">
      <span class="text">{{ userError }}</span>
    </div>
    <pre class="debug-result" v-text="logMessages" v-if="debug"></pre>
    <Video></Video>
    <div class="take-picture-action">
      <VBtn
        @click="takePicture"
        :disabled="countdown != null"
        append-icon="mdi-camera"
        class="take-picture-button"
        color="primary"
        size="x-large"
        to="/take-picture"
        >Take Picture</VBtn
      >
    </div>
    <div class="camera-params">
      <div class="chip" @click="openDialog('aperture')">f{{ cameraSettings.aperture }}</div>
      <div class="chip" @click="openDialog('iso')">ISO {{ cameraSettings.iso }}</div>
      <div class="chip" @click="openDialog('shutterspeed')">
        {{ shutterSpeed }}
      </div>
      <div class="chip" @click="openDialog('meteringmode')">
        {{ cameraSettings.meteringmode }}
      </div>
      <div class="chip" @click="openLightSliderDialog()">
        <VIcon icon="mdi-lightbulb-on-10" class="icon"></VIcon>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  background-color: #000;
}

#mjpeg-video {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 100px;
  height: 100%;
  right: 0;
  width: 100%;
  object-fit: contain;
  z-index: 100;
}

.light-dialog {
  p.brightness {
    text-align: center;
    margin-bottom: 0.5rem;
  }
}

.countdown-overlay,
.usererror-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
}

.usererror-overlay {
  font-size: 2rem;
}

.smile-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 200;

  .text {
    font-size: 3rem;
  }
}

.camera-params {
  display: flex;
  position: absolute;
  column-gap: 10px;
  left: 80px;
  bottom: 40px;
  height: 40px;
  width: 100%;
  z-index: 300;

  .chip {
    display: block;
    color: #fff;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
    background-color: #007f9698;
    border-radius: 20px;
    min-width: 100px;
    text-align: center;
    padding: 10px;
    font-size: 18px;
    line-height: 18px;

    .icon {
      height: 18px;
      line-height: 18px;
      margin-top: -4px;
    }
  }
}

.debug-result {
  position: absolute;
  top: 2rem;
  left: 2rem;
  padding: 10px;
  width: 400px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 0.4rem;
  z-index: 200;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
}

.debug-local-session-description {
  position: absolute;
  left: 2rem;
  top: 200px;
  right: 0;
  right: 2rem;
  color: white;
  font-size: 20px;
  user-select: text;
  font-family: monospace;
}

.take-picture-action {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 80px;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 299;

  .take-picture-button {
    min-height: 4rem;
    min-width: 16rem;
  }
}
</style>
