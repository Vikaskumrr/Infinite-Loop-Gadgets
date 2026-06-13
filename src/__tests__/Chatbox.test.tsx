import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chatbox from '../components/Chatbox/Chatbox';

describe('Chatbox', () => {
  test('answers product catalog questions locally', async () => {
    const user = userEvent.setup();

    render(<Chatbox onClose={vi.fn()} />);
    await user.type(screen.getByPlaceholderText(/type a message/i), 'best phone under 80000');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText(/good match/i)).toBeInTheDocument();
  });
});
