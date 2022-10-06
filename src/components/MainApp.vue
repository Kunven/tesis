<template>
  <!-- NAVIGATION DRAWER -->
  <v-navigation-drawer permanent>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Hola! {{nombre}} {{apellido}}
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
        <!-- <v-list-item prepend-icon="mdi-forum" title="Fichas Medicas" value="Fichas" href="fichas" v-if="rol == 1"></v-list-item> -->
        <v-list-item prepend-icon="mdi-forum" title="Mi Usuario" value="usuario" href="usuario"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Cerrar Sesion" v-on:click="logout" href="/login"></v-list-item>        
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
    let nombre = ref('')
    let apellido = ref('')
    onMounted(async () =>{
      let user = auth.currentUser
      let res = await db.collection('users').doc(user.uid).get()
      rol.value = res.data().rol
      nombre.value = res.data().first_name
      apellido.value = res.data().last_name
    })
    return {
      rol,nombre,apellido,
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


