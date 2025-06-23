import { call, put, takeLatest } from 'redux-saga/effects';
import { getJoinRequest, getJoinRequestSuccess, getJoinRequestFailure, handleJoinRequest, handleJoinRequestSuccess, handleJoinRequestFailure, createJoinRequest, createJoinRequestSuccess, createJoinRequestFailure } from '../slices/joinRequestSlice';
import { addNewMember } from '../slices/memberGroupSlice';
import { ApiConstant } from '../../constants/api.constant';
import { api } from '../../services/api.service';



function* getJoinRequestSaga(action) {
    const  groupId  = action.payload;
    try {
        const response = yield call(api.get, ApiConstant.groupJoinRequest.getJoinRequest.replace(':groupId', groupId));
        yield put(getJoinRequestSuccess(response.joinRequest));
    } catch (error) {
        yield put(getJoinRequestFailure(error));
    }
}

function* handleJoinRequestSaga(action) {
    console.log(action.payload);
    const { requestId, actionType, groupId } = action.payload;
    try {
        const response = yield call(api.patch, ApiConstant.groupJoinRequest.handleJoinRequest.replace(':groupId', groupId).replace(':requestId', requestId), { action : actionType });
        yield put(handleJoinRequestSuccess(response.updatedRequest));
        
        // Nếu action là ACCEPT, thêm user vào member list
        if (actionType === 'ACCEPT') {
            const newMember = {
                userId: response.updatedRequest.user.id,
                user: {
                    id: response.updatedRequest.user.id,
                    fullName: response.updatedRequest.user.fullName,
                    profilePicture: response.updatedRequest.user.profilePicture,
                    email: response.updatedRequest.user.email,
                    role: "MEMBER",
                }
            };
            yield put(addNewMember(newMember));
        }
    } catch (error) {
        console.log(error);
        yield put(handleJoinRequestFailure(error));
    }
}

function* createJoinRequestSaga(action) {   
    const { groupId, password } = action.payload;
    try {
        const response = yield call(api.post, ApiConstant.groupJoinRequest.createJoinRequest.replace(':groupId', groupId), { password });
        yield put(createJoinRequestSuccess(response.joinRequest));
    } catch (error) {
        console.log(error);
        yield put(createJoinRequestFailure(error));
    }
}

function* joinRequestSaga() {
    yield takeLatest(getJoinRequest.type, getJoinRequestSaga);
    yield takeLatest(handleJoinRequest.type, handleJoinRequestSaga);
    yield takeLatest(createJoinRequest.type, createJoinRequestSaga);
}

export default joinRequestSaga;