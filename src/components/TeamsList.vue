<template>
    <v-h2>Echipe și Jucători</v-h2>
    <v-row>
        <v-col v-for="team in teams" :key="team.id">
            <TeamCard :team="team" @team-updated="loadData" @team-deleted="loadData" @player-deleted-from-team="loadData"/>
        </v-col>
    </v-row>
</template>

<script>
import TeamCard from '../components/TeamCard.vue'

export default {
  props: {
    teams: Array, 
  },
  components: {
    TeamCard,
  },
  methods: {
    loadData() {
        this.$emit("load-data")
    }
  },
};
</script>