import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ActivityPage from '@/app/activity/page';

describe('Activity Feed Page', () => {
  it('renders activity feed title and description', () => {
    render(<ActivityPage />);
    expect(screen.getByText(/Live Activity Feed/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-time event stream/i)).toBeInTheDocument();
  });

  it('renders filter tabs', () => {
    render(<ActivityPage />);
    expect(screen.getByText('All Events')).toBeInTheDocument();
    expect(screen.getByText('Endorsements')).toBeInTheDocument();
    expect(screen.getByText('Profiles')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });
});
