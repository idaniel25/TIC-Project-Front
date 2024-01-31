import { createStore } from "vuex";
import axios from "axios";
import { auth } from "../../firebaseConfig";

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
        teamCopy.players = state.players.filter((player) => player.team_id === team.id);
        return teamCopy;
      });
      // state.teams=teams;
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
      // Elimină jucătorul din starea de magazin
      state.players = state.players.filter(player => player.id !== playerId);
    },
    SET_EDITED_TEAM(state, team) {
      state.editedTeam = team;
    },
    DELETE_TEAM(state, teamId) {
        // Elimină echipa din starea de magazin
        state.teams = state.teams.filter(team => team.id !== teamId);
      
        // Parcurge toți jucătorii și actualizează team_id pentru cei care aparțineau echipei șterse
        state.players.forEach(player => {
          if (player.team_id === teamId) {
            player.team_id = ""; // Setează team_id la string gol
          }
        });
      }
      ,
    DELETE_PLAYER_FROM_TEAM(state, playerId) {
      // Parcurge lista de jucători
      state.players.forEach((player) => {
        // Verifică dacă ID-ul jucătorului corespunde cu ID-ul dat
        if (player.id === playerId) {
          // Setează team_id la un șir gol pentru jucătorul respectiv
          player.team_id = '';
        }
      });
    }
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
        const response = await axios.post("http://localhost:3000/teams", {
          name,
          user_id,
        });

        const createdTeam = response.data;

        console.log(createdTeam.id);

        context.commit("ADD_TEAM", createdTeam);
      } catch (error) {
        console.error("Eroare la adăugarea echipei:", error);
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
        const response = await axios.post("http://localhost:3000/players", {
          name,
          user_id,
        });
        const createdPlayer = response.data;

        console.log(createdPlayer.id);

        context.commit("ADD_PLAYER", createdPlayer);
      } catch (error) {
        console.error("Eroare la adăugarea jucatorului:", error);
      }
    },
    async setEditedPlayer({ commit, state }, player) {
      try {
        commit("SET_EDITED_PLAYER", player);
        console.log("jucator trimis: ",player);
        console.log(state.teams)
        // Apelul Axios pentru actualizarea jucătorului
        await axios.put(
          `http://localhost:3000/players/${player.id}`,
          player
        );

        // Actualizăm doar jucătorul specific în array-ul de jucători
        const updatedPlayers = state.players.map((p) =>
          p.id === player.id ? state.editedPlayer : p
        );

        commit("SET_PLAYERS", updatedPlayers);
        commit("SET_TEAMS", state.teams);

        console.log("Jucător actualizat cu succes:", state.editedPlayer);
      } catch (error) {
        console.error("Eroare la setarea jucătorului editat:", error.message);
      }
    },
    async deletePlayer({ commit }, player) {
      try {
        // Trimite solicitarea de ștergere către server
        await axios.delete(`http://localhost:3000/players/${player.id}`);
        
        // Apelăm mutația pentru a elimina jucătorul din starea de magazin
        commit("DELETE_PLAYER", player.id);
        commit("SET_TEAMS", this.state.teams);
        console.log("Jucător șters cu succes:", player);
      } catch (error) {
        console.error("Eroare la ștergerea jucătorului:", error.message);
      }
    },
    async setEditedTeam({ commit, state }, team) {
      try {
        commit("SET_EDITED_TEAM", team);
        console.log("echipa trimis: ",team);
        // Apelul Axios pentru actualizarea jucătorului
        await axios.put(
          `http://localhost:3000/teams/${team.id}`,
          team
        );

        // Actualizăm doar jucătorul specific în array-ul de jucători
        const updatedTeams = state.teams.map((t) =>
          t.id === team.id ? state.editedTeam : t
        );

        commit("SET_TEAMS", updatedTeams);


        console.log("Jucător actualizat cu succes:", state.editedTeam);
      } catch (error) {
        console.error("Eroare la setarea jucătorului editat:", error.message);
      }
    },
    async deleteTeam({ commit }, team) {
      try {
        // Trimite solicitarea de ștergere către server
        await axios.delete(`http://localhost:3000/teams/${team.id}`);
        
        // Apelăm mutația pentru a elimina echipa din starea de magazin
        commit("DELETE_TEAM", team.id);
        commit("SET_PLAYERS", this.state.players);
        commit("SET_TEAMS", this.state.teams);
  
        console.log("Echipa ștearsa cu succes:", team);
      } catch (error) {
        console.error("Eroare la ștergerea jucătorului:", error.message);
      }
    },
    async deletePlayerFromTeam({ commit }, player) {
      try {
        // Trimite solicitarea de ștergere a jucătorului din echipă la server
        await axios.delete(`http://localhost:3000/activePlayers/${player.id}`);
  
        // Apelăm mutația pentru a elimina jucătorul din echipa curentă în starea de magazin
        commit("DELETE_PLAYER_FROM_TEAM", player.id);
        commit("SET_TEAMS", this.state.teams);
        console.log("Jucător șters cu succes din echipă:", player);
      } catch (error) {
        console.error("Eroare la ștergerea jucătorului din echipă:", error.message);
      }
    },
  },
});
export default store;
