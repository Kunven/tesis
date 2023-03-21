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
        <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="Inicio" href="/home" ></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Citas" value="Consultas" href="/consultas" v-if="pantallas_num.filter(e => e == 1).length == 1"></v-list-item>
        <!-- <v-list-item prepend-icon="mdi-forum" title="Fichas Medicas" value="Fichas" href="fichas" v-if="rol == 1"></v-list-item> -->
        <v-list-item prepend-icon="mdi-forum" title="Mi Usuario" value="usuario" href="usuario" v-if="pantallas_num.filter(e => e == 2).length == 1"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Administracion" value="adminHome" href="adminHome" v-if="pantallas_num.filter(e => e == 3).length == 1"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Administracion de Usuarios" value="usuario" href="admin" v-if="pantallas_num.filter(e => e == 4).length == 1"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Administracion de Citas" value="usuario" href="adminCitas" v-if="pantallas_num.filter(e => e == 5).length == 1"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Administracion de Pagos" value="usuario" href="adminPagos" v-if="pantallas_num.filter(e => e == 6).length == 1"></v-list-item>
        <!-- <v-list-item prepend-icon="mdi-forum" title="Administracion de Fichas Medicas" value="usuario" href="fichas" v-if="pantallas_num.filter(e => e == 7).length == 1"></v-list-item> -->
        <v-list-item prepend-icon="mdi-forum" title="Roles" value="usuario" href="permisos" v-if="pantallas_num.filter(e => e == 8).length == 1"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Ubicaciones" value="usuario" href="ubicaciones" v-if="pantallas_num.filter(e => e == 9).length == 1"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Parametros" value="usuario" href="parametros" v-if="pantallas_num.filter(e => e == 10).length == 1"></v-list-item>
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
    let pantallas_num = ref([])
    onMounted(async () =>{
      let user = auth.currentUser
      let res = await db.collection('users').doc(user.uid).get()                  
      rol.value = res.data().rol      
      let pantallas = await db.collection('roles').doc(rol.value.toString()).collection('permisos').doc('pantallas').get()
      pantallas_num.value = Object.values(pantallas.data().pantallas)
      nombre.value = res.data().first_name
      apellido.value = res.data().last_name            
    })
    return {
      rol,nombre,apellido,pantallas_num,
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


