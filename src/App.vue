<template>
  <v-app>
    <v-container>
      <!-- Alte conținuturi ale tale -->
      <Auth @user-signed-in="loadData" @user-signed-out="clearData"/>
      <v-row>
        <v-col>
          <TeamForm @team-added="loadData" />
        </v-col>
        <v-col>
          <PlayerForm @player-added="loadData" />
        </v-col>
      </v-row>
      <v-row class="w-75 mx-auto">
        <v-col>
          <PlayersTable :players="players" :teams="teams" @player-updated="loadData" @player-deleted="loadData"/>
        </v-col>
      </v-row>
      <TeamsList :teams="teams" @load-data="loadData"/>
    </v-container>
  </v-app>
</template>

<script>
import Auth from './components/Auth.vue';
import TeamForm from './components/TeamForm.vue'
import PlayerForm from './components/PlayerForm.vue'
import PlayersTable from './components/PlayersTable.vue'
import TeamsList from './components/TeamsList.vue'
import { auth } from "../firebaseConfig";
import axios from "axios";

export default {
  name: 'App',
  components: {
    Auth,
    TeamForm,
    PlayerForm,
    PlayersTable,
    TeamsList,
  },
  data() {
    return {
      teams: [],
      players: [],
    }
  },
  methods: {
    async loadData() {
      try {
        console.log(auth.currentUser.uid);
        const teamsResponse = await axios.get(`http://localhost:3000/teams`, {
          params: { user_id: auth.currentUser.uid },
        });
        const playersResponse = await axios.get(
          `http://localhost:3000/players`,
          { params: { user_id: auth.currentUser.uid } }
        );

        const teams = teamsResponse.data;
        const players = playersResponse.data;

        this.players.splice(0, this.players.length, ...players);

        this.teams = teams.map((team) => {
          team.players = players.filter((player) => player.team_id === team.id);
          return team;
        });
      } catch (error) {
        console.error("Eroare la încărcarea datelor:", error.message);
      }
    },
    clearData() {
      this.teams = [];
      this.players = [];
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
