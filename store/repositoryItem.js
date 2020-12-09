export const state = () => ({
    repository: {}
  });
  
  export const mutations = {
    repositoryAccess(state, status) {
      state.repository = status
    }
  };
  
  export const getters = {
    repositoryGetter(state) {
      return state.repository
    }
  };