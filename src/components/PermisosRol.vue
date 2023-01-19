<template>
  <div v-if="userRole == 2">
    <v-card class="mx-2 mt-3">
      <h1>Permisos por Rol</h1>
    </v-card>
    <v-table class="mx-2 my-1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Rol</th>
          <th>Modificado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in roles"
          :key="item.id"
        > 
          <td>{{ item.id }}</td>
          <td>{{ item.nombre }}</td>
          <td>17/01/2023</td>
          <td>
            <v-dialog v-model="modalRoles">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  v-bind="props"
                  @click="setRol(item.id,item.nombre)"
                >
                  Modificar Permisos
                </v-btn>
              </template>
              <v-card>
                <v-card>Permisos de {{ rol }}</v-card>
                <v-card-text>
                  <v-btn class="mb-5" color="primary" @click="addRol">Agregar</v-btn>
                  <div v-for="(item,index) in permisosRol" :key="item">
                    <v-row>
                      <v-select class="mr-5 ml-5" :items="pantallasData" item-title="nombre" item-value="id" label="Pantallas" v-model="item.pantalla_id"></v-select>
                      <v-btn color="primary" @click="delRol(index)">Quitar</v-btn>
                    </v-row>                  
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="submitForm">Submit</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
  <div v-else>
    <v-card class="mx-2 mt-3">
      <h1>No Tiene Permisos Para Ver Esta Pagina</h1>
    </v-card>
  </div>
</template>

<script>
import { useMainStore} from '../store/mainStore'
import { db } from "../firebase.js"
import { ref,onMounted } from 'vue'
import {pantallas} from '../assets/pantallas.js'
export default {
  setup() {
    const store = useMainStore()
    let permisosRol = ref([{index: 1, pantalla_id: 1}])
    let modalRoles = ref(false)
    let userRole = store.rol
    let rol = ref('Usuario')
    let rolId = ref(0)
    let roles = ref([])
    let pantallasData = pantallas
    onMounted(async () => {      
      let rolesRef = await db.collection('roles').get()
      rolesRef.forEach(row => {
        let data = row.data()
        roles.value.push({id: row.id, nombre: data.nombre})
      });      
    })
    return{
      permisosRol,pantallasData,rol,userRole,roles,modalRoles,async setRol(id,nombre){
        permisosRol.value = []
        rol.value = nombre
        rolId.value = id
        console.log(rolId.value)
        let permisosRolRef = await db.collection('permisos_rol').where('rol_id','==', parseInt(rolId.value)).get()
        permisosRolRef.forEach(row => {
          let data = row.data()          
          permisosRol.value.push({pantalla_id: data.pantalla_id})
        })        
      },delRol(index){
        permisosRol.value.splice(index, 1)
      },addRol(){
        permisosRol.value.push({})
      },async submitForm(){
        console.log(permisosRol)
      }
    }  
  },
}
</script>

  