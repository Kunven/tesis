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
                :items="doctoresRef"
                item-title="name"
                item-value="id"
                label="Seleccione un Doctor"
                @update:modelValue="loadCalendar"                
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
            <v-btn :loading="loadingMain" @click="submitForm">Guardar</v-btn>
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
                <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
        >
          Acciones
        </v-btn>
      </template>
      <v-list>
        <!-- <v-list-item>
          <v-btn>Actualizar</v-btn>
        </v-list-item> -->
        <v-list-item v-if="isDoc && item.estado != 'Aprobado'" >
          <v-btn color="primary">Aprobar
            <v-dialog activator="parent" v-model="dialogAprobar">
              <v-card>
                <v-card-title>Aprobar Solicitud</v-card-title>
                <v-card-text>                  
                  Esta Seguro que Desea Aprobar Esta Consulta?
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="aprobarConsulta(item.id)" :loading="loadingAprobar">Si</v-btn>
                  <v-btn @click="dialogAprobar = false">No</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </v-list-item>
        <v-list-item>          
          <v-btn color="primary">Cancelar</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn color="primary">Pagar</v-btn>
        </v-list-item>
        <v-list-item disabled="true">
          <v-btn color="primary">Realizar</v-btn>
        </v-list-item>

      </v-list>
    </v-menu>
                
              </td>
          </tr>
        </tbody>
    </v-table>
    <!-- END TABLE -->

    <!-- BEGIN MODAL -->
    <!-- END MODAL -->
</template>
<script>
  import { useMainStore} from '../store/mainStore'
  import 'v-calendar/dist/style.css';
  import { auth,db } from "../firebase.js"
  import { ref,onMounted } from 'vue'
  export default {    
    setup () {      
      const dialogAprobar = ref(false)
      const doctoresRef = []
      let isDoc = false
      const store = useMainStore()
      let userRole = store.rol
      if (userRole == 0) {
        isDoc = false
      }else{
        isDoc = true
      }      
      const consultas = ref([])
      onMounted(async () =>{
        //get user
        
        //get Doctores
        let doctores = await db.collection('users').where('rol','==', 1 ).get()
        doctores.forEach(doc => {
          let data = doc.data()          
          doctoresRef.push({name: data.first_name + ' ' + data.last_name,id: doc.id})
        });        
        //get Consultas
        auth.onAuthStateChanged(async (user) =>{                          
          let consultasRef = await db.collection('consultas').where('usuario','==',user.uid).get()
          consultasRef.forEach(doc => {
            let data = doc.data()
            consultas.value.push({
            ...data,
            fechaInicio: new Date(data.fechaInicio.seconds*1000),
            fechaFin: new Date(data.fechaFin.seconds*1000),
            doctor: doctoresRef.filter(e => e.id == data.doctor)[0].name,
            id: doc.id
            })
          });          
        });
        
        
      })
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
      let loadingMain = ref(false)
      let loadingAprobar = ref(false)
      let dialog = ref(false)
      return {
        doctoresRef,dialog,descripcion,doctor,loadingMain,timeBegin,timeEnd,consultas_dia,modelConfig,date,showSchedule,
        consultas,isDoc,dialogAprobar,loadingAprobar,
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
        },
        submitForm(){
          loadingMain.value = true
          consultas.value.push({
            descripcion: descripcion.value,estado: 'Pendiente',fechaInicio: timeBegin.value, fechaFin: timeEnd.value, doctor: doctor.value, usuario: 'Luis Andrade'
          })
          loadingMain.value = false
          dialog.value = false
        },
        async aprobarConsulta(docId){
          loadingAprobar.value = true
          let doc = await db.collection('consultas').doc(docId)
          await doc.update({estado: 'Aprobado'})
          loadingAprobar.value = false
          dialogAprobar.value = false
          console.log(docId)
        }
      }
    },
  }
</script>