import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import VCalendar from 'v-calendar';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(VueSweetalert2)
  .use(createPinia())
  .use(VCalendar, {})
  .mount('#app')
