<template>  
    <v-card class="mx-2 mt-3">
        <h1>Consultas</h1>
    </v-card>
    <!-- BEGIN DIALOG -->
     <div>
    <v-btn
      class="mx-2 my-1"
      prepend-icon="mdi-plus-circle"
      color="primary"
    >Nueva Consulta
      <v-dialog
        v-model="dialog"
        activator="parent"
      >
        <v-card
          min-width="500"
        >
          <v-card-title>
            <span class="text-h5">Formulario de Consultas</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field label="Descripcion" required/>
                </v-col>
                <v-col>
                  <v-select
                    :items="doctores"
                    label="Doctores"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>                
                <v-date-picker v-model="date" />
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
  export default {
    data () {
      return {
        consultas: [
          {            
            descripcion: 'Consulta de Prueba',
            estado: 'Pendiente',
            fechaInicio: '10/08/2022: 10AM',
            fechaFin: '10/08/2022: 12PM',
            doctor: 'TKXtTIVrY5UXwpBAoYXOZJCc1Ry1',
            usuario: '71OykACAi9M1AjyeZPPofFtGsYN2'
          },
        ],
        doctores: [
          'Luis Andrade',
          'Doctor Prueba',
          'David Guevara'
        ]
      }
    },
  }
</script>