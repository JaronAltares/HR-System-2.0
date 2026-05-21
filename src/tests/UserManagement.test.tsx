import { render, screen, fireEvent } from '@testing-library/react';
import UserManagementPage from '@/components/admin/UserManagement';
import { useUserRole } from '@/hooks/useUserRole';

// Mock the auth hook
jest.mock('@/hooks/useUserRole');

describe('User Management Page - Sprint 3 UI Safeguards', () => {
  it('should display SUPERADMIN specific controls only to superadmins', () => {
    (useUserRole as jest.Mock).mockReturnValue({ role: 'SUPERADMIN' });
    render(<UserManagementPage />);
    
    // Check if highly sensitive management tools are visible
    expect(screen.getByText(/System-Wide Configurations/i)).toBeInTheDocument();
  });

  it('should restrict SUPERADMIN records and show tooltips for regular Admins', async () => {
    (useUserRole as jest.Mock).mockReturnValue({ role: 'ADMIN' });
    render(<UserManagementPage />);
    
    // Find a protected superadmin row/action
    const protectedActionBtn = screen.getByTestId('edit-superadmin-btn');
    
    // Button should be disabled
    expect(protectedActionBtn).toBeDisabled();
    
    // Hover to trigger Fred's tooltip protection
    fireEvent.mouseOver(protectedActionBtn);
    const tooltip = await screen.findByText(/Action restricted to SUPERADMIN only/i);
    expect(tooltip).toBeInTheDocument();
  });
});