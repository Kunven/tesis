<template>
  <v-card class="mx-2 my-3">
    <v-card-title>
      <h1>Hola! Sigue Estos Pastos para una Optima Experiencia</h1>
    </v-card-title>
    <v-card-text>
      <h2>1. Accede al Menu de Citas</h2>
      <h4 style="color:gray" class="mx-2">El Menu se Encuentra en la Parte Superior Izquierda</h4>
      <h2>2. Da Click en "Nueva Cita"</h2>
      <h4 style="color:gray" class="mx-2">El boton morado en la parte superior</h4>
      <h2>3. LLena el Formulario y Escoge un doctor</h2>
      <h4 style="color:gray" class="mx-2">Una vez llenado estas opciones el formulario se expandera</h4>
      <h2>4. Selecciona el Horario de la Cita</h2>
      <h4 style="color:gray" class="mx-2">El formulario cargara el horario del doctor y podra ver las horas donde el doctor esta ocupado</h4>
      <h2>5. Espere a que su Cita sea Aprobada</h2>
      <h4 style="color:gray" class="mx-2">Una vez creada la cita, el doctor sera notificado y tendra que aprobarla</h4>
      <h2>6. Pague la Cita</h2>
      <h4 style="color:gray" class="mx-2">Una vez aprobada, en el menu de acciones, de click en el boton pagar para abrir el formulario de Pago</h4>
      <h2>7. Realize la Cita</h2>
      <h4 style="color:gray" class="mx-2">El dia de su cita, de click en el menu de acciones, opcion "Relizar"</h4>
    </v-card-text>
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
      name.value = docSnap.data().first_name
      last_name.value = docSnap.data().last_name
    });
    
    return { UID, name, last_name }
  },
};
</script>