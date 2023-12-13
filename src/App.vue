<template>
  <div id="app">
    <Auth />
    <Teams />
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
  }
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
