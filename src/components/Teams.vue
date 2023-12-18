<!-- eslint-disable vue/multi-word-component-names -->

<template>
    <div>
        <!-- Formular pentru adăugarea unei echipe -->
        <form @submit.prevent="addTeam">
          <h3>Adaugă echipă</h3>
          <label for="teamName">Nume echipă:</label>
          <input type="text" v-model="newTeamName" id="teamName" required />
          <button type="submit">Adaugă echipă</button>
        </form>

      <h2>Echipe și Jucători</h2>

      <!-- Adaugă formularul de editare a echipei -->
      <div v-if="editedTeam.id !== ''">
            <h3>Editare echipă</h3>
            <label for="editedTeamName">Nume echipă:</label>
            <input v-model="editedTeam.name" id="editedTeamName" />
            <button @click="saveEditedTeam">Salvează</button>
      </div>

      <!-- Adaugă formularul de editare a jucătorului -->
      <div v-if="editedPlayer.id !== ''">
        <h3>Editare jucător</h3>
        <label for="editedPlayerName">Nume jucător:</label>
        <input v-model="editedPlayer.name" id="editedPlayerName" />
        
        <!-- Adaugă selectorul pentru echipă -->
        <label for="editedPlayerTeam">Echipă:</label>
        <select v-model="editedPlayer.team_id" id="editedPlayerTeam">
          <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
        </select>

        <button @click="saveEditedPlayer">Salvează</button>
      </div>
  
      <!-- Lista de echipe și jucători -->
      <ul>
        <li v-for="team in teams" :key="team.id">
          {{ team.name }}
          <button @click="editTeam(team)">Edit</button>
          <button @click="deleteTeam(team)">Delete</button>
  
          <!-- Formular pentru adăugarea unui jucător la echipă -->
          <form @submit.prevent="addPlayer(team)">
            <h4>Adaugă jucător</h4>
            <label for="playerName">Nume jucător:</label>
            <input type="text" v-model="newPlayerName" id="playerName" required />
            <button type="submit">Adaugă jucător</button>
          </form>
  
          <ul>
            <li v-for="player in team.players" :key="player.id">
              {{ player.name }}
              <button @click="editPlayer(player)">Edit</button>
              <button @click="deletePlayer(player)">Delete</button>
            </li>
          </ul>
        </li>
      </ul>
      
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        teams: [],
        editedTeam: { id: '', name: '' }, // Noua proprietate pentru a ține detaliile echipei editate
        editedPlayer: { id: '', name: '', team_id: '' }, // Noua proprietate pentru a ține detaliile jucătorului editat
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
        this.newTeamName = ''; // Resetează câmpul de intrare
        this.loadData(); // Actualizează lista de echipe și jucători
      } catch (error) {
        console.error('Eroare la adăugarea echipei:', error);
      }
    },
      async addPlayer(team) {
        try {
          await axios.post('http://localhost:3000/players', { name: this.newPlayerName, team_id: team.id });
          this.newPlayerName = ''; // Resetează câmpul de intrare
          this.loadData(); // Actualizează lista de echipe și jucători
        } catch (error) {
          console.error('Eroare la adăugarea jucătorului:', error);
        }
      },
      async editTeam(team) {
        // Setează detaliile echipei editate
        this.editedTeam = { id: team.id, name: team.name };
      },
      async saveEditedTeam() {
        // Implementează funcționalitatea de editare pentru echipă (PUT sau PATCH către API)
        try {
          const response = await axios.put(`http://localhost:3000/teams/${this.editedTeam.id}`, { name: this.editedTeam.name });
          // După actualizare, încarcă din nou echipele și jucătorii pentru a reflecta schimbările
          this.loadData();

          // Resetează detaliile echipei editate
          this.editedTeam = { id: '', name: '' };
          console.log('Echipa actualizată cu succes:', response.data);
        } catch (error) {
          console.error('Eroare la actualizarea echipei:', error.message);
        }
      },
      async deleteTeam(team) {
        // Implementează funcționalitatea de ștergere pentru echipă (DELETE către API)
        try {
          const response = await axios.delete(`http://localhost:3000/teams/${team.id}`);
          console.log('Echipa ștearsă cu succes:', response.data);
          this.loadData(); // Reîncarcă datele după ștergere
        } catch (error) {
          console.error('Eroare la ștergerea echipei:', error.message);
        }
      },
      async editPlayer(player) {
        // Setează detaliile jucătorului editat
        this.editedPlayer = { id: player.id, name: player.name, team_id: player.team_id };
      },
      async saveEditedPlayer() {
        // Implementează funcționalitatea de editare pentru jucător (PUT sau PATCH către API)
        try {
          const response = await axios.put(`http://localhost:3000/players/${this.editedPlayer.id}`, {
          name: this.editedPlayer.name,
          team_id: this.editedPlayer.team_id,
        });
           // După actualizare, încarcă din nou echipele și jucătorii pentru a reflecta schimbările
          this.loadData();

          // Resetează detaliile jucătorului editat
          this.editedPlayer = { id: '', name: '', team_id: '' };
          console.log('Jucător actualizat cu succes:', response.data);
        } catch (error) {
          console.error('Eroare la actualizarea jucătorului:', error.message);
        }
      },
      async deletePlayer(player) {
        // Implementează funcționalitatea de ștergere pentru jucător (DELETE către API)
        try {
          const response = await axios.delete(`http://localhost:3000/players/${player.id}`);
          console.log('Jucător șters cu succes:', response.data);
          this.loadData(); // Reîncarcă datele după ștergere
        } catch (error) {
          console.error('Eroare la ștergerea jucătorului:', error.message);
        }
      },
    },
  };
  </script>
  
  