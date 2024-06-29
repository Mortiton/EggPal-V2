import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateEmailForm from '@/app/profile/components/UpdateEmailForm';
import { updateEmail } from '@/app/profile/actions';

// Mock the updateEmail function
jest.mock('@/app/profile/actions', () => ({
  updateEmail: jest.fn(),
}));
describe('UpdateEmailForm component', () => {
    const user = { email: 'test@example.com' };
  
    beforeEach(() => {
      updateEmail.mockClear();
      // Add a #modal-root element to the document body
      const modalRoot = document.createElement('div');
      modalRoot.setAttribute('id', 'modal-root');
      document.body.appendChild(modalRoot);
    });
  
    afterEach(() => {
      // Clean up the #modal-root element after each test
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot) {
        document.body.removeChild(modalRoot);
      }
    });
  
    test('renders the form with initial values', () => {
      render(<UpdateEmailForm user={user} />);
  
      expect(screen.getByLabelText(/Email:/i)).toHaveValue(user.email);
    });
  
    test('validates the email field and shows error messages', async () => {
      render(<UpdateEmailForm user={user} />);
  
      fireEvent.change(screen.getByLabelText(/Email:/i), {
        target: { value: 'invalid-email' },
      });
      fireEvent.blur(screen.getByLabelText(/Email:/i));
  
      await waitFor(() => {
        expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
      });
  
      fireEvent.change(screen.getByLabelText(/Email:/i), {
        target: { value: '' },
      });
      fireEvent.blur(screen.getByLabelText(/Email:/i));
  
      await waitFor(() => {
        expect(screen.getByText(/Required/i)).toBeInTheDocument();
      });
    });
  
    test('submits the form and shows success modal', async () => {
      updateEmail.mockResolvedValueOnce({});
  
      render(<UpdateEmailForm user={user} />);
  
      fireEvent.change(screen.getByLabelText(/Email:/i), {
        target: { value: 'new-email@example.com' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Update Email/i }));
  
      await waitFor(() => {
        expect(updateEmail).toHaveBeenCalledWith('new-email@example.com');
        expect(screen.getByText(/Please confirm the email change on your new email address./i)).toBeInTheDocument();
      });
  
      fireEvent.click(screen.getByRole('button', { name: /OK/i }));
  
      await waitFor(() => {
        expect(screen.queryByText(/Please confirm the email change on your new email address./i)).not.toBeInTheDocument();
      });
    });
  
    test('shows error message when update fails', async () => {
      const errorMessage = 'Update failed';
      updateEmail.mockRejectedValueOnce(new Error(errorMessage));
  
      render(<UpdateEmailForm user={user} />);
  
      fireEvent.change(screen.getByLabelText(/Email:/i), {
        target: { value: 'new-email@example.com' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Update Email/i }));
  
      await waitFor(() => {
        expect(updateEmail).toHaveBeenCalledWith('new-email@example.com');
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
      });
    });
  });