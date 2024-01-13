<template>
  <div id="app">
    <Auth @user-signed-in="loadData" @user-signed-out="clearData"/>
    <Teams ref="teamsComponent"/>
  </div>
</template>

<script>
import Auth from './components/Auth.vue';
import Teams from './components/Teams.vue';

export default {
  name: 'App',
  components: {
    Auth,
    Teams
  },
  methods: {
    async loadData() {
      // Apelează metoda loadData a componente teams.vue
      await this.$refs.teamsComponent.loadData();
    },
    clearData() {
      // Resetează datele echipei și jucătorilor atunci când utilizatorul se deconectează
      this.$refs.teamsComponent.teams = [];
      this.$refs.teamsComponent.players = [];
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
