<template>
<v-card-text>
	<v-row>
		<v-col>
			<v-btn class="ml-2">
				<router-link to="/login" style="text-decoration: none; color: inherit;">Regresar</router-link>
			</v-btn>					
		</v-col>
	</v-row>
	<v-row class="mt-3">
		<v-col>
				<v-form style="width: 75vw;">
				<v-row>
					<v-text-field class="mr-5 ml-5" v-model="names" label="Nombres" />
					<v-text-field class="mr-5 ml-5" v-model="lastNames" label="Apellidos" />
					<v-text-field class="mr-5" v-model="phone" label="Telefono" />
				</v-row>
				<v-row>					
					<v-text-field class="mr-5 ml-5" v-model="password" label="Contraseña" />
					<v-text-field class="mr-5" v-model="password2" label="Repita la Contraseña" />				
				</v-row>
				<v-row>
					<v-text-field class="mr-5 ml-5" v-model="cedula" label="Cedula" />
					<v-text-field class="mr-5" v-model="mail" label="Correo" />
					<v-select
            v-model="rol"
            :items="roles"
            item-title="label"
            item-value="rol"
            label="Rol"
          ></v-select>
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
	import { auth, db } from "../firebase.js"
  
	export default {
		components: {

		},
		data() {
			return {
				names: "",
				lastNames: "",
				user: "",
				password: "",
				password2: "",
				phone: "",
				mail: "",               
				cedula: "",
				city: "",
				rol: "",
				roles: [{rol: 0, label: 'Usuario General'},{rol: 1, label: 'Doctor'}],
			};
		},
		methods:{
		async handleRegister(){
			await auth.createUserWithEmailAndPassword(this.mail, this.password)
				.then(async (user) => {
					const data = {
						first_name : this.names, last_name: this.lastNames, rol: this.rol, telefono: this.phone,
						cedula: this.cedula
					}          
					await db.collection('users').doc(user.user.uid).set(data)
					alert('Usuario Creado con Excito')
					// REDIRECT
				})
				.catch((error) => {
					alert(error)					
				});
			console.log(this.names)
		}
  },
	}
</script>
<style scoped>
	
</style>