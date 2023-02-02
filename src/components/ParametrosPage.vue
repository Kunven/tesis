<template>
    <v-card class="mx-2 mt-3">
      <h1>Parametros</h1>
    </v-card>
    <v-dialog v-model="dialogNew">
      <template v-slot:activator="{ props }">
        <v-btn
          class="mx-2 my-1" prepend-icon="mdi-plus-circle"
          color="primary"
          v-bind="props"          
        >
          Nuevo Param
        </v-btn>
      </template>
      <v-card>
        <v-card-title><h1>Nuevo Param</h1></v-card-title>
        <v-card-text>
          <v-row>
            <v-text-field class="mr-2"  v-model="key" label="Key" />
            <v-text-field  v-model="value" label="Value" />
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="addParam">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>        
    <v-table class="mx-2 my-1">
        <thead>
            <tr>
                <th>Key</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in parametros"
                :key="item.key"
            >
                <td class="text-center">{{ item.key }}</td>
                <td class="text-center">{{ item.value }}</td>
            </tr>
        </tbody>
    </v-table>
    <v-card class="mx-2 mt-3">
      <h1 class="mx-2 mt-3">Credenciales de Correos para las Notificaciones</h1>
      <v-card>        
        <v-card-text>
          <h4 class="mx-2 mb-3">Configure los servicios y plantillas en el dashboard de EmailJS, luego copie aqui las credenciales que se usaran en las notificaciones</h4>
          <v-row>
            <v-col>
              <v-text-field label="service_id" required v-model="service_id"/>
            </v-col>
            <v-col>
              <v-text-field label="template_id" required v-model="template_id"/>
            </v-col>
            <v-col>
              <v-text-field label="public_id" required v-model="public_id"/>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="saveEmail">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>      
    </v-card>

</template>
<script>
import { db } from "../firebase.js"  
import { ref,onMounted} from 'vue'
export default {    
    setup() {
      let service_id = ref('')
      let public_id = ref('')
      let template_id = ref('')      
      let dialogNew = ref(false)
      let parametros = ref([{key: "api-key",value: "AIzaSyBeyl0azn0DOxSWRMYzfg1VqB5bfeAc2aM"},{key: "project-domain", value: "tesis-usm.firebaseapp.com"}])
      let key = ref('')
      let value = ref('')
      onMounted(async () =>{
          await db.collection('email').doc('credentials').get().then( (doc) =>{
            let data = doc.data()    
            service_id.value = data.service_id
            public_id.value = data.public_id
            template_id.value = data.template_id
        })
        
      })
      return{
          template_id,public_id,service_id,dialogNew,parametros,key,value,addParam(){
            //TODO
            parametros.value.push({key: key.value, value: value.value})
            dialogNew.value = false
            key.value = ''
            value.value = ''
          },async saveEmail(){

            await db.collection('email').doc('credentials').update({public_id: public_id.value, service_id: service_id.value, template_id: template_id.value}).then(async ()=>{              
              await db.collection('email').doc('credentials').get().then( (doc) =>{
                let data = doc.data()    
                service_id.value = data.service_id
                public_id.value = data.public_id
                template_id.value = data.public_id
              })
              
            })
          }
      }
    },
}
</script>
