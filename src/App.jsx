import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import TodoPage from './pages/TodoPage';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const PublicRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/app" replace /> : element;
};

function App() {
  return (
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute element={<AuthPage type="login" />} />} />
          <Route path="/register" element={<PublicRoute element={<AuthPage type="register" />} />} />
          <Route path="/app" element={<ProtectedRoute element={<TodoPage />} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
  );
}

export default App;