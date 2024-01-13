<!-- TeamForm.vue -->

<template>
    <v-form @submit.prevent="addTeam">
      <v-h3>Adaugă echipă</v-h3>
      <v-row justify="center" class="w-50 mx-auto my-2">
        <v-col>
          <v-text-field
            v-model="newTeamName"
            label="Nume echipă"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn type="submit" color="green" icon="mdi-plus"></v-btn>
        </v-col>
      </v-row>
    </v-form>
  </template>
  
  <script>
  import axios from "axios";
  import { auth } from "../../firebaseConfig";
  
  export default {
    data() {
      return {
        newTeamName: "",
      };
    },
    methods: {
      async addTeam() {
        try {
          await axios.post("http://localhost:3000/teams", {
            name: this.newTeamName,
            user_id: auth.currentUser.uid,
          });
          this.newTeamName = "";
          this.$emit("team-added"); // Emite eveniment către părinte
        } catch (error) {
          console.error("Eroare la adăugarea echipei:", error);
        }
      },
    },
  };
  </script>
  