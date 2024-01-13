<template>
    <v-card flat title="Players List">
          <template v-slot:text>
            <v-text-field
              v-model="search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              single-line
              variant="outlined"
              hide-details
            ></v-text-field>
          </template>
          <v-data-table
            :headers="headers"
            :items="players"
            :search="search"
            :items-per-page="5"
            :hide-default-footer="true"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-left">
                  <!-- Afișați numele jucătorului și echipa normal -->
                  <template
                    v-if="!isEditingPlayer || editedPlayer.id !== item.id"
                  >
                    {{ item.name }}
                  </template>
                  <!-- Afișați câmpul de text pentru nume când se editează -->
                  <template v-else>
                    <v-text-field
                      v-model="editedPlayer.name"
                      label="Nume jucător"
                    ></v-text-field>
                  </template>
                </td>
                <td class="text-left">
                  <!-- Afișați echipa normal -->
                  <template
                    v-if="!isEditingPlayer || editedPlayer.id !== item.id"
                  >
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
                      label="Selectează echipa"
                    ></v-select>
                  </template>
                </td>
                <td class="text-left">
                  <v-btn @click="editPlayer(item)" icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </td>
                <td class="text-left">
                  <v-btn
                    @click="saveEditedPlayer(item)"
                    :disabled="!isEditingPlayer || editedPlayer.id !== item.id"
                    icon
                  >
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </td>
                <td class="text-left">
                  <v-btn @click="deletePlayer(item)" icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
</template>

<script>
import axios from "axios";

export default {
  props: {
    teams: Array, // Primeste echipele ca proprietate din componenta parinte
    players: Array
  },
  data() {
    return {
        search: "",
        headers: [
        { align: "start", key: "name", title: "Player name" },
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
    async saveEditedPlayer(item) {
      try {
        const response = await axios.put(
          `http://localhost:3000/players/${item.id}`,
          this.editedPlayer
        );
        this.$emit("player-updated");
        this.isEditingPlayer = false;
        this.editedPlayer = { id: "", name: "", team_id: "" };
        console.log("Jucător actualizat cu succes:", response.data);
      } catch (error) {
        console.error("Eroare la actualizarea jucătorului:", error.message);
      }
    },
    async deletePlayer(player) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/players/${player.id}`
        );
        console.log("Jucător șters cu succes:", response.data);
        this.$emit("player-deleted");
      } catch (error) {
        console.error("Eroare la ștergerea jucătorului:", error.message);
      }
    },
    getTeamName(teamId) {
      const team = this.teams.find((t) => t.id === teamId);
      return team ? team.name : "";
    },
  },
};
</script>
