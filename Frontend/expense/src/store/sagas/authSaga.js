import { ApiConstant } from "../../constants/api.constant";
import { api } from "../../services/api.service";
import {
  initializeAuth,
  setUser,
  loginFailure,
  loginSuccess,
  logoutRequest,
  logoutSuccess,
  registerFailure,
  registerSuccess,
  logoutFailure,
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

    console.log("Auth initialization successful");
  } catch (error) {
    console.log("Auth initialization failed:", error);
    // If token/cookie is invalid, dispatch loginFailure to clear auth state
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
    
    // Navigate to login page
    window.location.href = '/login';
  } catch (error) {
    console.error("Logout error:", error);
    yield put(logoutFailure(error));
    
    // Still navigate to login page
    window.location.href = '/login';
  }
}

export function* authSaga() {
  yield takeLatest(initializeAuth.type, initializeAuthSaga);
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga); 
  yield takeLatest(logoutRequest.type, logoutSaga);
}
