<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-form @submit.prevent="addTeam" class="add-team">
          <v-h3>Adaugă echipă</v-h3>
          <v-text-field v-model="newTeamName" label="Nume echipă" required></v-text-field>
          <v-btn type="submit">Adaugă echipă</v-btn>
        </v-form>
      </v-col>

      <v-col v-if="isAddPlayerFormVisible">
        <v-form @submit.prevent="saveAddedPlayer">
          <v-h4>Adaugă jucător</v-h4>
          <v-text-field v-model="newPlayerName" label="Nume jucător" required></v-text-field>
          <v-btn type="submit">Adaugă jucător</v-btn>
        </v-form>
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

      <v-col v-if="editedPlayer.id !== ''">
        <v-form>
          <v-h3>Editare jucător</v-h3>
          <v-text-field v-model="editedPlayer.name" label="Nume jucător"></v-text-field>

          <v-select
            v-model="editedPlayer.team_id"
            :items="teams.map(team => ({ title: team.name, value: team.id }))"
            label="Selectează echipa"
          ></v-select>

          <v-btn @click="saveEditedPlayer">Salvează</v-btn>
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
                    <v-btn @click="editPlayer(player)">Edit</v-btn>
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
      teams: [],
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

        this.teams = teams.map((team) => {
          team.players = players.filter((player) => player.team_id === team.id);
          return team;
        });
      } catch (error) {
        console.error('Eroare la încărcarea datelor:', error.message);
      }
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
    showAddPlayerForm(teamId) {
      this.isAddPlayerFormVisible = true;
      this.selectedTeamId = teamId;
    },
    async saveAddedPlayer() {
      try {
        const selectedTeam = this.teams.find((t) => t.id === this.selectedTeamId);

        await axios.post('http://localhost:3000/players', { name: this.newPlayerName, team_id: selectedTeam.id });
        this.newPlayerName = '';
        this.isAddPlayerFormVisible = false;
        this.loadData();
      } catch (error) {
        console.error('Eroare la adăugarea jucătorului:', error);
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
    async editPlayer(player) {
      this.editedPlayer = { id: player.id, name: player.name, team_id: player.team_id };
    },
    async saveEditedPlayer() {
      try {
        const response = await axios.put(`http://localhost:3000/players/${this.editedPlayer.id}`, {
          name: this.editedPlayer.name,
          team_id: this.editedPlayer.team_id,
        });
        this.loadData();
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
  .add-team{
    width: 300px;
    margin: auto;
    margin-bottom: 20px;
  }
</style>