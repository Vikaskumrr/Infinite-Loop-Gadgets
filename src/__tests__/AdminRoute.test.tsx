import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContextValue';
import AdminRoute from '../admin/AdminRoute';

describe('AdminRoute', () => {
  test('redirects guests to login', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthContext.Provider value={{ user: null, token: null, loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() }}>
          <Routes>
            <Route path="/login" element={<h1>Login</h1>} />
            <Route path="/admin" element={<AdminRoute><h1>Admin</h1></AdminRoute>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  test('blocks non-admin users', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthContext.Provider value={{ user: { id: 'u1', name: 'Ada', email: 'ada@example.com', role: 'CUSTOMER' }, token: 'token', loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() }}>
          <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/admin" element={<AdminRoute><h1>Admin</h1></AdminRoute>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
  });

  test('renders for admins', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthContext.Provider value={{ user: { id: 'u1', name: 'Ada', email: 'ada@example.com', role: 'ADMIN' }, token: 'token', loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn() }}>
          <Routes>
            <Route path="/admin" element={<AdminRoute><h1>Admin</h1></AdminRoute>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();
  });
});
