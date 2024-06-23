import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '@/app/components/Footer';


describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });

  it('displays the copyright text', () => {
    render(<Footer />);
    const copyrightText = screen.getByText(/© 2024 EggPal. All rights reserved. Contact us at/i);
    expect(copyrightText).toBeInTheDocument();
  });

  it('displays the disclaimer text', () => {
    render(<Footer />);
    const disclaimerText = screen.getByText(/This website is not affiliated with Palworlds. All game content and materials are trademarks of Pocketpair, Inc./i);
    expect(disclaimerText).toBeInTheDocument();
  });

  it('contains a link to the Privacy Policy', () => {
    render(<Footer />);
    const privacyPolicyLink = screen.getByRole('link', { name: /Privacy Policy/i });
    expect(privacyPolicyLink).toBeInTheDocument();
    expect(privacyPolicyLink).toHaveAttribute('href', '/privacy-policy');
  });

  it('contains a link to the Terms of Service', () => {
    render(<Footer />);
    const termsOfServiceLink = screen.getByRole('link', { name: /Terms of Service/i });
    expect(termsOfServiceLink).toBeInTheDocument();
    expect(termsOfServiceLink).toHaveAttribute('href', '/terms-of-service');
  });

  it('contains an email link to contact support', () => {
    render(<Footer />);
    const emailLink = screen.getByRole('link', { name: /support@eggpal.net/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:support@eggpal.net');
  });
});
