<template>	
	<v-card class="mx-2 my-3">
		<h1>Bienvenido {{User}}</h1>
	</v-card>
</template>

<script>
import { auth } from "../firebase.js"
import { onMounted } from 'vue'
export default {
  components: {
    
  },
  data() {
    return {
      user: ""
    };
  },
  methods:{
    
  },
	setup() {
    onMounted(() =>{      
      //this.User = "123"
      auth.onAuthStateChanged((user) =>{
        if (user) {
          this.user = "123"        
          console.log(user.uid)
        }
      });
    });
    
  },
};
</script>