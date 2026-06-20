import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useOrders } from '../../orders/hooks/useOrders';
import type { UserProfile } from '../../types';
import './AccountDetailsPage.scss';

interface AccountDetailsPageProps {
  profile: UserProfile;
  onProfileChange: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const AccountDetailsPage: React.FC<AccountDetailsPageProps> = ({ profile, onProfileChange }) => {
  const { user } = useAuth();
  const { orders, loading, error, reload } = useOrders();
  const [draftProfile, setDraftProfile] = useState(profile);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onProfileChange(draftProfile);
    setSaved(true);
  };

  const updateDraft = (field: keyof UserProfile, value: string) => {
    setSaved(false);
    setDraftProfile((currentProfile) => ({ ...currentProfile, [field]: value }));
  };

  const orderCount = orders.reduce((total, order) => total + order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0), 0);

  return (
    <div className="account-page-container">
      <section className="account-hero">
        <span className="state-kicker">{user ? 'Signed-in account' : 'Guest profile'}</span>
        <h1>Account Details</h1>
        <p>
          {user
            ? 'Your order history now comes from your account, while profile details stay editable in this demo storefront.'
            : 'Save a local profile for faster checkout prep, then sign in when you are ready to place real demo orders.'}
        </p>
      </section>

      <div className="account-layout">
        <form className="account-card profile-form" onSubmit={handleSubmit}>
          <h2>Profile</h2>
          <label>
            Name
            <input value={draftProfile.name} onChange={(event) => updateDraft('name', event.target.value)} />
          </label>
          <label>
            Email
            <input type="email" value={draftProfile.email} onChange={(event) => updateDraft('email', event.target.value)} />
          </label>
          <label>
            Mobile number
            <input value={draftProfile.mobileNumber} onChange={(event) => updateDraft('mobileNumber', event.target.value)} />
          </label>
          <label>
            Delivery address
            <textarea value={draftProfile.address} onChange={(event) => updateDraft('address', event.target.value)} rows={4} />
          </label>
          <button type="submit">Save Profile</button>
          {saved ? <p className="save-message" role="status">Profile saved for this browser.</p> : null}
        </form>

        <section className="account-card">
          <h2>Order History</h2>
          {!user ? (
            <div className="empty-orders">
              <strong>Sign in to unlock order history.</strong>
              <span>Your cart and discovery tools work as a guest, but orders are tied to an account.</span>
              <Link to="/login">Log in to continue</Link>
            </div>
          ) : loading ? (
            <div className="empty-orders">
              <strong>Loading your orders...</strong>
              <span>We are syncing your latest checkout activity.</span>
            </div>
          ) : error ? (
            <div className="empty-orders">
              <strong>We could not load your orders.</strong>
              <span>{error}</span>
              <button type="button" onClick={() => void reload()}>Retry</button>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-orders">
              <strong>No orders yet.</strong>
              <span>Your completed checkouts will appear here with live status updates.</span>
              <Link to="/products">Browse products</Link>
            </div>
          ) : (
            <>
              <p className="save-message" role="status">
                {orders.length} order{orders.length === 1 ? '' : 's'} across {orderCount} item{orderCount === 1 ? '' : 's'}.
              </p>
              <ul className="orders-list">
                {orders.map((order) => {
                  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
                  return (
                    <li key={order.id} className="order-history-item">
                      <div>
                        <strong>{order.id}</strong>
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      <div>
                        <strong>₹{order.totalAmount.toFixed(2)}</strong>
                        <span>{itemCount} item{itemCount === 1 ? '' : 's'}</span>
                      </div>
                      <div>
                        <span className="state-kicker">{order.status.replace('_', ' ')}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default AccountDetailsPage;
