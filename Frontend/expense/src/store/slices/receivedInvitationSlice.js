import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invitations: [],
  isLoading: false,
  error: null,
};

const comingInvitationSlice = createSlice({
  name: "comingInvitation",
  initialState,
  reducers: {
    getReceivedInvitationsRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    getReceivedInvitationsSuccess: (state, action) => {
      state.isLoading = false;
      state.invitations = action.payload;
      state.error = null;
    },
    getReceivedInvitationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    handleInvitationRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    handleInvitationRequestSuccess: (state, action) => {
      state.invitations = state.invitations.filter(
        (invitation) => invitation.id !== action.payload.id
      );
      state.isLoading = false;
      state.error = null;
    },
    handleInvitationRequestFailure: (state, action) => {
      state.error = action.payload.response?.data?.message || "Có lỗi xảy ra";
      state.isLoading = false;
    },
  },
});

export const {
  getReceivedInvitationsFailure,
  getReceivedInvitationsRequest,
  getReceivedInvitationsSuccess,
  handleInvitationRequest,
  handleInvitationRequestSuccess,
  handleInvitationRequestFailure,
} = comingInvitationSlice.actions;

export default comingInvitationSlice.reducer;
