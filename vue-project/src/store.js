import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null, // Store logged-in user data
    token: null, // Store JWT token
  },
  mutations: {
    setUser (state, userData) {
      state.user = userData;
      state.token = userData.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
  actions: {
    login({ commit }, userData) {
      commit('setUser', userData);
    },
    logout({ commit }) {
      commit('logout');
    },
  },
  getters: {
    getUser (state) {
      console.log("get user is called:");
      console.log("state.user.idRoles:");
      console.log(state.user.idRoles);
      return state.user ? state.user.role : null;
    },
    getToken(state) {
      return state.token;
    },
    isAdmin(state) {
      //console.log("checking if isAdmin");
      // return state.user[Object.keys(state.user)[1]].isAdmin; // Accessing the isAdmin flag
      return state.user && state.user[Object.keys(state.user)[1]].role === 1;
    },
    getUserRole(state){
      // return state.user[Object.keys(state.user)[1]].role;
      return state.user ? state.user.role : null;
    },
    isLoggedIn(state) {
      return state.user !== null; // Check if user is logged in
    },
  },
});

export default store;
