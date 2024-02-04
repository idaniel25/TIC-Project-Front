<template>
  <h2 class="bg-grey-lighten-2 custom-card">Players List</h2>
  <v-card flat class="rounded-b-xl bg-grey-lighten-2">
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        single-line
        variant="outlined"
        color="green"
        hide-details
        class="font-weight-bold"
      ></v-text-field>
    </template>
    <v-data-table class="bg-grey-lighten-2"
      :headers="headers"
      :items="players"
      :search="search"
      :items-per-page="5"
      :hide-default-footer="true"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-left ">
            <!-- Afișați numele jucătorului și echipa normal -->
            <template v-if="!isEditingPlayer || editedPlayer.id !== item.id">
              {{ item.name }}
            </template>
            <!-- Afișați câmpul de text pentru nume când se editează -->
            <template v-else>
              <v-text-field
                v-model="editedPlayer.name"
                label="Player name"
                color="green"
              ></v-text-field>
            </template>
          </td>
          <td class="text-left">
            <!-- Afișați echipa normal -->
            <template v-if="!isEditingPlayer || editedPlayer.id !== item.id">
              {{ getTeamName(item.team_id) || "-" }}
            </template>
            <!-- Afișați spinner-ul pentru echipă când se editează -->
            <template v-else>
              <v-select
                v-model="editedPlayer.team_id"
                :items="
                  teams.map((team) => ({
                    title: team.name,
                    value: team.id,
                  }))
                "
                label="Select the team"
                color="green"
              ></v-select>
            </template>
          </td>
          <td class="text-left">
            <v-btn @click="editPlayer(item)" icon color="green">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </td>
          <td class="text-left">
            <v-btn
              @click="saveEditedPlayer()"
              :disabled="!isEditingPlayer || editedPlayer.id !== item.id"
              icon
            >
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </td>
          <td class="text-left">
            <v-btn @click="deletePlayer(item)" icon color="red" class="text-black">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>


export default {
  props: {
    teams: Array, // Primeste echipele ca proprietate din componenta parinte
    players: Array,
  },
  data() {
    return {
      search: "",
      headers: [
        { align: "start", key: "name", title: "Player name" , class: "font-weight-bold"},
        { align: "start", key: "team_id", title: "Team" },
        { align: "start", title: "Edit", sortable: false },
        { align: "start", title: "Save", sortable: false },
        { align: "start", title: "Delete", sortable: false },
      ],
      isEditingPlayer: false,
      editedPlayer: { id: "", name: "", team_id: "" },
    };
  },
  methods: {
    async editPlayer(player) {
      this.editedPlayer = {
        id: player.id,
        name: player.name,
        team_id: player.team_id || "",
      };

      this.isEditingPlayer = true;
    },
    async saveEditedPlayer() {
      try {
        // Salvează jucătorul actualizat în Vuex
        await this.$store.dispatch("setEditedPlayer", this.editedPlayer);

        // Restul logicii asociate actualizării jucătorului în componenta ta
        this.isEditingPlayer = false;
        this.editedPlayer = { id: "", name: "", team_id: "" };
        console.log(
          "Jucător actualizat cu succes:",
          this.$store.state.editedPlayer
        );
      } catch (error) {
        console.error("Eroare la salvarea jucătorului: ", error.message);
      }
    },
    async deletePlayer(player) {
       await this.$store.dispatch("deletePlayer", player);
      // Emiterea unui eveniment sau alte acțiuni după ștergere, dacă este cazul
      this.$emit("player-deleted");
    },
    getTeamName(teamId) {
      const team = this.teams.find((t) => t.id === teamId);
      return team ? team.name : "";
    },
  },
};
</script>

<style scoped>
.custom-card {
  margin-bottom: -20px;
  padding: 20px 0px;
}
</style>
