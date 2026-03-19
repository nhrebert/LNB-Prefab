import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { RoleProvider, useRole } from '@/components/RoleContext';

const TestComponent = () => {
    const { role, setRole } = useRole();
    return (
        <div>
            <span data-testid="role-display">{role}</span>
            <button onClick={() => setRole('Field User')}>Switch to Field User</button>
        </div>
    );
};

describe('RoleContext', () => {
    it('provides the default role of Admin', () => {
        render(
            <RoleProvider>
                <TestComponent />
            </RoleProvider>
        );
        expect(screen.getByTestId('role-display')).toHaveTextContent('Admin');
    });

    it('allows updating the role', () => {
        render(
            <RoleProvider>
                <TestComponent />
            </RoleProvider>
        );
        
        const button = screen.getByText('Switch to Field User');
        act(() => {
            button.click();
        });
        
        expect(screen.getByTestId('role-display')).toHaveTextContent('Field User');
    });

    it('throws error if used outside of provider', () => {
        // Prevent console.error from cluttering the test output
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        expect(() => render(<TestComponent />)).toThrow('useRole must be used within a RoleProvider');
        
        consoleSpy.mockRestore();
    });
});
