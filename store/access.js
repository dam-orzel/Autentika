export const state = () => ({
    accessToken: null
  });
  
  export const mutations = {
    sendAccessToken(state, status) {
      state.accessToken = status
    }
  };
  
  export const getters = {
    getterAccessToken(state) {
      return state.accessToken
    }
  };