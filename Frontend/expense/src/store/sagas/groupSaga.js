import { call, put, takeLatest } from "redux-saga/effects";
import { getGroupsRequest, getGroupsSuccess, createGroupRequest, createGroupSuccess, createGroupFailure } from "../slices/groupSlice";  
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

function* createGroupSaga(action) {
  try {
    const response = yield call(api.post, ApiConstant.group.createGroup, action.payload);
    yield put(createGroupSuccess(response.group));
  } catch (error) {
    yield put(createGroupFailure(error));
  }
}

export function* groupSaga() {
  yield takeLatest(getGroupsRequest.type, getGroupsSaga); 
  yield takeLatest(createGroupRequest.type, createGroupSaga);
}
