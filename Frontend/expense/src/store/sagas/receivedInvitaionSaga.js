import { call, put, takeLatest } from "redux-saga/effects";
import {
  handleInvitationRequest,
  handleInvitationRequestSuccess,
  handleInvitationRequestFailure,
  getReceivedInvitationsRequest,
  getReceivedInvitationsSuccess,
  getReceivedInvitationsFailure,
} from "../slices/receivedInvitationSlice";
import { addGroupFromInvitation } from "../slices/groupSlice";
import { ApiConstant } from "../../constants/api.constant";
import { api } from "../../services/api.service";

function* getReceivedInvitationsSaga(action) {
  try {
    const response = yield call(
      api.get,
      ApiConstant.invitation.getReceivedInvitations
    );
    yield put(getReceivedInvitationsSuccess(response.invitations));
  } catch (error) {
    yield put(getReceivedInvitationsFailure(error));
  }
}

function* handleInvitationRequestSaga(action) {
  try {
    const response = yield call(
      api.patch,
      ApiConstant.invitation.handleInvitation.replace(":groupId", action.payload.groupId).replace(":requestId", action.payload.requestId),
      { action: action.payload.action }
    );
    
    // Remove invitation từ state
    yield put(handleInvitationRequestSuccess(response.updatedInvitation));
    
    // Nếu action là ACCEPT, thêm group vào group state
    if (action.payload.action === "ACCEPT" && response.updatedInvitation?.group) {
      yield put(addGroupFromInvitation(response.updatedInvitation.group));
    }
  } catch (error) {
    yield put(handleInvitationRequestFailure(error));
  }
}

export function* receivedInvitationSaga() {
  yield takeLatest(handleInvitationRequest.type, handleInvitationRequestSaga);
  yield takeLatest(getReceivedInvitationsRequest.type, getReceivedInvitationsSaga);
}