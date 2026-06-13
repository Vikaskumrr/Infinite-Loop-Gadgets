import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import './AuthPage.scss';

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/account');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Login failed.');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Log in</h1>
        <p>Access your Infinite Gadget Loop account foundation.</p>
        <form onSubmit={handleSubmit}>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
        </form>
        <p>New here? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
};

export default LoginPage;
