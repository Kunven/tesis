<template>
  <div v-if="userRole == 2">
    <v-card class="mx-2 mt-3">
      <h1>Roles</h1>
    </v-card>
    <v-dialog v-model="dialogNew">
      <template v-slot:activator="{ props }">
        <v-btn
          class="mx-2 my-1" prepend-icon="mdi-plus-circle"
          color="primary"
          v-bind="props"          
        >
          Nuevo Rol
        </v-btn>
      </template>
      <v-card>
        <v-card-title><h1>Nuevo Rol</h1></v-card-title>
        <v-card-text>
          <v-text-field class="mr-5 ml-5" v-model="inputRol" label="Rol" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="newRol">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>        
    <v-table class="mx-2 my-1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Rol</th>
          <th>Activo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in roles.filter(e => e.activo != '0')"
          :key="item.id"
        > 
          <td class="text-center">{{ item.id }}</td>
          <td class="text-center">{{ item.nombre }}</td>
          <td class="text-center">{{ item.activo }}</td>
          <td class="text-center">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  v-bind="props"
                  prepend-icon="mdi-account-clock"
                >
                  Acciones
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
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
                        <v-btn @click="submitForm(item.id)">Submit</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-list-item>
                <v-list-item>
                  <v-dialog v-model="modalDelete">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        color="primary"
                        v-bind="props"                        
                      >
                        Desactivar Rol
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title><h1>Desactivar Rol</h1></v-card-title>                      
                      <v-card-text>
                        <v-row class="">
                          <v-alert v-if="showError" type="error">{{ msg }}</v-alert>                          
                        </v-row>
                        <v-row class="mt-5">
                          Esta Seguro que Desea Desactivar Este Rol?
                        </v-row>                        
                      </v-card-text>
                      <v-card-actions>
                        <v-btn @click="delRolDB(item.id)">Si</v-btn>
                        <v-btn @click="modalDelete = false">No</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-list-item>
              </v-list>
            </v-menu>            
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
    let showError = ref(false)
    let msg = ref('Este Rol Tiene Usuarios Activos. No se puede desactivar')
    let modalDelete = ref(false)
    let dialogNew = ref(false)    
    const store = useMainStore()
    let inputRol = ref('')
    let permisosRol = ref([{pantalla_id: 1}])
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
        roles.value.push({id: row.id, nombre: data.nombre, activo: data.activo})
      });      
    })
    return{
      showError,msg,modalDelete,dialogNew,inputRol,permisosRol,pantallasData,rol,userRole,roles,modalRoles,async setRol(id,nombre){
        permisosRol.value = []
        let pantallas = await db.collection('roles').doc(id.toString()).collection('permisos').doc('pantallas').get()
        console.log(pantallas.data().pantallas)
        let pantallas_num = Object.values(pantallas.data().pantallas)        
        pantallas_num.forEach(e => {
          permisosRol.value.push({pantalla_id: e})
        });
        rol.value = nombre
        rolId.value = id
        
      },delRol(index){
        permisosRol.value.splice(index, 1)
      },addRol(){
        permisosRol.value.push({})
      },async submitForm(id){
        //TO DO
        if (permisosRol.value.length > 0) {
          let data = {}
         permisosRol.value.forEach((element,index) => {
           data[index] = element.pantalla_id
         });         
        await db.collection('roles').doc(id.toString()).collection('permisos').doc('pantallas').update({pantallas: data}).then(() =>{
          modalRoles.value = false
        })
        }
      },async newRol(){
        const data = {nombre: inputRol.value, activo: "1"}        
        await db.collection('roles').doc(roles.value.length.toString()).set(data).then(async () =>{
          await db.collection('roles').doc(roles.value.length.toString()).collection('permisos').doc('pantallas').set({pantallas: {0:1}})
          roles.value = []
          let rolesRef = await db.collection('roles').get()
          rolesRef.forEach(row => {
            let data = row.data()
            roles.value.push({id: row.id, nombre: data.nombre, activo: data.activo})
          });
          dialogNew.value = false
        })        
      },async delRolDB(id){
        let valRol = await db.collection('users').where("rol","==",id.toString()).get()
        let valid = true
        valRol.forEach(element => {
          element
          valid = false
        });
        if (valid) {
          await db.collection('roles').doc(id.toString()).update({activo: "0"})
          roles.value = []
          let rolesRef = await db.collection('roles').get()
          rolesRef.forEach(row => {
            let data = row.data()
            roles.value.push({id: row.id, nombre: data.nombre, activo: data.activo})
          });
          dialogNew.value = false
        }else{
          showError.value = true
        }        
      }
    }  
  },
}
</script>

  