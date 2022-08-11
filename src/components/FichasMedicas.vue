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
              Descripcion
              </th>
              <th class="text-left">
              Fecha Inicio
              </th>
              <th class="text-left">
              Fecha Fin
              </th>
              <th class="text-left">
              Doctor
              </th>
              <th class="text-left">
              Estado
              </th>
              <th class="text-left">
              Acciones
              </th>
          </tr>
        </thead>
        <tbody>
          <tr
              v-for="item in consultas"
              :key="item.name"
          >
              <td>{{ item.descripcion }}</td>
              <td>{{ item.fechaInicio }}</td>
              <td>{{ item.fechaFin }}</td>
              <td>{{ item.doctor }}</td>
              <td>{{ item.estado }}</td>
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
  //import { ref } from 'vue'
  export default {    
    setup () {
        const Sexos = ['Masculino','Femenino']    
        return {
            Sexos
        }
    },
  }
</script>