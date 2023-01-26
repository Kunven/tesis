<template>  
    <v-card class="mx-2 mt-3">
        <h1>Fichas Medicas</h1>
    </v-card>
    <!-- BEGIN DIALOG -->
     <div>
    <v-btn
      class="mx-2 my-1"
      prepend-icon="mdi-plus-circle"
      color="primary"
    >Nueva Ficha
      <v-dialog
        v-model="dialog"
        activator="parent"
      >
        <v-card
          min-width="500"
        >
          <v-card-title>
            <span class="text-h5">Formulario de la Ficha</span>
          </v-card-title>
          <v-card-text>
            <v-container>              
              <v-row>
                  <v-col>
                    <v-text-field label="Nombres" v-model="nombres"/>
                  </v-col>                  
              </v-row>
              <v-row>
                  <v-col>
                      <v-text-field label="Apellidos"/>
                  </v-col>                  
              </v-row>
              <v-row>
                <v-col>
                      <v-select
                        v-model="Cita"
                        :items="citas"
                        label="Cita"
                        item-text="descripcion"
                        item-value="id"
                      />
                  </v-col>
              </v-row>
              <v-row>
                  <v-col>
                      <v-text-field label="Edad"/>
                  </v-col>
                  <v-col>
                      <v-select
                        v-model="Sexo"
                        :items="Sexos"
                        label="Sexo"
                      />
                  </v-col>
              </v-row>
              <v-row>
                  <v-col>
                      <v-text-field label="Telefono"/>
                  </v-col>                  
              </v-row>
              <v-row>
                  <v-col>
                      <v-text-field label="Grupo Sanguineo"/>
                  </v-col>                  
              </v-row>
              <v-row>
                  <v-col>
                      <v-textarea label="¿Padece algunas alergias?"/>
                  </v-col>                  
              </v-row>
              <v-row>
                  <v-col>
                      <v-textarea label="Observaciones"/>
                  </v-col>                  
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn :loading="loading" @click="submitForm">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
  </div>
    <!-- END DIALOG -->

    <!-- BEGIN TABLE -->
    <v-table class="mx-2 my-1">
        <thead>
          <tr>
              <th class="text-center">
              Nombres
              </th>
              <th class="text-center">
              Apellidos
              </th>
              <th class="text-center">
              Cita - Descripcion
              </th>
              <th class="text-center">
              Telefono
              </th>
              <th class="text-center">
              Edad
              </th>
              <th class="text-center">
              Acciones
              </th>
          </tr>
        </thead>
        <tbody>
          <tr
              v-for="item in fichas"
              :key="item.nombres"
          >
              <td class="text-center">{{ item.nombres }}</td>
              <td class="text-center">{{ item.apellidos }}</td>
              <td class="text-center">{{ item.descripcion }}</td>
              <td class="text-center">{{ item.telefono }}</td>
              <td class="text-center">{{ item.Edad }}</td>
              <td class="text-center">
                 <v-btn
                  prepend-icon="mdi-refresh"
                  color="primary"
                >Modificar</v-btn>
              </td>
          </tr>
        </tbody>
    </v-table>
    <!-- END TABLE -->    
</template>
<script>
  import 'v-calendar/dist/style.css';
  import { auth, db } from "../firebase.js"
  import { ref,onMounted } from 'vue'
  //import { doc, getDoc } from "firebase/firestore";
  export default {    
    setup () {
        let fichas = ref([])        
        const nombres = ref('')
        const apellidos = ref('')
        const Edad = ref('')
        const Sexo = ref('Masculino')
        const telefono = ref('')
        const grupoSanguineo = ref('')
        const alergias = ref('')
        const observaciones = ref ('')
        const cita = ref('')
        let citas = ref([])
        onMounted(async () =>{
          auth.onAuthStateChanged(async (user) =>{            
            const fichasRef = await db.collection('fichas').where('doctor','==', user.uid).get()
            const consultasRef = await db.collection('consultas').where('doctor','==', user.uid).get()
            fichasRef.forEach(async doc => {
              let data = doc.data()
              let citaDoc = await db.collection('consultas').doc(data.cita).get()              
              fichas.value.push({...data, descripcion: citaDoc.data().descripcion })
            });
            consultasRef.forEach(doc => {              
              citas.value.push({id: doc.id,descripcion: doc.data().descripcion})

            });
            console.log(citas.value)
          })          
        })
        const Sexos = ['Masculino','Femenino']
        let loading = ref(false)
        return {
            nombres,apellidos,Edad,Sexo,telefono,grupoSanguineo,alergias,observaciones,cita,
            fichas,
            loading,
            Sexos,
            async submitForm (){ 
              auth.onAuthStateChanged( async (user) => {
                const data = {Edad: Edad, Sexo: Sexo, alergias: alergias, apellidos: apellidos, 
                  cita: cita, doctor: user.uid, grupoSanguineo: grupoSanguineo, nombres: nombres,
                  observaciones: observaciones, telefono: telefono  }
                db.collection('fichas').doc().set(data)
              })
              
            }
        }
    },
  }
</script>