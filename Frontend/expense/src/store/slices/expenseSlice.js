import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenses: [],
  isLoading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    getExpenseRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getExpenseSuccess: (state, action) => {
      state.expenses = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    getExpenseFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    createExpenseRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    createExpenseSuccess: (state, action) => {
      state.expenses.push(action.payload);
      state.isLoading = false;
      state.error = null;
    },
    createExpenseFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    deleteExpenseRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteExpenseSuccess: (state, action) => {
      console.log(action.payload);
      state.expenses = state.expenses.filter((expense) => expense.id !== action.payload.deletedExpense.id);
      state.isLoading = false;
      state.error = null;
    },
    deleteExpenseFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { getExpenseRequest, getExpenseSuccess, getExpenseFailure, createExpenseRequest, createExpenseSuccess, createExpenseFailure, deleteExpenseRequest, deleteExpenseSuccess, deleteExpenseFailure } =
  expenseSlice.actions;
export default expenseSlice.reducer;
