import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groups: [],
  isLoading: false,
  error: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    getGroupsRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    getGroupsSuccess: (state, action) => {
      console.log(action.payload);
      state.isLoading = false;
      state.groups = action.payload;
    },
    getGroupsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    createGroupRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    createGroupSuccess: (state, action) => {
      state.isLoading = false;
      state.groups.push(action.payload);
    },
    createGroupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    addGroupFromInvitation: (state, action) => {
      state.groups.push(action.payload);
    },
  },
});

export const {
  getGroupsRequest,
  getGroupsSuccess,
  getGroupsFailure,
  createGroupRequest,
  createGroupSuccess,
  createGroupFailure,
  addGroupFromInvitation,
} = groupSlice.actions;
export default groupSlice.reducer;
