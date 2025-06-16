import AppRoutes from './routes'
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { initializeAuth } from './store/slices/authSlice';

function AuthWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize authentication on app startup
    dispatch(initializeAuth());
  }, [dispatch]);

  return <AppRoutes />;
}

function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <AuthWrapper />
    </Provider>
  );
}

export default App
