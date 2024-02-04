<template>
  <v-form class="rounded-t-xl bg-grey-lighten-2" @submit.prevent="addPlayer">
    <h3 class="py-2">Add a player</h3>
    <v-alert v-if="showEmptyNameError" type="error" dense outlined>
      {{emptyNameErrorMessage}}
    </v-alert>
    <v-text-field
      v-model="newPlayerName"
      label="Player name"
      class="w-75 mx-auto mt-3"
      color="green"
      required
    ></v-text-field>
    <div class="pb-4">
      <v-btn type="submit" color="green" icon="mdi-plus"></v-btn>
    </div>
  </v-form>
</template>

<script>
import { auth } from "../../firebaseConfig";
export default {
  data() {
    return {
      newPlayerName: "",
      showEmptyNameError: false,
      emptyNameErrorMessage: "",
    };
  },
  methods: {
    async addPlayer() {
      try {
        await this.$store.dispatch("fetchUser");
  
        if (!this.$store.state.user) {
          console.error("User not available");
          return;
        }
        this.showEmptyNameError = false;
        await this.$store.dispatch("createPlayer", {
          name: this.newPlayerName,
          user_id: this.$store.state.user.uid,
        });
        this.$store.dispatch("fetchPlayers", { userId: auth.currentUser.uid });
        this.newPlayerName = "";
      } catch(error) {
         if (error.response && error.response.status === 400){
          this.emptyNameErrorMessage = error.response.data.error;
          this.showEmptyNameError = true;
        }
      }
    },
  },
};
</script>