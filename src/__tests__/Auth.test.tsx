import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import { useAuth } from '../auth/useAuth';
import ProtectedRoute from '../auth/ProtectedRoute';
import LoginPage from '../components/AuthPage/LoginPage';

const AuthStateProbe = () => {
  const { user } = useAuth();
  return <span>{user ? user.email : 'anonymous'}</span>;
};

describe('authentication UI', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders login form', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('loads persisted auth state', () => {
    localStorage.setItem('ilg.auth', JSON.stringify({
      token: 'token',
      user: { id: 'u1', name: 'Ada', email: 'ada@example.com' },
    }));

    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthStateProbe />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
  });

  test('redirects protected route when unauthenticated', () => {
    render(
      <MemoryRouter initialEntries={['/account']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<h1>Login destination</h1>} />
            <Route path="/account" element={<ProtectedRoute><h1>Account</h1></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /login destination/i })).toBeInTheDocument();
  });
});
