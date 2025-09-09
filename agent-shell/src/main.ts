import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { vuetify } from './plugins/vuetify' // Importe o vuetify

const app = createApp(App)

app.use(createPinia())
app.use(vuetify) // Use o vuetify

app.mount('#app')
