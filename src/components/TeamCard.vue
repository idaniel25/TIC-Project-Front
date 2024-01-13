<template>
    <v-card class="w-75 mx-auto">
          <v-card-title>
            <template v-if="!isEditingTeam || editedTeam.id !== team.id">
              {{ team.name }}
            </template>
            <template v-else>
              <v-text-field
                v-model="editedTeam.name"
                label="Team name"
              ></v-text-field>
            </template>
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
          </v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item-group v-if="team.players">
                <v-list-item
                  v-for="player in team.players"
                  :key="player.id"
                  class="my-1"
                >
                  {{ player.name }}
                  <v-btn
                    @click="deletePlayerFromTeam(player)"
                    icon
                    class="ml-2"
                    size="small"
                  >
                    <!--alta functie-->
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
</template>

<script>
import axios from "axios";

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
        const response = await axios.put(
          `http://localhost:3000/teams/${this.editedTeam.id}`,
          { name: this.editedTeam.name }
        );
        this.$emit("team-updated");
        this.editedTeam = { id: "", name: "" };
        console.log("Echipa actualizată cu succes:", response.data);
      } catch (error) {
        console.error("Eroare la actualizarea echipei:", error.message);
      }
    },
    async deleteTeam(team) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/teams/${team.id}`
        );
        console.log("Echipa ștearsă cu succes:", response.data);
        this.$emit("team-deleted");
      } catch (error) {
        console.error("Eroare la ștergerea echipei:", error.message);
      }
    },
    async deletePlayerFromTeam(player) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/activePlayers/${player.id}`
        );
        console.log("Jucător șters cu succes:", response.data);
        this.$emit("player-deleted-from-team");
      } catch (error) {
        console.error("Eroare la ștergerea jucătorului:", error.message);
      }
    },
  },
};
</script>