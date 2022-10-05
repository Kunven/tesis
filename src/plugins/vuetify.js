// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
/* 
    #6e95a3 - dark blue
    #ebd8a0 - light brown
    #c5a576 - brown
    #aad2da - light blue

  */
import { createVuetify } from 'vuetify'

const myCustomLightTheme  = {
  dark: false,
  colors: {
    background: '#ebd8a0',
    surface: '#ebd8a0',
    primary: '#c5a576',
    'primary-darken-1': '#3700B3',
    secondary: '#c5a576',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    }
  }
})