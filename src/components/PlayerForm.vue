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
import { auth } from "../../firebaseConfig";
export default {
  data() {
    return {
      newPlayerName: "",
    };
  },
  methods: {
    async addPlayer() {
      await this.$store.dispatch("fetchUser");

      if (!this.$store.state.user) {
        console.error("User not available");
        return;
      }

      await this.$store.dispatch("createPlayer", {
        name: this.newPlayerName,
        user_id: this.$store.state.user.uid,
      });
      this.$store.dispatch("fetchPlayers", { userId: auth.currentUser.uid });
      this.newPlayerName = "";
    },
  },
};
</script>
