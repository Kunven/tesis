<template>
    <v-card-title class="justify-center">
      <h1>LOGO</h1>
    </v-card-title>
    <v-card-text>
        <v-form style="width: 25vw;">
            <v-text-field v-model="User" label="Correo"></v-text-field>
            <v-text-field v-model="Password" label="Contraseña" type="password"></v-text-field>            
            <div class="text-center">
                <v-btn type="button" v-on:click="loginUser" class="w-75 justify-center" color="primary">Iniciar Sesion</v-btn>              
            </div>
            <div class="text-center mt-2">
              <a href="passwordReset">Olvidaste tu Contraseña?</a>
            </div>
        </v-form>          
        <div class="text-center mt-5">
            <v-row>
                <v-col>
                O Registrate, es gratis!
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                <v-btn color="secondary"><router-link to="/register" style="text-decoration: none; color: inherit;">Registro</router-link></v-btn>
                </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p>Eres un Especialista y deseas trabajar con nosotros?</p>
                <a href="registerDoc">Presiona Aqui</a>
              </v-col>
            </v-row>
        </div>
    </v-card-text>
</template>
<script>
import { auth } from "../firebase.js"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useMainStore} from '../store/mainStore'
export default {
  components: {
    
  },
  data() {
    return {
      User: "",
      Password: "",
    };
  },
  methods:{
    loginUser(){      
      signInWithEmailAndPassword(auth, this.User,this.Password)
        .then(() => {
          this.$router.push('/home')
          auth.onAuthStateChanged((user) =>{
            if (user) {
              const store = useMainStore()
              store.$patch({
                LoggedIn: true
              })
            }
          });
        })
        .catch((error) => {
          alert('Credenciales Incorrectas')

          const store = useMainStore()
          store.$patch({
            LoggedIn: false
          })
          console.log(error.message) ;
        });      
    }
  },
};
</script>