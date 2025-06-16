import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state, action) => {
      state.isLoading = true;
    },

    setUser: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },

    registerRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },

    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.error = null;
    },

    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    loginRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },

    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      state.isAuthenticated = false;
    },

    logoutRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    logoutSuccess: (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    logoutFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
export const {
  initializeAuth,
  setUser,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
} = authSlice.actions;

export default authSlice.reducer;
