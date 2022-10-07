<template>
  <!--  eslint-disable  -->
  <div v-if="userRole == 2">
    <v-card class="mx-2 mt-3">
    <h1>Usuarios</h1>
  </v-card>

  <v-table class="mx-2 my-1">
    <thead>
      <tr>   
        <th class="text-left">
        Id
        </th>     
        <th class="text-left">
        Nombre
        </th>     
        <th class="text-left">
        Cedula
        </th>        
        <th class="text-left">
        Rol
        </th>
        <th class="text-left">
        Telefono
        </th>
        <th class="text-left">
        Acciones
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in usuarios"
        :key="item.id"
      > 
        <td>{{ item.id }}</td>        
        <td>{{ item.first_name }} {{item.last_name}}</td>
        <td>{{ item.cedula }}</td>        
        <td>
          <div v-if="item.rol == 0">Usuario General</div>
          <div v-if="item.rol == 1">Doctor</div>
          <div v-if="item.rol == 2">Administrador</div>
        </td>
        <td>{{ item.telefono }}</td>
        <td>
          <v-btn color="primary" v-bind="props" prepend-icon="mdi-account-clock" @click="loadUser(item.id)">
            Modificar
            <v-dialog fullscreen activator="parent" v-model="dialogUpdate"  width="auto ">
              <v-card>
                <v-card-title>Modificar Usuario</v-card-title>
                <v-card-text>
                  <div hidden><v-text-field class="mr-5 ml-5" v-model="UserId" /></div>                  
                  <v-row>
                    <v-text-field class="mr-5 ml-5" v-model="UserFirstName" label="Nombres" />
				          </v-row>				          
                  <v-row>
                    <v-text-field class="mr-5 ml-5" v-model="UserLastName" label="Apellidos" />                    
                  </v-row>
                  <v-row>
                    <v-text-field class="mr-5" v-model="UserTelefono" label="Telefono" />
                  </v-row>
                  <v-row>
                    <v-text-field class="mr-5 ml-5" v-model="UserCedula" label="Cedula" /> 
                  </v-row>
                  <v-row>
                    <v-select
                      v-model="UserRol"
                      :items="roles"
                      item-title="label"
                      item-value="rol"
                      label="Rol"
                    ></v-select>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="guardar" :loading="loadingGuardar">Guardar</v-btn>                  
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
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
  import { db } from "../firebase.js"    
  import { ref,onMounted } from 'vue'
  import { useMainStore} from '../store/mainStore'

  export default {
    setup () {
      let usuarios = ref([])
      let UserCedula = ref('')
      let userId = ref('')
      let dialogUpdate = ref(false)
      let UserFirstName = ref('')
      let UserLastName = ref('')
      let UserTelefono = ref('')
      let UserRol = ref('')
      let rol = ref('')
      const store = useMainStore()
      let userRole = store.rol
      let loadingGuardar = ref(false)
      let roles = [{rol: "0", label: 'Usuario General'},{rol: "1", label: 'Doctor'},{rol:"2", label: 'Administrador'}]
      onMounted(async () =>{
        let usuariosRef = await db.collection('users').get()        
        usuariosRef.forEach(row => {
          let data = row.data()          
          usuarios.value.push({id: row.id, cedula: data.cedula, first_name: data.first_name, last_name: data.last_name, rol: data.rol, telefono: data.telefono })
        });        
      });
      return {
        usuarios,roles,rol,UserCedula,UserFirstName,UserLastName,UserTelefono,UserRol,dialogUpdate,userId,userRole,
        async loadUser(item){      
          console.log(item)    
          let userRef = await db.collection('users').doc(item).get()
          userId.value = userRef.id
          UserCedula.value = userRef.data().cedula
          UserFirstName.value = userRef.data().first_name
          UserLastName.value = userRef.data().last_name
          UserTelefono.value = userRef.data().telefono
          UserRol.value = userRef.data().rol
        },
        async guardar(){
          console.log(userId.value)
          loadingGuardar.value = true
          await db.collection('users').doc(userId.value).update({
            cedula: UserCedula.value,
            first_name: UserFirstName.value,
            last_name: UserLastName.value,
            rol: UserRol.value,
            telefono: UserTelefono.value 
          })
          loadingGuardar.value = false          
          usuarios.value = []
          let usuariosRef = await db.collection('users').get()        
          usuariosRef.forEach(row => {
            let data = row.data()          
            usuarios.value.push({id: row.id, cedula: data.cedula, first_name: data.first_name, last_name: data.last_name, rol: data.rol, telefono: data.telefono })
          });
          dialogUpdate.value = false
          this.$router.push('/admin')
        }        
      }
      
    }
  }
</script>