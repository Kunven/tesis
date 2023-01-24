<template>
    <v-card class="mx-2 my-3">    
        <v-card-text>
            <v-row>
                <v-col><h2>Total Citas: 6</h2></v-col>
                <v-col><h2>Total Usuarios: 6</h2></v-col>
                <v-col><h2>Total Especialistas: 1</h2></v-col>
            </v-row>
            <v-row>
                <h1>Citas por Doctor</h1>
            </v-row>
            <v-row>
                <v-col>
                    <Pie
                        id="my-chart-id"
                        :options="chartOptions"
                        :data="chartData"
                    />
                </v-col>                
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)
export default {
    components: { Pie },
    setup() {
        let chartData = {labels: [ 'Evelyn Medrano'],datasets: [ { data: [6] } ]}
      let chartOptions = {responsive: false}
        return{
            chartData,chartOptions
        }
    },
}
</script>
