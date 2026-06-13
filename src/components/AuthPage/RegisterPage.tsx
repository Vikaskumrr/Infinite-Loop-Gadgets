import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { prepareUserDataMigration } from '../../auth/migration';
import './AuthPage.scss';

const RegisterPage: React.FC = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const migrationPreview = React.useMemo(() => prepareUserDataMigration(), []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/account');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Registration failed.');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Create account</h1>
        <p>Your local cart, wishlist, and compare data stay on this device until account merge is implemented.</p>
        <p>{migrationPreview.cartItems} cart items, {migrationPreview.wishlistItems} wishlist items, and {migrationPreview.compareItems} compare items are ready for future migration.</p>
        <form onSubmit={handleSubmit}>
          <label>Name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required /></label>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
          <label>Password<input type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required /></label>
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        </form>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  );
};

export default RegisterPage;
