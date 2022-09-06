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
                    <v-date-picker v-model="date" class="my-2">
                        <template v-slot="{ inputValue, inputEvents }">
                            <input
                            label="Fecha"                            
                            :value="inputValue"
                            v-on="inputEvents"
                            />
                        </template>
                    </v-date-picker>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col>
                    <v-text-field label="Nombres"/>
                  </v-col>                  
              </v-row>
              <v-row>
                  <v-col>
                      <v-text-field label="Apellidos"/>
                  </v-col>                  
              </v-row>
              <v-row>
                  <v-col>
                      <v-text-field label="Edad"/>
                  </v-col>
                  <v-col>
                      <v-select
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
              <th class="text-left">
              Nombres
              </th>
              <th class="text-left">
              Apellidos
              </th>
              <th class="text-left">
              Cita - Descripcion
              </th>
              <th class="text-left">
              Telefono
              </th>
              <th class="text-left">
              Edad
              </th>
              <th class="text-left">
              Acciones
              </th>
          </tr>
        </thead>
        <tbody>
          <tr
              v-for="item in fichas"
              :key="item.nombres"
          >
              <td>{{ item.nombres }}</td>
              <td>{{ item.apellidos }}</td>
              <td>{{ 123 }}</td>
              <td>{{ item.telefono }}</td>
              <td>{{ item.edad }}</td>
              <td>
                 <v-btn
                  prepend-icon="mdi-refresh"                  
                  color="primary"
                >Update</v-btn>
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
        onMounted(async () =>{
          auth.onAuthStateChanged(async (user) =>{
            let fichasRef = await db.collection('fichas').where('doctor','==', user.uid).get()
            fichasRef.forEach(doc => {
              let data = doc.data()
              fichas.value.push(data)
            });
            console.log(fichas.value[0].nombres)
          })          
        })
        const Sexos = ['Masculino','Femenino']
        let loading = ref(false)
        return {
            loading,
            Sexos
        }
    },
  }
</script>