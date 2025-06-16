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

    createGroup: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
  },
});

export const {
  getGroupsRequest,
  getGroupsSuccess,
  getGroupsFailure,
  createGroup,
  getGroupByIdRequest,
  getGroupByIdSuccess,
  getGroupByIdFailure,
} = groupSlice.actions;
export default groupSlice.reducer;
