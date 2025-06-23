import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invitations: [],
  isLoading: false,
  error: null,
};

const invitationSlice = createSlice({
  name: "invitation",
  initialState,
  reducers: {
    getCreatedInvitationsRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    getCreatedInvitationsSuccess: (state, action) => {
      state.isLoading = false;
      state.invitations = action.payload;
      state.error = null;
    },
    getCreatedInvitationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    inviteUserRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    inviteUserSuccess: (state, action) => {
      state.invitations = [...state.invitations, action.payload];
      state.isLoading = false;
      state.error = null;
    },
    inviteUserFailure: (state, action) => {
      state.error = action.payload.response.data.message;
      state.isLoading = false;
    },
  },
});

export const {
  getCreatedInvitationsRequest,
  getCreatedInvitationsSuccess,
  getCreatedInvitationsFailure,
  inviteUserRequest,
  inviteUserSuccess,
  inviteUserFailure,
} = invitationSlice.actions;
export default invitationSlice.reducer;
