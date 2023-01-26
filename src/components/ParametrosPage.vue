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
</template>
<script>
import { ref} from 'vue'
export default {    
    setup() {
        let dialogNew = ref(false)
        let parametros = ref([{key: "correo",value: "correo@correo.com"},{key: "api-key",value: "AIzaSyBeyl0azn0DOxSWRMYzfg1VqB5bfeAc2aM"},{key: "project-domain", value: "tesis-usm.firebaseapp.com"}])
        let key = ref('')
        let value = ref('')
        return{
            dialogNew,parametros,key,value,addParam(){
              parametros.value.push({key: key.value, value: value.value})
              dialogNew.value = false
              key.value = ''
              value.value = ''
            }
        }
    },
}
</script>
