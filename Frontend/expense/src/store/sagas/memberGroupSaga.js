import { call, put, takeLatest } from "redux-saga/effects";
import { getMembersRequest, getMembersSuccess, getMembersFailure } from "../slices/memberGroupSlice";
import { ApiConstant } from "../../constants/api.constant";
import { api } from "../../services/api.service";

function* getMembersSaga(action) {  
    try {
        const response = yield call(api.get, ApiConstant.groupMember.getMembers.replace(':groupId', action.payload));
        yield put(getMembersSuccess(response.members));
    } catch (error) {
        yield put(getMembersFailure(error));
    }
}

export function* memberGroupSaga() {
    yield takeLatest(getMembersRequest.type, getMembersSaga);
  }
  
  