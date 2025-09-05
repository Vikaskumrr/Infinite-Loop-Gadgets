import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders the app title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Welcome to Infinite Loop Gadgets/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders ExampleComponent', () => {
    render(<App />);
    const exampleComponentElement = screen.getByTestId('example-component');
    expect(exampleComponentElement).toBeInTheDocument();
  });
});