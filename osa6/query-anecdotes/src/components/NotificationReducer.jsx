const NotificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_MESSAGE":
      return { message: action.message, visible: true };
    case "HIDE_MESSAGE":
      return { message: "", visible: false };
    default:
      return state;
  }
};

export default NotificationReducer;
