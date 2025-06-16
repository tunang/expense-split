import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  group: null,

  isLoading: false,
  error: null,
};

const detailGroupSlice = createSlice({
  name: "detailGroup",
  initialState,
  reducers: {
    getGroupByIdRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    getGroupByIdSuccess: (state, action) => {
      state.isLoading = false;
      state.group = action.payload;
    },
    getGroupByIdFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { getGroupByIdRequest, getGroupByIdSuccess, getGroupByIdFailure } =
  detailGroupSlice.actions;

export default detailGroupSlice.reducer;
