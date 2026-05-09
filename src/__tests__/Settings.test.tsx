import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from '../components/Settings/Settings';

describe('Settings', () => {
  afterEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  test('persists selected theme and applies body class', async () => {
    const user = userEvent.setup();

    render(<Settings onClose={vi.fn()} language="en" onLanguageChange={vi.fn()} />);
    await user.selectOptions(screen.getByLabelText(/display/i), 'dark');

    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.body).toHaveClass('theme-dark');
    expect(document.body).toHaveClass('dark-mode');
  });

  test('changes language from the selector', async () => {
    const user = userEvent.setup();
    const handleLanguageChange = vi.fn();

    render(<Settings onClose={vi.fn()} language="en" onLanguageChange={handleLanguageChange} />);
    await user.click(screen.getByRole('button', { name: /english/i }));
    await user.click(screen.getByRole('menuitem', { name: /español/i }));

    expect(handleLanguageChange).toHaveBeenCalledWith('es');
  });
});
