import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardPage from '@/app/dashboard/page';

describe('Endorsement Form on Dashboard', () => {
  it('shows connect wallet prompt when disconnected', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Connect Your Wallet/i)).toBeInTheDocument();
    expect(screen.getByText(/access your dashboard/i)).toBeInTheDocument();
  });
});
