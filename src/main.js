import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import VCalendar from 'v-calendar';
loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(createPinia())
  .use(VCalendar, {})
  .mount('#app')
