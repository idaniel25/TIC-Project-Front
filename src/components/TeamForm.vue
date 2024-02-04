<template>
  <v-form @submit.prevent="addTeam" class="rounded-t-xl bg-grey-lighten-2">
    <h3 class="py-2">Add a team</h3>
    <v-alert v-if="showEmptyNameError" type="error" dense outlined>
      {{emptyNameErrorMessage}}
    </v-alert>
    <v-alert v-if="showDuplicateError" type="error" dense outlined>
      {{ duplicateErrorMessage }}
    </v-alert>
    <v-text-field
      v-model="newTeamName"
      label="Team name"
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
export default {
  data() {
    return {
      newTeamName: "",
      showDuplicateError: false,
      showEmptyNameError: false,
      duplicateErrorMessage: "",
      emptyNameErrorMessage: "",
    };
  },
  methods: {
    async addTeam() {
      try {
        await this.$store.dispatch("fetchUser");

        if (!this.$store.state.user) {
          console.error("User not available");
          return;
        }
        this.showDuplicateError = false;
        this.showEmptyNameError = false;
        await this.$store.dispatch("createTeam", {
          name: this.newTeamName,
          user_id: this.$store.state.user.uid,
        });
        this.newTeamName = "";
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.duplicateErrorMessage = error.response.data.error;
          this.showDuplicateError = true;
        } else if (error.response && error.response.status === 400){
          this.emptyNameErrorMessage = error.response.data.error;
          this.showEmptyNameError = true;
        }
      }
    },
  },
};
</script>