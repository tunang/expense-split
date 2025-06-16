import { takeLatest } from "redux-saga/effects";
import {
  getGroupByIdRequest,
  getGroupByIdSuccess,
  getGroupByIdFailure,
} from "../slices/detailGroupSlice";
import { call, put } from "redux-saga/effects";
import { ApiConstant } from "../../constants/api.constant";
import { api } from "../../services/api.service";

function* getGroupByIdSaga(action) {
  try {
    const response = yield call(
      api.get,
      ApiConstant.group.getGroupById.replace(":id",  action.payload)
    );
    yield put(getGroupByIdSuccess(response.group));
  } catch (error) {
    console.error("Get group by id error:", error);
    yield put(getGroupByIdFailure(error.message));
  }
}

export function* detailGroupSaga() {
  yield takeLatest(getGroupByIdRequest.type, getGroupByIdSaga);
}
