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

      await this.$store.dispatch('createTeam', {
        name: this.newTeamName,
        user_id: this.$store.state.user.uid
      });
      this.newTeamName = "";
    },
  },
};
</script>
