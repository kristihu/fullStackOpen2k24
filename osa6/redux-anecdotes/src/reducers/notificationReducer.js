import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  visible: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(state, action) {
      state.message = action.payload;
      state.visible = true;
    },
    hideNotification(state) {
      state.visible = false;
    },
  },
});

export const { setNotification, hideNotification } = notificationSlice.actions;

export const setNotificationWithTimeout = (message, timeInSeconds) => {
  return (dispatch) => {
    dispatch(setNotification(message));

    setTimeout(() => {
      dispatch(hideNotification());
    }, timeInSeconds * 1000);
  };
};

export default notificationSlice.reducer;
