<template>	
	<v-card class="mx-2 my-3">
		<h1>Bienvenido {{name}} {{last_name}}</h1>
	</v-card>
</template>

<script>
import { auth, db } from "../firebase.js"
import { ref } from 'vue'
import { doc, getDoc } from "firebase/firestore";
//import { onMounted } from 'vue'
export default {
  components: {
    
  },  
  methods:{
  },
	setup() {    
    let UID = ref('')    
    let name = ref('')
    let last_name = ref('')
    auth.onAuthStateChanged(async (user) =>{
      UID.value = user.uid
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data())
      name.value = docSnap.data().name
      last_name.value = docSnap.data().last_name
    });
    
    return { UID, name, last_name }
  },
};
</script>