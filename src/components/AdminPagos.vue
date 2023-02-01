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
                            <v-btn @click="manejarPago(0,item.id)">Aceptar</v-btn>
                            <v-btn @click="manejarPago(1,item.id)" color="primary">Rechazar</v-btn>
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
            modalPagos,pagos,async manejarPago(tipo,doc_id){
                if (tipo == 0) {//ACEPTAR
                    let doc = await db.collection('pagos').doc(doc_id)
                    await doc.update({estado: 'Aceptado'})
                }
                if (tipo == 1) {//RECHAZAR
                    let doc = await db.collection('pagos').doc(doc_id)
                    await doc.update({estado: 'Rechazado'})
                }
                pagos.value = []                
                //SEND MAIL
                
                //END SEND MAIL                
                modalPagos.value = false

            }
        }        
    },
}
</script>
