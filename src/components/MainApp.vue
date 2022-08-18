<template>
  <!-- NAVIGATION DRAWER -->
  <v-navigation-drawer permanent>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        density="compact"
        nav
      >
        <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="Inicio" href="/home"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Consultas" value="Consultas" href="/consultas"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Fichas Medicas" value="Fichas" href="fichas"></v-list-item>        
        <v-list-item prepend-icon="mdi-forum" title="Cerrar Sesion" v-on:click="logout"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  <!-- END NAVIGATION DRAWER -->
  <router-view/> <!-- ROUTER VIEW FOR COMPONENTS -->
</template>
<script>
import { auth } from "../firebase"
import { useMainStore} from '../store/mainStore'
export default {
  setup() {
    return {
      logout(){      
      auth.signOut().then(() =>{
      const store = useMainStore()
      store.LoggedIn = false
      })
    },
    }
  },
}
</script>


