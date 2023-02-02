<template>    
    <v-card class="mx-2 mt-3">
        <h1>Pagos</h1>
    </v-card>
    <v-table class="mx-2 my-1">
        <thead>
            <th class="text-center">
                Id
            </th>
            <th class="text-center">
                Cliente
            </th>
            <th class="text-center">
                Consulta - Descripcion
            </th>
            <th class="text-center">
                Estado
            </th>
            <th class="text-center">
                Doctor
            </th>
            <th class="text-center">
                Acciones
            </th>
        </thead>
        <tbody>
            <tr
                v-for="item in pagos"
                :key="item.id"
            >
            <td class="text-center">{{ item.id }}</td>
            <td class="text-center">{{ item.cliente }}</td>
            <td class="text-center">{{ item.consulta }}</td>
            <td class="text-center">{{ item.estado }}</td>
            <td class="text-center">{{ item.doctor }}</td>
            <td class="text-center">
                <v-dialog v-if="item.estado == 'Pendiente'" v-model="modalPagos">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        @click="modalPagos = true"
                        color="primary"
                        v-bind="props"                        
                      >
                        Manejar Pago
                      </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>Manejar Pago</v-card-title>
                        <v-card-text>Desea Aprobar o Rechazar este Pago?</v-card-text>
                        <v-card-actions>
                            <v-btn @click="manejarPago(0,item.id,item.consulta,item.cliente,item.doctor)">Aceptar</v-btn>
                            <v-btn @click="manejarPago(1,item.id,item.consulta,item.cliente,item.doctor)" color="primary">Rechazar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-btn v-else color="success" prepend-icon="mdi-check">
                  Completado
                </v-btn>
            </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script>
import { ref,onMounted } from 'vue'
import { db } from "../firebase.js"
import emailjs from '@emailjs/browser';

export default {    
    setup() {
        let modalPagos = ref(false)
        let pagos = ref([]);        
        onMounted(async () =>{
            let pagosRef = await db.collection('pagos').get()        
            pagosRef.forEach(row => {
            let data = row.data()          
            pagos.value.push({id: row.id, cliente: data.cliente, consulta: data.consulta, estado: data.estado, doctor: data.doctor})
            });
        });
        return{
            modalPagos,pagos,async manejarPago(tipo,doc_id,consulta_id,user_id,doctor_id){
                let message = "La solicitud de Pago de su Cita fue aprobada. El unico paso que le queda es realizar la cita con el especialista"
                if (tipo == 0) {//ACEPTAR
                    message = "La solicitud de Pago de su Cita fue aprobada. El unico paso que le queda es realizar la cita con el especialista"
                    let doc = await db.collection('pagos').doc(doc_id)
                    await doc.update({estado: 'Aceptado'})
                    await db.collection('consultas').doc(consulta_id).update({estado: 'Pagada'})
                }
                if (tipo == 1) {//RECHAZAR
                    message = "La solicitud de pago de su cita fue rechazada por el especialista. Tendra que volver a crear una nueva."
                    let doc = await db.collection('pagos').doc(doc_id)
                    await doc.update({estado: 'Rechazado'})
                    await db.collection('consultas').doc(consulta_id).update({estado: 'Realizada'})
                }
                pagos.value = []                
                //SEND MAIL
                let userRef = await db.collection('users').doc(user_id).get()
                let docRef = await db.collection('users').doc(doctor_id).get()
                let to_email = userRef.data().email                
                let doc_name = docRef.data().first_name + ' ' + docRef.data().last_name
                let subject = 'Se envia este correo para notificarle que su consulta con el especialista '+ doc_name+' a cambiado de estado'
                var emailParams = {to_email:to_email,message:message,doc_name: doc_name, subject: subject}
                let credentialsRef = await db.collection('email').doc('credentials').get()
                let credentialsData = credentialsRef.data()                
                emailjs.send(credentialsData.service_id,credentialsData.template_id,emailParams,credentialsData.public_id).then((response)=>{
                    console.log('Success: ', response)
                },(error) =>{
                    console.log('Error: ', error)
                })
                //END SEND MAIL
                modalPagos.value = false
                let pagosRef = await db.collection('pagos').get()        
                pagosRef.forEach(row => {
                let data = row.data()          
                pagos.value.push({id: row.id, cliente: data.cliente, consulta: data.consulta, estado: data.estado, doctor: data.doctor})
                });
            }
        }        
    },
}
</script>
