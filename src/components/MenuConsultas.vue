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
            <span class="text-h5">Formulario de la Consulta</span>
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
                <span class="text-h5">Seleccione la Fecha y Hora de la Consulta</span>
                <v-row>
                  <v-col>
                    <label>Hora de Inicio de la Consulta</label>
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
                    <label>Hora de Fin de la Consulta</label>
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
                      El especialista no tiene consultas este dia.
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
                    <v-list-item>
                      <v-btn color="primary">
                        <v-dialog activator="parent" v-model="dialogNOtas">
                          <v-card>
                            TEMP
                          </v-card>
                        </v-dialog>
                      </v-btn>
                    </v-list-item>
                    <v-list-item v-if="isDoc && item.estado != 'Aprobado'" >
                      <v-btn color="primary">Aprobar
                        <v-dialog activator="parent" v-model="dialogAprobar">
                          <v-card>
                            <v-card-title>Aprobar Consulta</v-card-title>
                            <v-card-text>                  
                              Esta Seguro que Desea Aprobar Esta Consulta?
                            </v-card-text>
                            <v-card-actions>
                              <v-btn color="primary" @click="aprobarConsulta(item.id,item.doctor_id)" :loading="loadingAprobar">Si</v-btn>
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
                            <v-card-title>Cancelar Consulta</v-card-title>
                            <v-card-text>Esta Seguro que Desea Cancelar Esta Consulta?</v-card-text>
                            <v-card-actions>
                              <v-btn color="primary" @click="cancelarCita(item.id,item.doctor_id)" :loading="loadingCancelar">Si</v-btn>
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
                              <v-btn color="primary" :loading="loadingPagar" @click="pagarConsulta(item.doctor_id,item.usuario,item.id)">PAGAR</v-btn>
                            </v-card-text>                
                          </v-card>
                        </v-dialog>
                      </v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn color="primary" @click="RealizarConsulta" v-if="item.estado == 'Pagada'">Realizar
                        <v-dialog activator="parent" v-model="dialogRealizar">
                          <v-card>
                            <v-card-title>Realizar Consulta</v-card-title>
                            <v-card-text>                  
                              Esta Consulta fue creada como presencial. Desea marcarla como realizada?
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
  import emailjs from '@emailjs/browser';
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
          if (userRole == 1) {//Doctor
            consultasRef = await db.collection('consultas').where('doctor','==',user.uid).where('estado','!=','Cancelado').get()
          }else{//usuario
            consultasRef = await db.collection('consultas').where('usuario','==',user.uid).where('estado','!=','Cancelado').get()
          }
          
          consultasRef.forEach(doc => {
            let data = doc.data()
            consultas.value.push({
            ...data,
            fechaInicio: new Date(data.fechaInicio.seconds*1000),
            fechaFin: new Date(data.fechaFin.seconds*1000),
            doctor: doctoresRef.filter(e => e.id == data.doctor)[0].name,
            doctor_id: doctoresRef.filter(e => e.id == data.doctor)[0].id,
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
            doctor_id: doctoresRef.filter(e => e.id == data.doctor)[0].id,
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
            alert('Existe un Conflicto entre Una o Mas Consultas')
            loadingMain.value = false
            
          }
          
          //loadingMain.value = false
          //dialog.value = false
          consultas.value = []
          let consultasRef = await db.collection('consultas').where('usuario','==',user.uid).where('estado','!=','Cancelado').get()
          //SEND MAIL
          let userRef = await db.collection('users').doc(user.uid).get()
          let docRef = await db.collection('users').doc(doctor.value).get()
          let to_email = docRef.data().email
          let subject = 'A recibido una nueva solicitud para una consulta.'
          let message = 'Ingrese a la aplicacion para aprobarla o rechazarla. La consulta fue enviada por el usuario: ' + userRef.data().first_name + ' ' + userRef.data().last_name + ' Correo(' + userRef.data().email + ')'
          let doc_name = docRef.data().first_name + ' ' + docRef.data().last_name
          var emailParams = {to_email:to_email,message:message,doc_name: doc_name, subject: subject}
          let credentialsRef = await db.collection('email').doc('credentials').get()
          let credentialsData = credentialsRef.data()
          //console.log(emailParams)
          emailjs.send(credentialsData.service_id,credentialsData.template_id,emailParams,credentialsData.public_id).then((response)=>{
              console.log('Success: ', response)
          },(error) =>{
              console.log('Error: ', error)
          })
          //END SEND MAIL
          consultasRef.forEach(doc => {
            let data = doc.data()
            consultas.value.push({
            ...data,
            fechaInicio: new Date(data.fechaInicio.seconds*1000),
            fechaFin: new Date(data.fechaFin.seconds*1000),
            doctor: doctoresRef.filter(e => e.id == data.doctor)[0].name,
            doctor_id: doctoresRef.filter(e => e.id == data.doctor)[0].id,
            id: doc.id
            })
          });
        },
        async aprobarConsulta(docId,doctor_id){
          loadingAprobar.value = true
          let doc = await db.collection('consultas').doc(docId)
          await doc.update({estado: 'Aprobado'})
          loadingAprobar.value = false
          dialogAprobar.value = false
          auth.onAuthStateChanged(async (user) =>{
          consultas.value = []
          let consultasRef = await db.collection('consultas').where('usuario','==',user.uid).where('estado','!=','Cancelado').get()
          //SEND MAIL
          let userRef = await db.collection('users').doc(user.uid).get()
          let docRef = await db.collection('users').doc(doctor_id).get()
          let to_email = userRef.data().email          
          let message = 'Su Consulta a sido aprobada. El siguiente paso es mandar la solicitud de pago y esperar a que el especialista la apruebe'
          let doc_name = docRef.data().first_name + ' ' + docRef.data().last_name
          let subject = 'Se envia este correo para notificarle que su consulta con el especialista '+ doc_name+' a cambiado de estado'
          var emailParams = {to_email:to_email,message:message,doc_name: doc_name, subject: subject}
          let credentialsRef = await db.collection('email').doc('credentials').get()
          let credentialsData = credentialsRef.data()
          //console.log(emailParams)
          emailjs.send(credentialsData.service_id,credentialsData.template_id,emailParams,credentialsData.public_id).then((response)=>{
              console.log('Success: ', response)
          },(error) =>{
              console.log('Error: ', error)
          })
          //END SEND MAIL
          consultasRef.forEach(doc => {
            let data = doc.data()
            consultas.value.push({
            ...data,
            fechaInicio: new Date(data.fechaInicio.seconds*1000),
            fechaFin: new Date(data.fechaFin.seconds*1000),
            doctor: doctoresRef.filter(e => e.id == data.doctor)[0].name,
            doctor_id: doctoresRef.filter(e => e.id == data.doctor)[0].id,
            id: doc.id
            })
          });
        });
        },
        async cancelarCita(docId,doctor_id){
          loadingCancelar.value = true
          let doc = await db.collection('consultas').doc(docId)
          await doc.update({estado: 'Cancelado'})
          loadingCancelar.value = false
          dialogCancelar.value = false
          auth.onAuthStateChanged(async (user) =>{
          consultas.value = []
          let consultasRef = await db.collection('consultas').where('usuario','==',user.uid).where('estado','!=','Cancelado').get()
          //SEND MAIL
          let userRef = await db.collection('users').doc(user.uid).get()
          let docRef = await db.collection('users').doc(doctor_id).get()
          let to_email = userRef.data().email          
          let message = 'Su Consulta a sido cancelada. El especialista a decidido cancelar su consulta'
          let doc_name = docRef.data().first_name + ' ' + docRef.data().last_name
          let subject = 'Se envia este correo para notificarle que su consulta con el especialista '+ doc_name+' a cambiado de estado'
          var emailParams = {to_email:to_email,message:message,doc_name: doc_name, subject: subject}
          let credentialsRef = await db.collection('email').doc('credentials').get()
          let credentialsData = credentialsRef.data()
          //console.log(emailParams)
          emailjs.send(credentialsData.service_id,credentialsData.template_id,emailParams,credentialsData.public_id).then((response)=>{
              console.log('Success: ', response)
          },(error) =>{
              console.log('Error: ', error)
          })
          //END SEND MAIL
          consultasRef.forEach(doc => {
            let data = doc.data()
            consultas.value.push({
            ...data,
            fechaInicio: new Date(data.fechaInicio.seconds*1000),
            fechaFin: new Date(data.fechaFin.seconds*1000),
            doctor: doctoresRef.filter(e => e.id == data.doctor)[0].name,
            doctor_id: doctoresRef.filter(e => e.id == data.doctor)[0].id,
            id: doc.id
            })
          });
        });
        },
        async pagarConsulta(docId,userId,citaId){
          
          let doc = await db.collection('consultas').doc(citaId)
          await doc.update({estado: 'Pendiente Pago'})
          auth.onAuthStateChanged(async (user) =>{
          consultas.value = []
          let consultasRef = await db.collection('consultas').where('usuario','==',user.uid).where('estado','!=','Cancelado').get()
          //SEND MAIL
          let userRef = await db.collection('users').doc(user.uid).get()
          let docRef = await db.collection('users').doc(docId).get()
          let to_email = docRef.data().email          
          let message = 'Ingrese a la aplicacion para aprobarla o rechazarla.'
          let doc_name = docRef.data().first_name + ' ' + docRef.data().last_name
          let subject = 'A recibido una nueva solicitud de pago para la consulta con el usuario: ' + userRef.data().first_name + ' ' + userRef.data().last_name + ' Correo(' + userRef.data().email + ')'
          var emailParams = {to_email:to_email,message:message,doc_name: doc_name, subject: subject}
          let credentialsRef = await db.collection('email').doc('credentials').get()
          let credentialsData = credentialsRef.data()
          //console.log(emailParams)
          emailjs.send(credentialsData.service_id,credentialsData.template_id,emailParams,credentialsData.public_id).then((response)=>{
              console.log('Success: ', response)
          },(error) =>{
              console.log('Error: ', error)
          })
          //END SEND MAIL
          consultasRef.forEach(doc => {
            let data = doc.data()
            consultas.value.push({
            ...data,
            fechaInicio: new Date(data.fechaInicio.seconds*1000),
            fechaFin: new Date(data.fechaFin.seconds*1000),
            doctor: doctoresRef.filter(e => e.id == data.doctor)[0].name,
            doctor_id: doctoresRef.filter(e => e.id == data.doctor)[0].id,
            id: doc.id
            })
          });
          let pagoData = {cliente: userId, consulta: citaId, estado: 'Pendiente', doctor: docId}
          await db.collection('pagos').doc().set(pagoData)
        });          
          dialogPagar.value = false
          
        }
      }
    },
  }
</script>