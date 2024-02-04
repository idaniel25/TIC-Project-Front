<template>
  <v-app class="bg-grey-lighten-1">
    <v-app-bar class="bg-green" v-if="isAuthenticated">
      <v-toolbar-title class="text-left ml-16">My App</v-toolbar-title>
      <v-btn icon @click="signOut">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container>
      <v-main v-if="!isAuthenticated">
        <Auth />
      </v-main>
      <v-main v-if="isAuthenticated">
        <v-row class="mt-3">
          <v-col cols="12" sm="6" md="6" lg="6">
            <TeamForm class="w-75 mx-auto" />
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="6">
            <PlayerForm class="w-75 mx-auto" />
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
        this.$store.dispatch("fetchPlayers", { userId: user.uid });
        this.$store.dispatch("fetchTeams", { userId: user.uid });
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
      this.isAuthenticated = true;
      this.user = user;
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
}
</style>
