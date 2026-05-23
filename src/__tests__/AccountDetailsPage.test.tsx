import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountDetailsPage from '../components/AccountDetailsPage/AccountDetailsPage';
import type { Order, UserProfile } from '../types';

const profile: UserProfile = {
  id: 'test-user',
  name: 'Guest Shopper',
  email: 'guest@example.com',
  mobileNumber: '',
  address: '',
  createdAt: '2026-05-24T00:00:00.000Z',
};

const orders: Order[] = [
  {
    id: 'ILG-ORDER',
    items: [{ name: 'Loop Phone Pro', brand: 'Infinite', price: 79999, rating: 4.8, productImage: '/phone.png', color: 'Graphite' }],
    total: 79999,
    createdAt: '2026-05-24T00:00:00.000Z',
    status: 'placed',
  },
];

describe('AccountDetailsPage', () => {
  test('renders local profile and persisted order history', () => {
    render(<AccountDetailsPage profile={profile} orders={orders} onProfileChange={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /account details/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Guest Shopper')).toBeInTheDocument();
    expect(screen.getByText('ILG-ORDER')).toBeInTheDocument();
  });

  test('saves edited local profile details', async () => {
    const user = userEvent.setup();
    const handleProfileChange = vi.fn();

    render(<AccountDetailsPage profile={profile} orders={[]} onProfileChange={handleProfileChange} />);
    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), 'Vikas Kumar');
    await user.click(screen.getByRole('button', { name: /save profile/i }));

    expect(handleProfileChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'Vikas Kumar' }));
    expect(screen.getByRole('status')).toHaveTextContent(/profile saved/i);
  });
});
