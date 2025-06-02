import { render, screen } from '@testing-library/react';
import React from 'react';
import { logger } from '@/utils/logger';

// describe, it, expect are provided by Vitest

describe('Sample Test', () => {
  it('renders a simple message', () => {
    const TestComponent = () => <div>Hello, HrdHat!</div>;
    render(<TestComponent />);
    expect(screen.getByText('Hello, HrdHat!')).toBeInTheDocument();
    logger.info('Sample test ran successfully');
  });
});
