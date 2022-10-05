<template>
  <!-- NAVIGATION DRAWER -->
  <v-navigation-drawer permanent>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Menu
          </v-list-item-title>          
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        density="compact"
        nav
      >
        <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="Inicio" href="/home"></v-list-item>        
        <v-list-item prepend-icon="mdi-forum" title="Citas" value="Consultas" href="/consultas"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Fichas Medicas" value="Fichas" href="fichas" v-if="rol == 1"></v-list-item>        
        <v-list-item prepend-icon="mdi-forum" title="Cerrar Sesion" v-on:click="logout"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  <!-- END NAVIGATION DRAWER -->
  <router-view/> <!-- ROUTER VIEW FOR COMPONENTS -->
</template>
<script>
import { auth,db } from "../firebase.js"  
import { useMainStore} from '../store/mainStore'
import { ref,onMounted } from 'vue'
export default {
  setup() {  
    let rol = ref(0)      
    onMounted(async () =>{
      let user = auth.currentUser
      let res = await db.collection('users').doc(user.uid).get()
      rol.value = res.data().rol
    })
    return {
      rol,
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


