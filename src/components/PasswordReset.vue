<template>
  <v-card-text>
    <v-col>
			<v-btn class="mx-2" color="primary">
				<router-link to="/login" style="text-decoration: none; color: inherit;">Regresar</router-link>
			</v-btn>					
		</v-col>
    <v-row class="mx-2">
      <h1>Reinicio de Contraseña</h1>
			<h4>Olvidaste tu Contraseña? Escribe tu correo en el recuadro de abajo y te enviaremos instrucciones por correo para reiniciarla</h4>    
    </v-row>
    <v-row class="mt-4 mx-2">
      <v-alert v-if="showError" type="error">{{ msg }}</v-alert>
      <v-alert v-if="showSuccess" type="success">{{ msg }}</v-alert>
    </v-row>
    <v-row class="mt-4 mx-2">      
      <v-text-field label="Correo" v-model="correo"></v-text-field>
    </v-row>
    <v-row class="mt-2 m-2">
      <v-btn @click="handlePwReset" color="secondary">Enviar Correo</v-btn>
    </v-row>    
  </v-card-text>
</template>

<script>
import { auth } from "../firebase.js"
import { ref } from 'vue'
export default {
    setup(){
        let showError = ref(false)
        let showSuccess = ref(false)
        let msg = ref('')
        const correo = ref('')
        return{
          correo,showError,msg,showSuccess,
          handlePwReset(){
            auth.sendPasswordResetEmail(correo.value).then(() =>{              
              msg.value = "Se envio un correo con pasos para el reinicio de contraseña al correo registrado para este usuario"
              showSuccess.value = true
              //TODO
            }).catch((error) =>{
              showError.value = true
              msg.value = "Correo no Valido"
              alert(error)
            })
          }
        }
    }
}
</script>