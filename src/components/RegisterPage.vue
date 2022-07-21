<template>
    <v-card-text>
        <v-row>
            <v-col>
                <v-btn>
                    <router-link to="/login" style="text-decoration: none; color: inherit;">Regresar</router-link>
                </v-btn>
                
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-form style="width: 25vw;">
                    <v-text-field v-model="user" label="Usuario" />
                    <v-text-field v-model="password" label="Usuario" />
                    <v-text-field v-model="mail" label="Correo" />
                    <v-text-field v-model="city" label="Ciudad" />
                </v-form>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-btn>Crear Cuenta</v-btn>
            </v-col>
        </v-row>
    </v-card-text>
</template>
<script>
    export default {
        data(){
            return{
                user: '',
                password: '',
                mail: '',               
                cedula: '',
                city: '',
            }
        },
    }
</script>