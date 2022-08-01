<template>
  <!-- NAVIGATION DRAWER -->
  <v-navigation-drawer permanent>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        density="compact"
        nav
      >
        <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="Inicio"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Consultas" value="Consultas"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Fichas Medicas" value="Fichas"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Pacientes" value="Pacientes"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="Mi Usuario" value="Usuario"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  <!-- END NAVIGATION DRAWER -->
  <router-view/>
</template>

