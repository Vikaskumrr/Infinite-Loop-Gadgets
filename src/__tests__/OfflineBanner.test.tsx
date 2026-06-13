import React from 'react';
import { render, screen } from '@testing-library/react';
import OfflineBanner from '../components/OfflineBanner/OfflineBanner';

describe('OfflineBanner', () => {
  test('shows local persistence copy while offline', () => {
    render(<OfflineBanner isOnline={false} />);

    expect(screen.getByRole('status')).toHaveTextContent(/saved locally/i);
  });

  test('stays hidden while online', () => {
    render(<OfflineBanner isOnline />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
