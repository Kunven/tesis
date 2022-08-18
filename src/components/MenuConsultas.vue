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
          min-width="800"
        >
          <v-card-title>
            <span class="text-h5">Formulario de Consultas</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field label="Descripcion" required v-model="descripcion"/>
                </v-col>                
              </v-row>
              <v-row>   
                 <v-select
                :items="doctores"
                label="Seleccione un Doctor"
                @update:modelValue="loadCalendar"
                v-model="doctor"
                ></v-select>
              </v-row>
              <div v-if="showSchedule">
                <span class="text-h5">Seleccione la Fecha y Hora de la Consulta</span>
                <v-row>
                  <v-col>
                    <label>Hora de Inicio de la Consulta</label>
                    <v-date-picker v-model="timeBegin" class="my-2" mode="time">
                        <template v-slot="{ inputValue, inputEvents }">                            
                            <input
                            class="form-control"
                            label="Fecha"                            
                            :value="inputValue"
                            v-on="inputEvents"
                            />
                        </template>
                    </v-date-picker>
                  </v-col>
                  <v-col>
                    <label>Hora de Fin de la Consulta</label>
                    <v-date-picker v-model="timeEnd" class="my-2" mode="time">
                        <template v-slot="{ inputValue, inputEvents }">                            
                            <input
                            class="form-control"
                            label="Fecha"                            
                            :value="inputValue"
                            v-on="inputEvents"
                            />
                        </template>
                    </v-date-picker>
                  </v-col>
                </v-row>
                <v-row >                  
                  <v-col>                    
                    <v-date-picker   
                      @dayclick="loadSchedule"
                      :model-config="modelConfig"
                      v-model="date"/>
                  </v-col>                 
                  <v-col>
                    <div class="text-h6">
                      Horario del doctor el {{ date || 'seleccione otro dia...' }}
                    </div>                  
                    <ul v-if="consultas_dia.length != 0">
                      <li
                        v-for="consulta in consultas_dia"
                        :key="consulta"
                      >
                        Ocupado Desde {{ consulta.fechaInicio.getHours() }}:{{ consulta.fechaInicio.getMinutes() || '00' }} Hasta {{ consulta.fechaFin.getHours() }}:{{ consulta.fechaFin.getMinutes() || '00' }}
                      </li>
                      
                    </ul>
                    <div v-else>
                      El doctor no tiene consultas este dia.
                    </div>
                  </v-col>
                </v-row>
              </div>
              
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

    <!-- BEGIN MODAL -->
    <!-- END MODAL -->
</template>
<script>
  import 'v-calendar/dist/style.css';
  import { ref } from 'vue'
  export default {    
    setup () {
      const doctores = [
          'Luis Andrade',
          'Doctor Prueba',
          'David Guevara'
      ]
      const consultas = ref([
        {            
          descripcion: 'Consulta de Prueba',
          estado: 'Pendiente',
          fechaInicio: new Date(2022,8,10,10,0),
          fechaFin: new Date(2022,8,10,10,30),
          doctor: 'TKXtTIVrY5UXwpBAoYXOZJCc1Ry1',
          usuario: '71OykACAi9M1AjyeZPPofFtGsYN2'
        },
      ])
      let consultas_dia = ref([])
      const date = ref(new Date)
      const timeBegin = ref(new Date)
      const timeEnd = ref(new Date)
      let showSchedule = ref(false)
      const modelConfig = {
        type: 'string',
        mask: 'YYYY-MM-DD', // Uses 'iso' if missing
      }
      const descripcion = ref()
      const doctor = ref()
      let loading = ref(false)
      let dialog = ref(false)
      return {
        dialog,
        descripcion,
        doctor,
        loading,
        timeBegin,
        timeEnd,
        consultas_dia,
        modelConfig,
        date,
        showSchedule,
        consultas,
        doctores,       
        loadCalendar() {
          //alert(date.value)
          showSchedule.value = true        
        },
        loadSchedule(){
          consultas_dia.value = []
          consultas.value.forEach(element => {            
            if (element.fechaInicio.getMonth() == new Date(date.value).getMonth() + 1 ) {
              if (element.fechaInicio.getDate() == new Date(date.value).getDate() + 1) {
                if (element.estado == 'Pendiente') {
                  consultas_dia.value.push(element)
                } 
              }              
            }
          });
          console.log(consultas_dia.value)
          //alert(date.value)
        },
        submitForm(){
          loading.value = true
          consultas.value.push({
            descripcion: descripcion.value,estado: 'Pendiente',fechaInicio: timeBegin.value, fechaFin: timeEnd.value, doctor: doctor.value, usuario: 'Luis Andrade'
          })
          loading.value = false
          dialog.value = false
        }
      }
    },
  }
</script>