<template>

  <div v-if="auth">
    <v-layout>
      <v-main>
        <MainApp/>
      </v-main>
    </v-layout>
  </div>
  <div v-else>
    <v-layout>
      <v-main>
          <LoginPage/>
      </v-main>
    </v-layout>
  </div>  
  <br/>  
  <button v-on:click="logoutTest" class="btn btn-primary">Cerrar Sesion</button>  
</template>

<script>
import { auth,db } from "./firebase"
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
      this.$router.push('/login')
      auth.signOut().then(() =>{
        this.$router.push('/login')
        const store = useMainStore()
        store.LoggedIn = false      
      })
    },
    authTest(){
      const store = useMainStore()
      console.log(store.LoggedIn)
    }
  },
  setup() {
    onMounted(() =>{      
      auth.onAuthStateChanged(async (user) =>{
        if (user) {
          let userRef = await db.collection('users').doc(user.uid).get()
          //console.log("Logged In")
          const store = useMainStore()
              store.$patch({
                LoggedIn: true,
                rol: userRef.data().rol
              })
        }else{
          //console.log("Not Logged In")
          const store = useMainStore()
              store.$patch({
                LoggedIn: false
              })
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
  background-color:#6e95a3 ;
}
.vertical-center {
  
  /*Codigo 0% Original*/
  min-height: 100%; /* Fallback for browsers do NOT support vh unit */
  min-height: 100vh; /* These two lines are counted as one :-)       */

  display: flex;
  align-items: center;
  text-align: center;
}
a { text-decoration: none; }
</style>


