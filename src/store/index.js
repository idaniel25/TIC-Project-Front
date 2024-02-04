import { createStore } from "vuex";
import axios from "axios";
import { auth } from "../../firebaseConfig";
import getAxiosConfig from "../services/firebaseService";

const store = createStore({
  state: {
    user: null,
    teams: [],
    players: [],
    editedPlayer: { id: "", name: "", team_id: "" },
    editedTeam: { id: "", name: "" },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TEAMS(state, teams) {
      state.teams = teams.map((team) => {
        const teamCopy = { ...team };
        teamCopy.players = state.players.filter(
          (player) => player.team_id === team.id
        );
        return teamCopy;
      });
    },
    ADD_TEAM(state, team) {
      state.teams.push(team);
    },
    SET_PLAYERS(state, players) {
      state.players = players.slice();
    },
    ADD_PLAYER(state, player) {
      state.players.push(player);
    },
    SET_EDITED_PLAYER(state, player) {
      state.editedPlayer = player;
    },
    DELETE_PLAYER(state, playerId) {
      state.players = state.players.filter((player) => player.id !== playerId);
    },
    SET_EDITED_TEAM(state, team) {
      state.editedTeam = team;
    },
    DELETE_TEAM(state, teamId) {
      state.teams = state.teams.filter((team) => team.id !== teamId);
      state.players.forEach((player) => {
        if (player.team_id === teamId) {
          player.team_id = "";
        }
      });
    },
    DELETE_PLAYER_FROM_TEAM(state, playerId) {
      state.players.forEach((player) => {
        if (player.id === playerId) {
          player.team_id = "";
        }
      });
    },
  },
  actions: {
    async fetchUser(context) {
      try {
        const user = auth.currentUser;
        context.commit("SET_USER", user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    async createTeam(context, { name, user_id }) {
      try {
        const config = await getAxiosConfig();
        const response = await axios.post(
          "http://localhost:3000/teams",
          {
            name,
            user_id,
          },
          config
        );

        const createdTeam = response.data;
        context.commit("ADD_TEAM", createdTeam);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.error("The team with the same name already exists:", error);
          throw error;
        } else if (error.response && error.response.status === 400) {
          console.error("Team name cannot be empty:", error);
          throw error;
        } else {
          console.error("Error adding the team:", error);
        }
      }
    },
    async fetchTeams(context, { userId }) {
      try {
        const response = await axios.get(`http://localhost:3000/teams`, {
          params: { user_id: userId },
        });

        const teams = response.data;
        context.commit("SET_TEAMS", teams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    },
    async fetchPlayers(context, { userId }) {
      try {
        const response = await axios.get(`http://localhost:3000/players`, {
          params: { user_id: userId },
        });
        const players = response.data;
        context.commit("SET_PLAYERS", players);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    },
    async createPlayer(context, { name, user_id }) {
      try {
        const config = await getAxiosConfig();
        const response = await axios.post(
          "http://localhost:3000/players",
          {
            name,
            user_id,
          },
          config
        );
        const createdPlayer = response.data;
        context.commit("ADD_PLAYER", createdPlayer);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error("Player name cannot be empty:", error);
          throw error;
        } else {
          console.error("Error adding the player:", error);
        }
      }
    },
    async setEditedPlayer({ commit, state }, player) {
      try {
        commit("SET_EDITED_PLAYER", player);
        const config = await getAxiosConfig();
        await axios.put(
          `http://localhost:3000/players/${player.id}`,
          player,
          config
        );

        const updatedPlayers = state.players.map((p) =>
          p.id === player.id ? state.editedPlayer : p
        );

        commit("SET_PLAYERS", updatedPlayers);
        commit("SET_TEAMS", state.teams);
      } catch (error) {
        console.error("Error updating the player:", error.message);
      }
    },
    async deletePlayer({ commit }, player) {
      try {
        const config = await getAxiosConfig();
        await axios.delete(
          `http://localhost:3000/players/${player.id}`,
          config
        );
        commit("DELETE_PLAYER", player.id);
        commit("SET_TEAMS", this.state.teams);
      } catch (error) {
        console.error("Error deleting the player:", error.message);
      }
    },
    async setEditedTeam({ commit, state }, team) {
      try {
        commit("SET_EDITED_TEAM", team);
        const config = await getAxiosConfig();
        await axios.put(`http://localhost:3000/teams/${team.id}`, team, config);
        const updatedTeams = state.teams.map((t) =>
          t.id === team.id ? state.editedTeam : t
        );
        commit("SET_TEAMS", updatedTeams);
      } catch (error) {
        console.error("Error updating the team:", error.message);
      }
    },
    async deleteTeam({ commit }, team) {
      try {
        const config = await getAxiosConfig();
        await axios.delete(`http://localhost:3000/teams/${team.id}`, config);
        commit("DELETE_TEAM", team.id);
        commit("SET_PLAYERS", this.state.players);
        commit("SET_TEAMS", this.state.teams);
      } catch (error) {
        console.error("Error deleting the team:", error.message);
      }
    },
    async deletePlayerFromTeam({ commit }, player) {
      try {
        const config = await getAxiosConfig();
        await axios.delete(
          `http://localhost:3000/activePlayers/${player.id}`,
          config
        );
        commit("DELETE_PLAYER_FROM_TEAM", player.id);
        commit("SET_TEAMS", this.state.teams);
      } catch (error) {
        console.error("Error deleting the player from team", error.message);
      }
    },
  },
});
export default store;
