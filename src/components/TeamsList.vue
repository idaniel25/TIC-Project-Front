<template>
  <div class="bg-grey-lighten-2 rounded-xl my-10 pb-10">
    <h2 class="py-5">Teams List</h2>
    <template v-for="(page, index) in paginatedTeams" :key="index">
      <v-row v-if="page.length > 0" >
        <v-col v-for="team in page" :key="team.id" cols="12" sm="6" md="6" lg="6" xl="4" xxl="4">
          <TeamCard :team="team"/>
        </v-col>
      </v-row>
    </template>
    <v-pagination v-model="currentPage" :length="totalPages" @input="handleChangePage" class="mt-5"/>
  </div>
</template>

<script>
import TeamCard from "../components/TeamCard.vue";

export default {
  props: {
    teams: Array,
  },
  components: {
    TeamCard,
  },
  data() {
    return {
      currentPage: 1,
      teamsPerPage: 6,
      windowWidth: window.innerWidth,
    };
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    totalPages() {
      return Math.ceil(this.teams.length / this.teamsPerPage);
    },
    paginatedTeams() {
      const start = (this.currentPage - 1) * this.teamsPerPage;
      const end = start + this.teamsPerPage;
      const itemsPerRow = this.windowWidth < 1441 ? 2 : 3;
      return this.teams.slice(start, end).reduce((acc, team, index) => {
        const pageIndex = Math.floor(index / itemsPerRow);
        if (!acc[pageIndex]) {
          acc[pageIndex] = [];
        }
        acc[pageIndex].push(team);
        return acc;
      }, []);
    },
  },
  methods: {
    handleChangePage(page) {
      this.currentPage = page;
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
  },
};
</script>
