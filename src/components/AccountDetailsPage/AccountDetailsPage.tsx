import React, { useState } from 'react';
import type { Order, UserProfile } from '../../types';
import './AccountDetailsPage.scss';

interface AccountDetailsPageProps {
  profile: UserProfile;
  orders: Order[];
  onProfileChange: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const AccountDetailsPage: React.FC<AccountDetailsPageProps> = ({ profile, orders, onProfileChange }) => {
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

  return (
    <div className="account-page-container">
      <section className="account-hero">
        <span className="state-kicker">Anonymous account</span>
        <h1>Account Details</h1>
        <p>Your profile, cart, and order history are stored locally in this browser.</p>
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
          {saved && <p className="save-message" role="status">Profile saved for this browser.</p>}
        </form>

        <section className="account-card">
          <h2>Order History</h2>
          {orders.length === 0 ? (
            <div className="empty-orders">
              <strong>No orders yet.</strong>
              <span>Placed demo checkout orders will appear here.</span>
            </div>
          ) : (
            <ul className="orders-list">
              {orders.map((order) => (
                <li key={order.id} className="order-history-item">
                  <div>
                    <strong>{order.id}</strong>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <strong>₹{order.total.toFixed(2)}</strong>
                    <span>{order.items.length} item{order.items.length === 1 ? '' : 's'}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default AccountDetailsPage;
