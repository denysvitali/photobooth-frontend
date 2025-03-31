import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'
import '@mdi/font/css/materialdesignicons.css'
import '@fontsource/dancing-script'
import './assets/main.scss'

import App from './App.vue'
import router from './router'

const myTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#09b9b4',
    surface: '#FFFFFF'
  },
  variables: {
    'theme-on-primary': '#222'
  }
}

declare global {
  interface Window {
    _settings: Settings
  }
}

const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    VBtn: {
      class: 'my-custom-button'
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  blueprint: md3,
  theme: {
    defaultTheme: 'myTheme',
    themes: {
      myTheme
    }
  }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)

// Load settings first
fetch('/settings.json')
  .then((response) => response.json())
  .then((data) => {
    window._settings = data
    app.mount('#app')
  })
