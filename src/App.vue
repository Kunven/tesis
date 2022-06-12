<template>  
  <div v-if="auth">
    <MainApp />
  </div>
  <div v-else>
    <LoginPage />
  </div>
  <br/>  
  <button v-on:click="logoutTest" class="btn btn-primary">Cerrar Sesion</button>  
</template>

<script>
import { auth } from "./firebase"
import { onMounted } from 'vue'
import LoginPage from './components/LoginPage.vue'
import MainApp from './components/MainApp.vue'
import { useMainStore} from './store/mainStore'
import { storeToRefs } from "pinia"

export default {
  name: 'App',
  data() {
    const store = useMainStore()
    const { LoggedIn } = storeToRefs(store);
    return {
      auth: LoggedIn,
    }
  },
  methods: {
    changeAuth(){
      this.auth = !this.auth
    },    
    logoutTest(){      
      auth.signOut().then(() =>{
      const store = useMainStore()
      store.LoggedIn = false
      })
    },
    authTest(){
      console.log(this.auth)
      console.log("2")
      const store = useMainStore()
      console.log(store.LoggedIn)
    }
  },
  setup() {
    onMounted(() =>{      
      auth.onAuthStateChanged((user) =>{
        if (user) {
          console.log("Logged In")
          console.log(auth.currentUser)//const user = ;
        }else{
          console.log("Not Logged In")
         }
      });
    });
    
  },
  created(){
    const store = useMainStore()
    this.auth = store.LoggedIn     
  },
  components: {
    //HelloWorld
    MainApp,
    LoginPage,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;    
  margin: 0;
  width: 100%;
  min-height: 100vh;
  background-color:#2c3e50;
}
</style>
