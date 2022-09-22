<template>
  <v-carousel v-model="model">
    <v-carousel-item style="background-color:white"
      v-for="(e) in noticias"
      :key="e"
      :src=e.imagen
    >
    <div class="row">
          <div class="text-h2 my-2 mx-2">{{ e.titulo }}</div>
        </div>          
        <div class="row">
          <div class="text-h5 my-2 mx-3">{{ e.cuerpo }}</div>
        </div>
    </v-carousel-item>
  </v-carousel>
  <v-card></v-card>
</template>


<script>
  import { db } from "../firebase.js"
  import { ref,onMounted } from 'vue'
  export default {
    data: () => ({
      model: 0,
      colors: [
        'primary',
        'secondary',
        'yellow darken-2',
        'red',
        'orange',
      ],
    }),  
    setup () {
      const test = ref(123)
      let noticias = ref([])      
      onMounted(async () =>{
        const newsRef = await db.collection('noticias').where('activo','==',true).get()
        newsRef.forEach(element => {
          noticias.value.push(element.data())
        });
        console.log(noticias.value)

      })
      return {
        test,noticias
      }
    },
  }
  // cuerpo, imagen, fecha, activo, titulo
</script>

