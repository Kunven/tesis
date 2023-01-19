<template>
    <v-card class="mx-2 my-3">
        <h1>Ubicaciones</h1>
    </v-card>
    <v-card class="mx-2 mt-3">
        <h1>Provincias</h1>
        <v-table class="mx-2 my-1">
            <thead>
                <th>ID</th>
                <th>Provincia</th>
            </thead>
            <tbody>
                <tr v-for="item in provinciasTable" :key="item.id" >
                    <td>{{ item.id }}</td>
                    <td>{{ item.provincia }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
    <v-card class="mx-2 mt-3">
        <h1>Cantones</h1>
        <v-table class="mx-2 my-1">
            <thead>
                <th>ID</th>
                <th>Canton</th>
            </thead>
            <tbody>
                <tr v-for="item in cantonesTable" :key="item.id" >
                    <td>{{ item.id }}</td>
                    <td>{{ item.canton }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>
<script>
import {provincias} from '../assets/provincias.js'  
import {cantones} from '../assets/cantones.js'
import { ref} from 'vue'

export default {    
    setup() {
        let provinciasTable = ref(provincias)
        let cantonesTable = ref(cantones)
        return{
            provinciasTable,cantonesTable
        }
    },
}
</script>
