import { call, put, takeLatest } from "redux-saga/effects";
import { getGroupsRequest, getGroupsSuccess } from "../slices/groupSlice";
import { ApiConstant } from "../../constants/api.constant";
import { api } from "../../services/api.service";

function* getGroupsSaga() {
  try {
    const response = yield call(api.get, ApiConstant.group.getGroups);
    console.log(response.groups);
    yield put(getGroupsSuccess(response.groups));
  } catch (error) {
    console.error("Get groups error:", error);
  }
}

export function* groupSaga() {
  yield takeLatest(getGroupsRequest.type, getGroupsSaga);
}
