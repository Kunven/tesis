<template>
<v-card-text>
	<v-row>
		<v-col>
			<v-btn class="ml-2" color="primary">
				<router-link to="/login" style="text-decoration: none; color: inherit;">Regresar</router-link>
			</v-btn>					
		</v-col>
	</v-row>
	<v-row>
		<v-col>
			<h1>Registro de Especialista</h1>
			<h4>Llene el formulario con su informacion. Su cuenta tendra que ser aprobada por un administrador antes de poder usarla</h4>
		</v-col>
	</v-row>
	<v-row class="mt-3">
		<v-col>
				<v-form style="width: 75vw;">
				<v-row>
					<v-text-field class="mr-5 ml-5" v-model="cedula" label="Cedula" />
					<v-text-field class="mr-5 ml-5" v-model="names" label="Nombres" />
					<v-text-field class="mr-5 ml-5" v-model="lastNames" label="Apellidos" />					
				</v-row>
				<v-row>
					<v-text-field class="mr-5 ml-5" v-model="phone" label="Telefono" />
					<v-text-field class="mr-5 ml-5" v-model="mail" label="Correo" />
					<v-text-field class="mr-5 ml-5" v-model="direccion" label="Direccion" />
				</v-row>
				<v-row>
					<v-text-field class="mr-5 ml-5" v-model="user" label="Usuario" />
					<v-text-field class="mr-5 ml-5" :type="show1 ? 'text' : 'password'" v-model="password" label="Contraseña" />
					<v-text-field class="mr-5 ml-5" v-model="password2" :type="show1 ? 'text' : 'password'" label="Repita la Contraseña" />						
				</v-row>
				<v-row>
          <v-select class="mr-5 ml-5" :items="items" item-title="provincia" item-value="id" label="Provincia" v-model="provincia"></v-select>
          <v-select class="mr-5 ml-5" :items="items2" item-title="canton" item-value="id" label="Canton" v-model="canton"></v-select>
          <v-text-field class="mr-5 ml-5" v-model="cargo" label="Cargo" />
				</v-row>
        <v-row>          
          <v-text-field class="mr-5 ml-5" v-model="titulo" label="Titulo URL" />
          <v-text-field class="mr-5 ml-5" v-model="institucion" label="Institucion" />
        </v-row>
			</v-form>
		</v-col>
	</v-row>
	<v-row >
		<v-col class="text-center">
			<v-btn v-on:click="handleRegister" class="w-75 justify-center" color="primary">Crear Cuenta</v-btn>
		</v-col>
	</v-row>
</v-card-text>
</template>
<script>
	import { auth,db } from "../firebase.js"
  import { ref } from 'vue'
  import {provincias} from '../assets/provincias.js'
  import { Timestamp } from "firebase/firestore";
  import {cantones} from '../assets/cantones.js'
	export default {
    setup(){
      const cedula = ref('')
      const names = ref('')
      const lastNames = ref('')
      const phone = ref('')
      const mail = ref('')
      const direccion = ref('')
      const user = ref('')
      const password = ref('')
      const password2 = ref('')
      const provincia = ref('')
      const canton = ref('')
      const titulo = ref('')
      const cargo = ref('')
      const institucion = ref('')
      let items = provincias
      let items2 = cantones
      return{
        titulo,cargo,institucion,provincia,canton,cedula,names,lastNames,phone,mail,direccion,user,password,password2,items,items2,handleRegister(){
          auth.createUserWithEmailAndPassword(mail,password2).then((usr) =>{
            //Creating user details
            usr.uid
            const data = {
              cedula: cedula, first_name: names, last_name: lastNames, telefono: phone, correo: mail, direccion: direccion, 
              usuario: user, provincia: provincia, canton: canton, created: Timestamp.fromDate(new Date)
            }
            db.collection('users').doc().set(data)
            //TODO MODAL REGISTRO
          }).catch((error) => {
            error
            //Exception handling TODO
          })
        }
      }
    }
	}
</script>
<style scoped>
	
</style>