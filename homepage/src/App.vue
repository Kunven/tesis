<template>
  <v-app>    
    <v-main style="background-color:#2c3e50 ">
      <!-- NAVBAR -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand" href="#">Aqui va el Logo</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="/">Home </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/funciones">Funciones</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="http://localhost:8081/home" target="_blank">Ir a la App</a>
            </li>
          </ul>    
        </div>
      </nav>      
      <!-- MAIN APP -->
      <div class="my-2">
        <router-view/>
      </div>
      
    </v-main>
    <v-footer app>
      Aqui va el Encabezado de la Pagina 
    </v-footer>
  </v-app>
</template>

<script>

export default {  
  data: () => ({
    //
  }),
}
</script>
