import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfilePage from '@/app/profile/page';


// Mock the form components
jest.mock('@/app/profile/components/UpdateEmailForm', () => {
  return function MockedUpdateEmailForm() {
    return <div data-testid="update-email-form">Mocked UpdateEmailForm</div>;
  };
});

jest.mock('@/app/profile/components/UpdatePasswordForm', () => {
  return function MockedUpdatePasswordForm() {
    return <div data-testid="update-password-form">Mocked UpdatePasswordForm</div>;
  };
});

jest.mock('@/app/profile/components/DeleteUserForm', () => {
  return function MockedDeleteUserForm() {
    return <div data-testid="delete-user-form">Mocked DeleteUserForm</div>;
  };
});

// Mock the CSS module
jest.mock('@/app/components/styles/FormPage.module.css', () => ({
  container: 'mockedContainer',
  heading: 'mockedHeading',
  description: 'mockedDescription',
}));

describe('ProfilePage', () => {
  it('renders the profile page with correct elements', async () => {
    render(await ProfilePage());

    // Check for the heading
    expect(screen.getByRole('heading', { name: /Profile/i })).toBeInTheDocument();

    // Check for the description
    expect(screen.getByText(/Update your account details below/i)).toBeInTheDocument();

    // Check for the form components
    expect(screen.getByTestId('update-email-form')).toBeInTheDocument();
    expect(screen.getByTestId('update-password-form')).toBeInTheDocument();
    expect(screen.getByTestId('delete-user-form')).toBeInTheDocument();
  });

  it('applies the correct CSS classes', async () => {
    const { container } = render(await ProfilePage());

    expect(container.firstChild).toHaveClass('mockedContainer');
    expect(screen.getByRole('heading', { name: /Profile/i })).toHaveClass('mockedHeading');
    expect(screen.getByText(/Update your account details below/i)).toHaveClass('mockedDescription');
  });
});