<template>
   <v-container fluid pa-0>
      <v-row align="center" justify="center" 
        style="height:100vh;" dense>
        <v-col cols="12" lg="6" md="6" class="grey lighten-2 fill-height d-flex flex-column justify-center align-center">
          <v-card>
            <v-card-title class="justify-center">
              <h1>LOGO</h1>
            </v-card-title>
            <router-view/>
          </v-card>
        </v-col>                
      </v-row>
  </v-container>
</template>