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
			<h1>Registro de Usuario</h1>
			<h4>Llena el formulario con tu informacion para registrarte</h4>
		</v-col>
	</v-row>
	<v-row class="mt-3">
		<v-col>
				<v-form style="width: 75vw;">
				<v-row class="mb-4 mx-2">
					<v-alert v-if="showError"  type="error">{{ msg }}</v-alert>
					<v-alert v-if="showSuccess" type="success">{{ msg }}</v-alert>
				</v-row>
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
          <v-select @update:modelValue="filterCities" class="mr-5 ml-5" :items="items" item-title="provincia" item-value="id" label="Provincia" v-model="provincia"></v-select>
          <v-select class="mr-5 ml-5" :items="items2" item-title="canton" item-value="id" label="Canton" v-model="canton"></v-select>
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
		let showError = ref(false)
		let showSuccess = ref(false)
		let msg = ref('')
		let items = ref(provincias)
		let items2 = ref(cantones)
		return{
			msg,showError,showSuccess,provincia,canton,cedula,names,lastNames,phone,mail,direccion,user,password,password2,items,items2,async handleRegister(){
			if (mail.value == '' || password.value == '' || password2.value == '') {
				msg.value == "El formulario esta incompleto. Tiene que llenar como minimo un correo y una contraseña"
				showError.value = true
			}else{
				await auth.createUserWithEmailAndPassword(mail,password2).then(async (usr) =>{
					//Creating user details
					usr.uid
					const data = {
					cedula: cedula.value, first_name: names.value, last_name: lastNames.value, telefono: phone.value, correo: mail.value, direccion: direccion.value, 
					usuario: user.value, provincia: provincia.value, canton: canton.value, created: Timestamp.fromDate(new Date)
					}
					await db.collection('users').doc(usr.uid).set(data)
					msg.value = "Usuario Creado con Exito"
					showSuccess.value = true
					//TODO MODAL REGISTRO
				}).catch((error) => {
					error
					msg.value = "El formulario esta incompleto. Llene todos los campos."
					showError.value = true
					//Exception handling TODO
				})
			}			
			},filterCities(){
				//items2.value = cantones.filter(e => e.id_provincia == provincia.value)
				//console.log(provincia.value)
				//console.log('valor')
				//console.log(cantones)
			},filterProvinces(){

			}
		}
	}
}
</script>
<style scoped>
	
</style>