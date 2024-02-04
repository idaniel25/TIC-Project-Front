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
    <v-data-table
      class="bg-grey-lighten-2"
      :headers="headers"
      :items="players"
      :search="search"
      :items-per-page="5"
      :hide-default-footer="true"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-left">
            <template v-if="!isEditingPlayer || editedPlayer.id !== item.id">
              {{ item.name }}
            </template>
            <template v-else>
              <v-text-field
                v-model="editedPlayer.name"
                label="Player name"
                color="green"
                :rules="[(v) => !!v || 'Player name is required']"
              ></v-text-field>
            </template>
          </td>
          <td class="text-left">
            <template v-if="!isEditingPlayer || editedPlayer.id !== item.id">
              {{ getTeamName(item.team_id) || "-" }}
            </template>
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
              :disabled="
                !isEditingPlayer ||
                editedPlayer.id !== item.id ||
                !editedPlayer.name.trim()
              "
              icon
            >
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </td>
          <td class="text-left">
            <v-btn
              @click="deletePlayer(item)"
              icon
              color="red"
              class="text-black"
            >
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
    teams: Array,
    players: Array,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          align: "start",
          key: "name",
          title: "Player name",
          class: "font-weight-bold",
        },
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
        await this.$store.dispatch("setEditedPlayer", this.editedPlayer);

        this.isEditingPlayer = false;
        this.editedPlayer = { id: "", name: "", team_id: "" };
      } catch (error) {
        console.error("Error saving the player: ", error.message);
      }
    },
    async deletePlayer(player) {
      await this.$store.dispatch("deletePlayer", player);
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
