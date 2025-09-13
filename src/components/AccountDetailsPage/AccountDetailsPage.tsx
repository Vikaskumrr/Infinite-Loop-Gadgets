import React from 'react';
import './AccountDetailsPage.scss'; // Import the new stylesheet

const AccountDetailsPage = () => {
  // Dummy data for the user details
  const user = {
    name: 'Vikas Kumar',
    age: 25,
    mobileNumber: '9873239265',
    email: 'Vikaskumrr@gmail.com',
    address: 'Eros sampoornam, Sector 2, Greater Noida West, India',
  };

  return (
    <div className="account-page-container">
      <h1>Account Details</h1>
      <div className="details-grid">
        <div className="detail-item">
          <strong>Name:</strong>
          <span>{user.name}</span>
        </div>
        <div className="detail-item">
          <strong>Age:</strong>
          <span>{user.age}</span>
        </div>
        <div className="detail-item">
          <strong>Mobile Number:</strong>
          <span>{user.mobileNumber}</span>
        </div>
        <div className="detail-item">
          <strong>Email:</strong>
          <span>{user.email}</span>
        </div>
        <div className="detail-item">
          <strong>Address:</strong>
          <span>{user.address}</span>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsPage;