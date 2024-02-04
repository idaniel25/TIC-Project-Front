<template>
  <v-card flat class="w-75 mx-auto rounded-shaped">
    <v-card-title class="bg-green">
      <template v-if="!isEditingTeam || editedTeam.id !== team.id">
        <div class="text-h5">
          {{ team.name }}
        </div>
      </template>
      <template v-else>
        <v-text-field
          v-model="editedTeam.name"
          label="Team name"
          bg-color="grey-lighten-2"
        ></v-text-field>
      </template>
      <div class="py-2">
        <v-btn @click="editTeam(team)" icon class="ml-2">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          @click="saveEditedTeam"
          icon
          class="ml-2"
          :disabled="!isEditingTeam || editedTeam.id !== team.id"
        >
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn @click="deleteTeam(team)" icon class="ml-2">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text class="bg-grey-lighten-1 py-4">
      <v-list class="bg-grey-lighten-1" v-if="team.players">
        <!-- <v-list-item-group > -->
          <v-list-item
            v-for="player in team.players"
            :key="player.id"
            class="my-1 rounded-pill bg-grey-lighten-2 w-75 mx-auto"
          >
            <div class="d-flex align-center">
              <div>
                {{ player.name }}
              </div>
              <v-spacer></v-spacer>
              <div>
                <v-btn
                  @click="deletePlayerFromTeam(player)"
                  icon
                  class="ml-2"
                  size="small"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </v-list-item>
        <!-- </v-list-item-group> -->
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    team: Object,
  },
  data() {
    return {
      isEditingTeam: false,
      editedTeam: { id: "", name: "" },
    };
  },
  methods: {
    async editTeam(team) {
      this.editedTeam = { id: team.id, name: team.name };
      this.isEditingTeam = true;
    },
    async saveEditedTeam() {
      try {
        await this.$store.dispatch("setEditedTeam", this.editedTeam);

        this.isEditingTeam = false;
        this.editedTeam = { id: "", name: "" };
      } catch (error) {
        console.error("Eroare la salvarea echipei:", error.message);
      }
    },
    async deleteTeam(team) {
      await this.$store.dispatch("deleteTeam", team);
      // Emiterea unui eveniment sau alte acțiuni după ștergere, dacă este cazul
      this.$emit("team-deleted");
    },
    async deletePlayerFromTeam(player) {
      await this.$store.dispatch("deletePlayerFromTeam", player);

      // Restul logicii asociate ștergerii jucătorului din echipă în componenta ta
      this.$emit("player-deleted-from-team");
    },
  },
};
</script>
