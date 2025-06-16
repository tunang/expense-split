import { ApiConstant } from "../../constants/api.constant";
import { api } from "../../services/api.service";
import {
  initializeAuth,
  loginFailure,
  loginSuccess,
  logoutRequest,
  logoutSuccess,
  registerFailure,
  registerSuccess,
  setUser,
  } from "../slices/authSlice";
import { loginRequest, registerRequest } from "../slices/authSlice";
import { call, put, takeLatest } from "redux-saga/effects";
import { getGroupsRequest } from "../slices/groupSlice";

//Authentication initialization saga
function* initializeAuthSaga() {
  try {
    const user = yield call(api.get, ApiConstant.auth.me);
    yield put(setUser(user));

    yield put(getGroupsRequest());

    // Fetch cart items after successful auth initialization
  } catch (error) {
    // If token is invalid, remove it
    localStorage.removeItem("token");
    yield put(loginFailure("Token không hợp lệ"));
  }
}

function* loginSaga(action) {
  try {
    const { username, password } = action.payload;
    const response = yield call(api.post, ApiConstant.auth.login, {
      username,
      password,
    });
    yield put(loginSuccess(response));
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed";
    yield put(loginFailure(errorMessage));
  }
}

function* registerSaga(action) {
  try {
    const { fullName, username, email, password, confirmPassword } = action.payload;
    console.log(action.payload);
    const response = yield call(api.post, ApiConstant.auth.register, {
      fullName,
      username,
      email,
      password,
    });
    console.log(response);
    yield put(registerSuccess(response));
  } catch (error) {
    console.error("Register error:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Register failed";
    yield put(registerFailure(errorMessage));
  }
}

function* logoutSaga() {
  try {
    yield call(api.post, ApiConstant.auth.logout);
    yield put(logoutSuccess());
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export function* authSaga() {
  yield takeLatest(initializeAuth.type, initializeAuthSaga);
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga); 
  yield takeLatest(logoutRequest.type, logoutSaga);
}
