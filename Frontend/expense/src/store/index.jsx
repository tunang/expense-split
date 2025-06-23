import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

// Import reducers
import authReducer from './slices/authSlice';
import detailGroupReducer from './slices/detailGroupSlice';
import groupReducer from './slices/groupSlice';
import memberGroupReducer from './slices/memberGroupSlice';
import invitationReducer from './slices/invitationSlice';
import joinRequestReducer from './slices/joinRequestSlice';
import expenseReducer from './slices/expenseSlice';
import receivedInvitationReducer from './slices/receivedInvitationSlice';
// Import sagas
import { authSaga } from './sagas/authSaga';
import { detailGroupSaga } from './sagas/detailGroupSaga';
import { groupSaga } from './sagas/groupSaga';
import { memberGroupSaga } from './sagas/memberGroupSaga';
import { invitationsSaga } from './sagas/invitationsSaga';
import joinRequestSaga from './sagas/joinRequestSaga';
import { expenseSaga } from './sagas/expenseSaga';
import { receivedInvitationSaga } from './sagas/receivedInvitaionSaga';
// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Root saga
function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(detailGroupSaga),
    fork(groupSaga),
    fork(memberGroupSaga),
    fork(invitationsSaga),
    fork(joinRequestSaga),
    fork(expenseSaga),
    fork(receivedInvitationSaga),
  ]);
}

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    detailGroup: detailGroupReducer,
    group: groupReducer,
    memberGroup: memberGroupReducer,
    invitation: invitationReducer,
    joinRequest: joinRequestReducer,
    expense: expenseReducer,
    receivedInvitations: receivedInvitationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Run saga middleware
sagaMiddleware.run(rootSaga);

