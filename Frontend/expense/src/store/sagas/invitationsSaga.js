import { call, put, takeLatest } from "redux-saga/effects";
import {
  getCreatedInvitationsRequest,
  getCreatedInvitationsSuccess,
  getCreatedInvitationsFailure,
  inviteUserRequest,
  inviteUserSuccess,
  inviteUserFailure,
} from "../slices/invitationSlice";
import {
  handleInvitationRequest,
  handleInvitationRequestSuccess,
  handleInvitationRequestFailure,
} from "../slices/receivedInvitationSlice";
import { ApiConstant } from "../../constants/api.constant";
import { api } from "../../services/api.service";



function* getCreatedInvitationsSaga(action) {
  try {
    //Only admin can get all invitations
    const response = yield call(
      api.get,
      ApiConstant.invitation.getSentInvitations.replace(
        ":groupId",
        action.payload
      )
    );
    yield put(getCreatedInvitationsSuccess(response.invitations));
  } catch (error) {
    yield put(getCreatedInvitationsFailure(error));
  }
}

function* inviteUserSaga(action) {
  try {
    const response = yield call(
      api.post,
      ApiConstant.invitation.createInvitation
        .replace(":groupId", action.payload.groupId)
        .replace(":userId", action.payload.userId)
    );
    yield put(inviteUserSuccess(response.invitations));
  } catch (error) {
    console.log(error);
    yield put(inviteUserFailure(error));
  }
}

function* handleInvitationRequestSaga(action) {
  try {
    const response = yield call(
      api.patch,
      ApiConstant.invitation.handleInvitation.replace(":groupId", action.payload.groupId).replace(":requestId", action.payload.requestId),
      { action: action.payload.action }
    );
    yield put(handleInvitationRequestSuccess(response.invitation));
  } catch (error) {
    yield put(handleInvitationRequestFailure(error));
  }
}

export function* invitationsSaga() {
  yield takeLatest(getCreatedInvitationsRequest.type, getCreatedInvitationsSaga);
  yield takeLatest(inviteUserRequest.type, inviteUserSaga);
  yield takeLatest(handleInvitationRequest.type, handleInvitationRequestSaga);
}
