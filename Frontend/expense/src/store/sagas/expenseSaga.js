import { call, put, takeLatest } from "redux-saga/effects";
import { getExpenseRequest, getExpenseSuccess, getExpenseFailure, createExpenseRequest, createExpenseSuccess, createExpenseFailure, deleteExpenseRequest, deleteExpenseSuccess, deleteExpenseFailure } from "../slices/expenseSlice";
import { ApiConstant } from "../../constants/api.constant";
import { api } from "../../services/api.service";

function* getExpenseSaga(action) {
    try {
        const response = yield call(api.get, ApiConstant.expense.getExpense.replace(':groupId', action.payload));
        yield put(getExpenseSuccess(response.expenses));
    } catch (error) {
        yield put(getExpenseFailure(error));
    }
}


function* createExpenseSaga(action) {
    try {
        console.log("createExpenseSaga", action.payload);
        const response = yield call(api.post, ApiConstant.expense.createExpense, action.payload);
        yield put(createExpenseSuccess(response.expense));
    } catch (error) {
        yield put(createExpenseFailure(error));
    }
}

function* deleteExpenseSaga(action) {
    try {
        const response = yield call(api.delete, ApiConstant.expense.deleteExpense.replace(':id', action.payload));
        console.log(response);
        yield put(deleteExpenseSuccess(response));
    } catch (error) {
        yield put(deleteExpenseFailure(error));
    }
}

export function* expenseSaga() {
    yield takeLatest(getExpenseRequest.type, getExpenseSaga);
    yield takeLatest(createExpenseRequest.type, createExpenseSaga);
    yield takeLatest(deleteExpenseRequest.type, deleteExpenseSaga);
}

