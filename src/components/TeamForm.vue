<!-- TeamForm.vue -->

<template>
  <v-form @submit.prevent="addTeam" class="rounded-t-xl bg-grey-lighten-2 ">
    <h3 class="py-2">Add a team</h3>
    <v-text-field
      v-model="newTeamName"
      label="Team name"
      class="w-75 mx-auto"
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
    };
  },
  methods: {
    async addTeam() {
      await this.$store.dispatch("fetchUser");

      if (!this.$store.state.user) {
        console.error("User not available");
        return;
      }

      await this.$store.dispatch("createTeam", {
        name: this.newTeamName,
        user_id: this.$store.state.user.uid,
      });
      this.newTeamName = "";
    },
  },
};
</script>
