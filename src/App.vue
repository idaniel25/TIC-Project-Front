<template>
  <v-app>
    <v-btn v-if="isAuthenticated" @click="signOut">Sign Out</v-btn>

    <v-container>
      <!-- Alte conținuturi ale tale -->
      <v-main v-if="!isAuthenticated">
        <Auth
          @user-registered="user - registered"
          @user-logged="user - logged"
        />
      </v-main>
      <v-main v-if="isAuthenticated">
        <v-row class="add-team">
          <v-col>
            <TeamForm />
          </v-col>
          <v-col>
            <PlayerForm />
          </v-col>
        </v-row>
        <v-row class="w-75 mx-auto">
          <v-col>
            <PlayersTable
              :players="this.$store.state.players"
              :teams="this.$store.state.teams"
            />
          </v-col>
        </v-row>
        <TeamsList :teams="this.$store.state.teams" />
      </v-main>
    </v-container>
  </v-app>
</template>    

<script>
import Auth from "./components/Auth.vue";
import TeamForm from "./components/TeamForm.vue";
import PlayerForm from "./components/PlayerForm.vue";
import PlayersTable from "./components/PlayersTable.vue";
import TeamsList from "./components/TeamsList.vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
// import axios from "axios";
import "@/assets/style.css";

export default {
  name: "App",
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
      isAuthenticated: false,
      user: null,
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user;
      this.user = user;

      if (user) {
      this.$store.dispatch("fetchTeams", { userId: user.uid });
      this.$store.dispatch("fetchPlayers", { userId: user.uid });
    }       
    }); 


  },
  methods: {
    signOut() {
      signOut(auth);
      this.isAuthenticated = false;
      this.user = null;
      this.showLoginForm = true;
      this.showProjectForm = false;
    },
    onUserAuthenticated(user) {
      // Update state and hide forms when authenticated
      this.isAuthenticated = true;
      this.user = user; // Adaugă această linie pentru a afișa formularul de proiect când utilizatorul este autentificat
    }, 
  },
};
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
