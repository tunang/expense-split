import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  joinRequest: [],
  isLoading: false,
  error: null,
};

const joinRequestSlice = createSlice({
  name: "joinRequest",
  initialState,
  reducers: {
    getJoinRequest: (state, action) => {
      state.isLoading = true;
    },
    getJoinRequestSuccess: (state, action) => {
      state.joinRequest = action.payload;
      state.isLoading = false;
    },
    getJoinRequestFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    createJoinRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    createJoinRequestSuccess: (state, action) => {
      state.isLoading = false;
      state.error = null;
    },
    createJoinRequestFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.response.data.message;
    },

    handleJoinRequest: (state, action) => {
      state.error = null;
      state.isLoading = true;
    },
    handleJoinRequestSuccess: (state, action) => {
      state.joinRequest = state.joinRequest.filter((request) => request.id !== action.payload.id);
      state.isLoading = false;
      state.error = null;
    },
    handleJoinRequestFailure: (state, action) => {
      state.error = action.payload.response.data.message;
      state.isLoading = false;
    },
  },
});

export const { getJoinRequest, getJoinRequestSuccess, getJoinRequestFailure, handleJoinRequest, handleJoinRequestSuccess, handleJoinRequestFailure, createJoinRequest, createJoinRequestSuccess, createJoinRequestFailure } =
  joinRequestSlice.actions;

export default joinRequestSlice.reducer;
