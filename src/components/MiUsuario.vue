<template>    
    <v-card class="mx-2 mt-3">
        <v-card-tittle><h1>Hola! Estas son tus credenciales</h1></v-card-tittle>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col>
                        <v-text-field label="Cedula" required v-model="cedula"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field label="Nombres" required v-model="first_name"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field label="Apellidos" required v-model="last_name"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field label="Telefono" required v-model="telefono"/>
                    </v-col>
                </v-row>                
            </v-container>
        </v-card-text>
		<v-card-actions>
			<v-btn @click="guardarUser" :loading="loading">Guardar</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>	
  import { ref,onMounted } from 'vue'
  import { auth,db } from "../firebase.js"  
    
export default {
	setup() {
	let cedula = ref('')
	let first_name = ref('')
	let last_name = ref('')
	let telefono = ref('')
	let loading = ref(false)
	onMounted(async () =>{	  
		auth.onAuthStateChanged(async (user) =>{
			let userRef = await db.collection('users').doc(user.uid).get()
			let data = userRef.data()
			cedula.value = data.cedula
			first_name.value = data.first_name
			last_name.value = data.last_name
			telefono.value = data.telefono
		});
	})
		return{
			cedula,first_name,last_name,telefono,loading,
			async guardarUser(){
				auth.onAuthStateChanged(async (user) =>{
					let doc = await db.collection('users').doc(user.uid)
					loading.value = true
					await doc.update({cedula: cedula.value, first_name: first_name.value, last_name: last_name.value, telefono: telefono.value})
					loading.value = false
					alert("Actualización Exitosa!")
				});
				
			},
		}
	}
}
</script>


	