import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

// Import reducers
import authReducer from './slices/authSlice';
import detailGroupReducer from './slices/detailGroupSlice';
import groupReducer from './slices/groupSlice';
import memberGroupReducer from './slices/memberGroupSlice';

// Import sagas
import { authSaga } from './sagas/authSaga';
import { detailGroupSaga } from './sagas/detailGroupSaga';
import { groupSaga } from './sagas/groupSaga';
import { memberGroupSaga } from './sagas/memberGroupSaga';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Root saga
function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(detailGroupSaga),
    fork(groupSaga),
    fork(memberGroupSaga),
  ]);
}

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    detailGroup: detailGroupReducer,
    group: groupReducer,
    memberGroup: memberGroupReducer,
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

