import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/LoginPage';
import Dashboard from '../pages/DashboardPage';
import Home from '../pages/HomePage';
import AppHeader from './AppHeader';
import { Layout } from 'antd';
import UserPage from '../pages/UserPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import NotePage from '../pages/NotePage';

export default function AppLayout() {
  const location = useLocation();
  const hideHeader =
    location.pathname === '/login' || location.pathname === '/reset-password';

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      {!hideHeader && <AppHeader />}
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path='user/:userId'
          element={
            <ProtectedRoute roles={['root_admin', 'admin']}>
              <UserPage />
            </ProtectedRoute>
          }
        />

        <Route path='note/:noteId' element={<NotePage />} />

        <Route path='/login' element={<Login />} />

        <Route
          path='/dashboard'
          element={
            <ProtectedRoute roles={['root_admin', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path='/reset-password' element={<ResetPasswordPage />} />
      </Routes>
    </Layout>
  );
}
