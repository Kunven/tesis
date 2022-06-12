<template>
  <div class="vertical-center">
    <div
      class="container"
      style="
        background-color: white;
        border-radius: 5px;
        margin-top: 5px;
        color: black;
        max-width: 25%;
      "
    >
      <div class="row mt-5">
        <h1 style="text-align: center">
          <img src="../assets/logo.png"/>
        </h1>
      </div>
      <div class="row mb-5">
        <form>
          <div class="col-md-12">
            <div class="form-group">
              <label for="buscar"><strong>Usuario</strong></label>
              <input type="text" v-model="User" class="form-control " />
            </div>
            <div class="col-md-12">
              <label for="buscar"><strong>Contraseña</strong></label>
              <input type="password" v-model="Password" class="form-control" />
            </div>
            <div class="col-md-12 mt-2">
              <small><p style="text-align: right ;">Olvidaste tu Contraseña?</p></small>
            </div>
            <div class="col-md-12 text-center mt-2">
              <button type="button" v-on:click="loginUser" class="btn btn-primary mt-2 w-75">Iniciar Sesion</button>
            </div>            
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebase.js"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useMainStore} from '../store/mainStore'
export default {
  components: {
    //PENDIENTE REGISTRO
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

<style>
.vertical-center {
  /*Codigo 0% Original*/
  min-height: 100%; /* Fallback for browsers do NOT support vh unit */
  min-height: 100vh; /* These two lines are counted as one :-)       */

  display: flex;
  align-items: center;
}
</style>
