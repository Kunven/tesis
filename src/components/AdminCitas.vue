<template>  
    <v-card class="mx-2 mt-3">
        <h1>Citas</h1>
    </v-card>
    <!-- BEGIN DIALOG -->
  <div>
    <v-btn
      class="mx-2 my-1"
      prepend-icon="mdi-plus-circle"
      color="primary"
    >Nueva Cita
      <v-dialog
        v-model="dialog"
        activator="parent"
      >
        <v-card
          min-width="800"
        >
          <v-card-title>
            <span class="text-h5">Formulario de la Cita</span>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="formValidation"
              lazy-validation
            >
              <v-container>
              <v-row>
                <v-col>
                  <v-text-field label="Descripcion" required v-model="descripcion"/>
                </v-col>                
              </v-row>
              <v-row>   
                 <v-select
                 v-model="doctor"
                :items="doctoresRef"
                item-title="name"
                item-value="id"
                label="Seleccione un Doctor"
                @update:modelValue="loadCalendar"                
                ></v-select>
              </v-row>
              <div v-if="showSchedule">
                <span class="text-h5">Seleccione la Fecha y Hora de la Cita</span>
                <v-row>
                  <v-col>
                    <label>Hora de Inicio de la Cita</label>
                    <v-date-picker color="yellow" v-model="timeBegin" class="my-2" mode="time">
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
                    <label>Hora de Fin de la Cita</label>
                    <v-date-picker color="yellow" v-model="timeEnd" class="my-2" mode="time">
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
                      color="yellow"
                      @dayclick="loadSchedule"                      
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
            </v-form>            
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
              <th class="text-center">
              Descripcion
              </th>
              <th class="text-center">
              Fecha Inicio
              </th>
              <th class="text-center">
              Fecha Fin
              </th>
              <th class="text-center">
              Doctor
              </th>
              <th class="text-center">
              Estado
              </th>
              <th class="text-center">
              Acciones
              </th>
          </tr>
        </thead>
        <tbody>
          <tr
              v-for="item in consultas"
              :key="item.name"
          >
              <td class="text-center">{{ item.descripcion }}</td>
              <td class="text-center">{{ item.fechaInicio }}</td>
              <td class="text-center">{{ item.fechaFin }}</td>
              <td class="text-center">{{ item.doctor }}</td>
              <td class="text-center">{{ item.estado }}</td>
              <td class="text-center">
                <v-menu v-if="item.estado != 'Realizada'">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="primary"
                      v-bind="props"
                      prepend-icon="mdi-account-clock"
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
                            <v-card-title>Aprobar Cita</v-card-title>
                            <v-card-text>                  
                              Esta Seguro que Desea Aprobar Esta Cita?
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
                      <v-btn color="primary">Cancelar
                        <v-dialog activator="parent" v-model="dialogCancelar">
                          <v-card>
                            <v-card-title>Cancelar Cita</v-card-title>
                            <v-card-text>Esta Seguro que Desea Cancelar Esta Cita?</v-card-text>
                            <v-card-actions>
                              <v-btn color="primary" @click="cancelarCita(item.id)" :loading="loadingCancelar">Si</v-btn>
                              <v-btn @click="dialogCancelar = false">No</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn color="primary">Pagar
                        <v-dialog activator="parent" v-model="dialogPagar">
                          <v-card>
                            <v-card-title>Presione el boton para pagar</v-card-title>
                            <v-card-text>                   
                              <v-btn color="primary" :loading="loadingPagar" @click="pagarConsulta(item.id)">PAGAR</v-btn>
                            </v-card-text>                
                          </v-card>
                        </v-dialog>
                      </v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn color="primary" @click="RealizarConsulta" v-if="item.estado == 'Pagada'">Realizar
                        <v-dialog activator="parent" v-model="dialogRealizar">
                          <v-card>
                            <v-card-title>Realizar Cita</v-card-title>
                            <v-card-text>                  
                              Esta cita fue creada como presencial. Desea marcarla como realizada?
                            </v-card-text>
                            <v-card-actions>
                              <v-btn color="primary" @click="realizarConsulta(item.id)" :loading="loadingRealizar">Si</v-btn>
                              <v-btn @click="dialogRealizar = false">No</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-btn>
                    </v-list-item>

                  </v-list>
                </v-menu>
                <v-btn v-else color="success" prepend-icon="mdi-check">
                  Completada!
                </v-btn>
                
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
  import { Timestamp } from "firebase/firestore";
  import { ref,onMounted } from 'vue'
  export default {    
    setup () {
      const formValidation = ref(false)
      const dialogAprobar = ref(false)
      const dialogCancelar = ref(false)
      const dialogRealizar = ref(false)
      const dialogPagar = ref(false)      
      const doctoresRef = []
      let isDoc = false
      const store = useMainStore()
      let userRole = store.rol
      if (userRole == 0) {
        isDoc = false
      }else{
        isDoc = true
      }      
      console.log(userRole)
      let consultas = ref([])
      onMounted(async () =>{
        //get user
        
        //get Doctores
        let doctores = await db.collection('users').where('rol','==', "1" ).get()
        doctores.forEach(doc => {
          let data = doc.data()
          doctoresRef.push({name: data.first_name + ' ' + data.last_name,id: doc.id})
        });        
        //get Consultas
        auth.onAuthStateChanged(async (user) =>{
          let consultasRef = null
          console.log(user.uid)
          consultasRef = await db.collection('consultas').get()
          
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
      const descripcion = ref()
      const doctor = ref()
      let loadingMain = ref(false)
      let loadingAprobar = ref(false)
      let loadingCancelar= ref(false)
      let dialog = ref(false)
      let loadingRealizar = ref(false)
      let loadingPagar = ref(false)
      return {
        doctoresRef,dialog,descripcion,doctor,loadingMain,timeBegin,timeEnd,consultas_dia,date,showSchedule,
        consultas,isDoc,dialogAprobar,loadingAprobar,loadingCancelar,dialogCancelar,formValidation,loadingRealizar,
        dialogRealizar,dialogPagar,loadingPagar,
        async realizarConsulta(docId){
          loadingRealizar.value = true
          let doc = await db.collection('consultas').doc(docId)
          await doc.update({estado: 'Realizada'})
          auth.onAuthStateChanged(async (user) =>{
          consultas.value = []
          let consultasRef = await db.collection('consultas').where('usuario','==',user.uid).where('estado','!=','Cancelado').get()

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
          loadingRealizar.value = false
          dialogRealizar.value = false
          
        },
        loadCalendar() {          
          showSchedule.value = true
          //this.loadSchedule()
        },
        loadSchedule(){
          consultas_dia.value = []
          let consultas_doctor = []
          
          consultas.value.forEach(element => {            
            let doc_id = doctoresRef.filter(e => e.name == element.doctor)
            if (doc_id[0].id == doctor.value) {
              consultas_doctor.push(element)
            }
          });          
          consultas_doctor.forEach(element => {            
            if (element.fechaInicio.getMonth() + 1 == new Date(date.value).getMonth() + 1 ) {
              if (element.fechaInicio.getDate() + 1 == new Date(date.value).getDate() + 1) {
                if (element.estado == 'Pendiente') {
                  consultas_dia.value.push(element)
                } 
              }
            }
          });
        },
        async submitForm(){
          loadingMain.value = true
          const user = auth.currentUser
          const data = {
            descripcion: descripcion.value,
            doctor: doctor.value,
            estado: 'Pendiente',
            fechaFin: Timestamp.fromDate( new Date(date.value.getFullYear(),date.value.getMonth(),date.value.getDate(),timeEnd.value.getHours(),timeEnd.value.getMinutes())) ,
            fechaInicio: Timestamp.fromDate( new Date(date.value.getFullYear(),date.value.getMonth(),date.value.getDate(),timeBegin.value.getHours(),timeBegin.value.getMinutes())) ,
            usuario: user.uid
          }
          let valid = true
          //let consultas_filter = consultas.value.filter(e => (doctoresRef.filter(f => .name == )) == doctor.value)
          consultas.value.forEach(row => {
            let dataDateInicio = new Date(data.fechaInicio.seconds*1000)
            let dataDateFin = new Date(data.fechaFin.seconds*1000)
            
            if ((dataDateInicio >= row.fechaInicio && dataDateInicio <= row.fechaFin) || (dataDateFin <= row.fechaFin && dataDateFin >= row.fechaInicio)) {
              valid = false
            }
          });
          if (valid) {
            await db.collection('consultas').doc().set(data)
            loadingMain.value = false
            dialog.value = false
          }else{
            alert('Existe un Conflicto entre Una o Mas Citas')
            loadingMain.value = false
            
          }
          
          //loadingMain.value = false
          //dialog.value = false
          consultas.value = []
          let consultasRef = await db.collection('consultas').where('usuario','==',user.uid).where('estado','!=','Cancelado').get()

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
        },
        async aprobarConsulta(docId){
          loadingAprobar.value = true
          let doc = await db.collection('consultas').doc(docId)
          await doc.update({estado: 'Aprobado'})
          loadingAprobar.value = false
          dialogAprobar.value = false
          auth.onAuthStateChanged(async (user) =>{
          consultas.value = []
          let consultasRef = await db.collection('consultas').where('usuario','==',user.uid).where('estado','!=','Cancelado').get()

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
        },
        async cancelarCita(docId){
          loadingCancelar.value = true
          let doc = await db.collection('consultas').doc(docId)
          await doc.update({estado: 'Cancelado'})
          loadingCancelar.value = false
          dialogCancelar.value = false
          auth.onAuthStateChanged(async (user) =>{
          consultas.value = []
          let consultasRef = await db.collection('consultas').where('usuario','==',user.uid).where('estado','!=','Cancelado').get()

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
        },
        async pagarConsulta(docId){          
          let doc = await db.collection('consultas').doc(docId)
          await doc.update({estado: 'Pagada'})
          auth.onAuthStateChanged(async (user) =>{
          consultas.value = []
          let consultasRef = await db.collection('consultas').where('usuario','==',user.uid).where('estado','!=','Cancelado').get()

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
          dialogPagar.value = false
          
        }
      }
    },
  }
</script>