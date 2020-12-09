export const state = () => ({
    loader: false,
    notification: {
      stat: "",
      isActive: false,
      text: ""
    }
  });
  
  export const mutations = {
    activateLoader(state, status) {
      state.loader = status
    },
    Notification_status(state, status) {
      state.notification.stat = status
    },
    Notification_isActive(state, status) {
      state.notification.isActive = status
    },
    Notification_text(state, status) {
      state.notification.text = status
    },
  };
  
  export const getters = {
    loaderActive(state) {
      return state.loader
    },
    Notification_statusGet(state) {
      return state.notification.stat
    },
    Notification_isActiveGet(state) {
      return state.notification.isActive
    },
    Notification_textGet(state) {
      return state.notification.text
    }
  };