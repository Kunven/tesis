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
    <v-row class="mt-5 mx-2">      
      <v-text-field label="Correo"></v-text-field>
    </v-row>
    <v-row class="mt-2 m-2">
      <v-btn @click="handlePwReset" color="secondary">Enviar Correo</v-btn>
    </v-row>
  </v-card-text>
</template>

<script>
export default {
    setup(){
        return{
          handlePwReset(){
            //TODO
          }
        }
    }
}
</script>