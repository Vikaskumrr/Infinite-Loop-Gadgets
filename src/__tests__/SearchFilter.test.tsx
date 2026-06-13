import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchFilter from '../components/SearchFilter/SearchFilter';

describe('SearchFilter', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('shows suggestions and applies a suggested search', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(<SearchFilter searchTerm="" onSearchChange={onSearchChange} sortOption="none" onSortChange={vi.fn()} />);
    await user.click(screen.getByRole('textbox', { name: /search products/i }));
    await user.click(screen.getByRole('button', { name: /trysmartphone/i }));

    expect(onSearchChange).toHaveBeenCalledWith('smartphone');
  });
});
