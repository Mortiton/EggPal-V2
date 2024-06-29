import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessModal from '@/app/components/SuccessModal'; // Adjust the import according to your file structure
import Modal from 'react-modal';

describe('SuccessModal component', () => {
  beforeAll(() => {
    // Set up the root element for the modal and set the app element
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
    Modal.setAppElement('#modal-root');
  });

  afterAll(() => {
    // Clean up the root element for the modal
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  test('renders the modal with the correct message when open', () => {
    render(
      <SuccessModal
        isOpen={true}
        onRequestClose={() => {}}
        onConfirm={() => {}}
        message="Operation successful!"
      />
    );

    // Check if the modal content is rendered
    const modalTitle = screen.getByText('Success');
    const modalMessage = screen.getByText('Operation successful!');
    const confirmButton = screen.getByRole('button', { name: /OK/i });

    expect(modalTitle).toBeInTheDocument();
    expect(modalMessage).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
  });

  test('does not render the modal when not open', () => {
    render(
      <SuccessModal
        isOpen={false}
        onRequestClose={() => {}}
        onConfirm={() => {}}
        message="Operation successful!"
      />
    );

    // Check if the modal content is not rendered
    const modalMessage = screen.queryByText('Operation successful!');
    expect(modalMessage).not.toBeInTheDocument();
  });

  test('calls onConfirm when the confirm button is clicked', () => {
    const mockOnConfirm = jest.fn();
    render(
      <SuccessModal
        isOpen={true}
        onRequestClose={() => {}}
        onConfirm={mockOnConfirm}
        message="Operation successful!"
      />
    );

    // Simulate button click
    const confirmButton = screen.getByRole('button', { name: /OK/i });
    fireEvent.click(confirmButton);

    // Check if the onConfirm function is called
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test('sets focus on the confirm button when the modal opens', async () => {
    render(
      <SuccessModal
        isOpen={true}
        onRequestClose={() => {}}
        onConfirm={() => {}}
        message="Operation successful!"
      />
    );

    // Use waitFor to wait until the confirm button is focused
    await waitFor(() => {
      const confirmButton = screen.getByRole('button', { name: /OK/i });
      expect(confirmButton).toHaveFocus();
    });
  });
});
