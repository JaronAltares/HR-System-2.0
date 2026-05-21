import { render, screen } from '@testing-library/react';
import { AdminRouteGuard } from '@/components/guards/AdminRouteGuard';
import { executeUserAction } from '@/utils/actionGating';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Admin Routing Guard', () => {
  it('should redirect non-admin users to unauthorized page', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(
      <AdminRouteGuard userRole="USER">
        <div data-testid="protected-content">Admin Dashboard</div>
      </AdminRouteGuard>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/unauthorized');
  });
});

describe('Action Gating (record_status)', () => {
  it('should block actions if user record_status is inactive', () => {
    const mockAction = jest.fn();
    const result = executeUserAction({ status: 'INACTIVE' }, mockAction);

    expect(result).toBe(false);
    expect(mockAction).not.toHaveBeenCalled();
  });

  it('should allow actions if user record_status is active', () => {
    const mockAction = jest.fn();
    const result = executeUserAction({ status: 'ACTIVE' }, mockAction);

    expect(result).toBe(true);
    expect(mockAction).toHaveBeenCalled();
  });
});