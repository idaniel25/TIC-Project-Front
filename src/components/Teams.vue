<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-form @submit.prevent="addTeam">
          <v-h3>Adaugă echipă</v-h3>
          <v-row justify="center" class="w-50 mx-auto my-2">
            <v-col>
              <v-text-field v-model="newTeamName" label="Nume echipă" required></v-text-field>
            </v-col>
            <v-col>
              <v-btn type="submit" color="green" icon="mdi-plus"></v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>

      <v-col>
        <v-form @submit.prevent="addPlayer" class="add-player">
          <v-h3>Adaugă jucător</v-h3>
          <v-row  justify="center" class="w-50 mx-auto my-2">
            <v-col>
              <v-text-field v-model="newPlayerName" label="Nume jucător" required></v-text-field>
            </v-col>
            <v-col>
              <v-btn type="submit" color="green" icon="mdi-plus"></v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-row class="w-75 mx-auto">
      <v-col>
        <v-card
          flat
          title="Players List"
        >
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
                  <template v-if="!isEditingPlayer || editedPlayer.id !== item.id">
                    {{ item.name }}
                  </template>
                  <!-- Afișați câmpul de text pentru nume când se editează -->
                  <template v-else>
                    <v-text-field v-model="editedPlayer.name" label="Nume jucător"></v-text-field>
                  </template>
                </td>
                <td class="text-left">
                  <!-- Afișați echipa normal -->
                  <template v-if="!isEditingPlayer || editedPlayer.id !== item.id">
                    {{ getTeamName(item.team_id) || '-' }}
                  </template>
                  <!-- Afișați spinner-ul pentru echipă când se editează -->
                  <template v-else>
                    <v-select
                      v-model="editedPlayer.team_id"
                      :items="teams.map(team => ({ title: team.name, value: team.id }))"
                      label="Selectează echipa"
                    ></v-select>
                  </template>
                </td>
                <td class="text-left">
                  <v-btn @click="editPlayer(item)" icon >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </td>
                <td class="text-left"> 
                  <v-btn @click="saveEditedPlayer(item)" icon>
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
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="editedTeam.id !== ''">
        <v-form>
          <v-h3>Editare echipă</v-h3>
          <v-text-field v-model="editedTeam.name" label="Nume echipă"></v-text-field>
          <v-btn @click="saveEditedTeam">Salvează</v-btn>
        </v-form>
      </v-col>
    </v-row>

    <v-h2>Echipe și Jucători</v-h2>
    
    <v-row>
      <v-col v-for="team in teams" :key="team.id">
        <v-card>
          <v-card-title>
            {{ team.name }}
            <v-btn @click="editTeam(team)">Edit</v-btn>
            <v-btn @click="deleteTeam(team)">Delete</v-btn>
            <v-btn @click="showAddPlayerForm(team.id)">Add a player</v-btn>
          </v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item-group v-if="team.players">
                <v-list-item v-for="player in team.players" :key="player.id">
                    {{ player.name }}
                    <v-btn @click="deletePlayer(player)">Delete</v-btn>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      search: '',
      teams: [],
      players: [],
      headers: [
        { align: 'start', key: 'name', title: 'Player name'},
        { align: 'start', key: 'team_id', title: 'Team'},
        { align: 'start', title: 'Edit', sortable: false },
        { align: 'start', title: 'Save', sortable: false },
        { align: 'start', title: 'Delete', sortable: false },
      ],
      isEditingPlayer: false,
      editedTeam: { id: '', name: '' },
      editedPlayer: { id: '', name: '', team_id: '' },
      isAddPlayerFormVisible: false,
      selectedTeamId: null,
      newTeamName: '',
      newPlayerName: '',
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const teamsResponse = await axios.get('http://localhost:3000/teams');
        const playersResponse = await axios.get('http://localhost:3000/players');

        const teams = teamsResponse.data;
        const players = playersResponse.data;

        this.players = players

        this.teams = teams.map((team) => {
          team.players = players.filter((player) => player.team_id === team.id);
          return team;
        });
      } catch (error) {
        console.error('Eroare la încărcarea datelor:', error.message);
      }
    },
    getTeamName(teamId) {
      const team = this.teams.find((t) => t.id === teamId);
      return team ? team.name : '';
    },
    async addTeam() {
      try {
        await axios.post('http://localhost:3000/teams', { name: this.newTeamName });
        this.newTeamName = '';
        this.loadData();
      } catch (error) {
        console.error('Eroare la adăugarea echipei:', error);
      }
    },
    async editTeam(team) {
      this.editedTeam = { id: team.id, name: team.name };
    },
    async saveEditedTeam() {
      try {
        const response = await axios.put(`http://localhost:3000/teams/${this.editedTeam.id}`, { name: this.editedTeam.name });
        this.loadData();
        this.editedTeam = { id: '', name: '' };
        console.log('Echipa actualizată cu succes:', response.data);
      } catch (error) {
        console.error('Eroare la actualizarea echipei:', error.message);
      }
    },
    async deleteTeam(team) {
      try {
        const response = await axios.delete(`http://localhost:3000/teams/${team.id}`);
        console.log('Echipa ștearsă cu succes:', response.data);
        this.loadData();
      } catch (error) {
        console.error('Eroare la ștergerea echipei:', error.message);
      }
    },
    async addPlayer() {
      try {
        await axios.post('http://localhost:3000/players', { name: this.newPlayerName });
        this.newPlayerName = '';
        this.loadData();
      } catch (error) {
        console.error('Eroare la adăugarea jucatorului:', error);
      }
    },
    async editPlayer(player) {
      this.editedPlayer = {
        id: player.id,
        name: player.name,
        team_id: player.team_id || '',
      };

      this.isEditingPlayer = true;
    },
    async saveEditedPlayer(item) {
      try {
        const response = await axios.put(`http://localhost:3000/players/${item.id}`, this.editedPlayer);
        this.loadData();
        this.isEditingPlayer = false;
        this.editedPlayer = { id: '', name: '', team_id: '' };
        console.log('Jucător actualizat cu succes:', response.data);
      } catch (error) {
        console.error('Eroare la actualizarea jucătorului:', error.message);
      }
    },

    async deletePlayer(player) {
      try {
        const response = await axios.delete(`http://localhost:3000/players/${player.id}`);
        console.log('Jucător șters cu succes:', response.data);
        this.loadData();
      } catch (error) {
        console.error('Eroare la ștergerea jucătorului:', error.message);
      }
    },
  },
};
</script>

<style scoped>
 
</style>