<template>
  <!--  eslint-disable  -->
  <div v-if="userRole == 2">
    <v-card class="mx-2 mt-3">
    <h1>Usuarios</h1>
  </v-card>

  <v-table class="mx-2 my-1">
    <thead>
      <tr>   
        <th class="text-center">
        Id
        </th>
        <th class="text-center">
        Nombre
        </th>     
        <th class="text-center">
        Cedula
        </th>        
        <th class="text-center">
        Rol
        </th>
        <th class="text-center">
        Telefono
        </th>
        <th class="text-center">
        Estado
        </th>
        <th class="text-center">
        Acciones
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in usuarios"
        :key="item.id"
      > 
        <td class="text-center">{{ item.id }}</td>        
        <td class="text-center">{{ item.first_name }} {{item.last_name}}</td>
        <td class="text-center">{{ item.cedula }}</td>        
        <td class="text-center">
          <div v-if="item.rol == 0">Usuario General</div>
          <div v-if="item.rol == 1">Doctor</div>
          <div v-if="item.rol == 2">Administrador</div>
        </td>
        <td class="text-center">{{ item.telefono }}</td>
        <td class="text-center">{{ item.estado }}</td>
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
                <v-list-item v-if="item.rol == 1 && item.estado == 'Pendiente'">
                  <v-dialog v-model="modalAprobar">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        color="primary"
                        v-bind="props"
                        @click="modalAprobar = true"
                      >
                        Aprobar
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card>
                        <v-card-title>Aprobar Usuario</v-card-title>
                        <v-card-text>Desea Aprobar este Usuario?</v-card-text>
                        <v-card-actions>
                          <v-btn @click="aprobarUsuario(item.id)">Si</v-btn>
                          <v-btn color="primary" @click="modalAprobar = false">No</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-card>
                  </v-dialog>
                </v-list-item>
                <v-list-item>
                  <v-btn color="primary" v-bind="props" prepend-icon="mdi-account-clock" @click="loadUser(item.id)">
                    Modificar
                    <v-dialog fullscreen activator="parent" v-model="dialogUpdate"  width="auto ">
                      <v-card>
                        <v-card-title>Modificar Usuario</v-card-title>
                        <v-card-text>
                          <div hidden><v-text-field class="mr-5 ml-5" v-model="UserId" /></div>                  
                          <v-row class="mt-3">
                            <v-col>
                                <v-form style="width: 75vw;">
                                <v-row class="mb-4 mx-2">
                                  <v-alert v-if="showError"  type="error">{{ msg }}</v-alert>
                                  <v-alert v-if="showSuccess" type="success">{{ msg }}</v-alert>
                                </v-row>
                                <v-row>
                                  <v-text-field class="mr-5 ml-5" v-model="UserCedula" label="Cedula" />
                                  <v-text-field class="mr-5 ml-5" v-model="UserFirstName" label="Nombres" />
                                  <v-text-field class="mr-5 ml-5" v-model="UserLastName" label="Apellidos" />					
                                </v-row>
                                <v-row>
                                  <v-text-field class="mr-5 ml-5" v-model="UserTelefono" label="Telefono" />
                                  <v-text-field class="mr-5 ml-5" v-model="UserEmail" label="Correo" />
                                  <v-text-field class="mr-5 ml-5" v-model="UserDireccion" label="Direccion" />
                                </v-row>
                                <v-row>
                                  <v-text-field class="mr-5 ml-5" v-model="UserUsuario" label="Usuario" />
                                  <v-select class="mr-5 ml-5" :items="rolesData" item-title="rol" item-value="id" label="Rol" v-model="UserRol"></v-select>
                                  <v-select  class="mr-5 ml-5" :items="items" item-title="provincia" item-value="id" label="Provincia" v-model="UserProvincia"></v-select>
                                </v-row>
                                <v-row>                                  
                                  <v-select class="mr-5 ml-5" :items="items2" item-title="canton" item-value="id" label="Canton" v-model="UserCanton"></v-select>
                                </v-row>
                                <v-row v-if="item.rol == 1">
                                  <v-text-field class="mr-5 ml-5" v-model="UserCargo" label="Cargo" />                                  
                                  <v-text-field class="mr-5 ml-5" v-model="UserInstitucion" label="Institucion" />
                                  <v-text-field class="mr-5 ml-5" v-model="UserURL" label="Titulo URL" />
                                </v-row>                                
                              </v-form>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn @click="guardar" :loading="loadingGuardar">Guardar</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-btn>
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
  import { db } from "../firebase.js"    
  import { ref,onMounted } from 'vue'
  import {provincias} from '../assets/provincias.js'
  import {cantones} from '../assets/cantones.js'
  import { useMainStore} from '../store/mainStore'
  import emailjs from '@emailjs/browser';

  export default {
    setup () {
      let items = ref(provincias)
      let items2 = ref(cantones)      
      let modalAprobar = ref(false)
      let usuarios = ref([])
      let UserCedula = ref('')
      let userId = ref('')
      let dialogUpdate = ref(false)
      let UserFirstName = ref('')
      let UserLastName = ref('')
      let UserTelefono = ref('')
      let UserEmail = ref('')
      let UserRol = ref('')
      let UserCanton = ref('')
      let UserCargo = ref('')
      let UserInstitucion = ref('')
      let UserURL = ref('')
      let UserProvincia = ref('')
      let UserDireccion = ref('')
      let rolesData = ref([])
      let UserUsuario = ref('')
      let rol = ref('')
      const store = useMainStore()
      let userRole = store.rol
      let loadingGuardar = ref(false)
      onMounted(async () =>{
        let usuariosRef = await db.collection('users').get()        
        usuariosRef.forEach(row => {
          let data = row.data()          
          usuarios.value.push({id: row.id, cedula: data.cedula, first_name: data.first_name, last_name: data.last_name, rol: data.rol, telefono: data.telefono, estado: data.estado })
        });
      });
      return {
        UserCanton,UserProvincia,UserDireccion,UserUsuario,UserURL,UserInstitucion,UserCargo,UserEmail,rolesData,items,items2,modalAprobar,usuarios,rol,UserCedula,UserFirstName,UserLastName,UserTelefono,UserRol,dialogUpdate,userId,userRole,
        async loadUser(item){
          rolesData.value = []
          let rolesRef = await db.collection('roles').get()
          rolesRef.forEach(doc => {
            let data = doc.data()            
            rolesData.value.push({id: doc.id, rol: data.nombre})
          });          
          let userRef = await db.collection('users').doc(item).get()
          userId.value = userRef.id
          UserCedula.value = userRef.data().cedula
          UserFirstName.value = userRef.data().first_name
          UserLastName.value = userRef.data().last_name
          UserTelefono.value = userRef.data().telefono
          UserProvincia.value = userRef.data().provincia
          UserCanton.value = userRef.data().canton
          UserRol.value = userRef.data().rol
          UserEmail.value = userRef.data().email
          UserDireccion.value = userRef.data().direccion
          UserCargo.value = userRef.data().cargo
          UserInstitucion.value = userRef.data().institucion
          UserURL.value = userRef.data().titulo
          UserUsuario.value = userRef.data().usuario
          console.log(UserRol.value)
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
        },async aprobarUsuario(id){
          await db.collection('users').doc(id).update({estado: 'Activo'}).then(async () => {
            usuarios.value = []
            let usuariosRef = await db.collection('users').get()
            usuariosRef.forEach(row => {
              let data = row.data()          
              usuarios.value.push({id: row.id, cedula: data.cedula, first_name: data.first_name, last_name: data.last_name, rol: data.rol, telefono: data.telefono, estado: data.estado })
            });
            //SEND MAIL
            let userRef = await db.collection('users').doc(id).get()          
            let to_email = userRef.data().email          
            let message = 'Su Usuario a Sido Aprobado. Bienvenido a la aplicacion!'            
            let subject = 'Usuario Aprobado'
            var emailParams = {to_email:to_email,message:message, subject: subject}            
            let credentialsRef = await db.collection('email').doc('credentials').get()
            let credentialsData = credentialsRef.data()
            //console.log(emailParams)
            emailjs.send(credentialsData.service_id,credentialsData.template_id,emailParams,credentialsData.public_id).then((response)=>{
                console.log('Success: ', response)
            },(error) =>{
                console.log('Error: ', error)
            })
            modalAprobar.value = false
          }).catch((e) => {
            alert(e)
          })
        }
      }
      
    }
  }
</script>