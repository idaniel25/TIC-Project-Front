<template>
  <v-form @submit.prevent="addPlayer" class="add-player">
    <v-h3>Adaugă jucător</v-h3>
    <v-row justify="center" class="w-50 mx-auto my-2">
      <v-col>
        <v-text-field
          v-model="newPlayerName"
          label="Nume jucător"
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
        newPlayerName: "",
    };
  },
  methods: {
    async addPlayer() {
      try {
        await axios.post("http://localhost:3000/players", {
          name: this.newPlayerName,
          user_id: auth.currentUser.uid,
        });
        this.newPlayerName = "";
        this.$emit("player-added"); // Emite eveniment către părinte
      } catch (error) {
        console.error("Eroare la adăugarea jucatorului:", error);
      }
    },
  },
};
</script>
