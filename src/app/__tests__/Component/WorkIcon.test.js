import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkIcon from '@/app/components/WorkIcon';

describe('WorkIcon component', () => {
  test('renders the icon with value greater than 0', () => {
    render(<WorkIcon iconName="kindling" value={5} />);
    const iconElement = screen.getByRole('img', { name: /kindling: 5/i });
    expect(iconElement).toBeInTheDocument();
    const iconImage = screen.getByAltText(/kindling icon/i);
    expect(iconImage).toBeInTheDocument();
    const iconValue = screen.getByText('5');
    expect(iconValue).toBeInTheDocument();
  });

  test('does not render the icon with value of 0', () => {
    const { container } = render(<WorkIcon iconName="kindling" value={0} />);
    expect(container.firstChild).toBeNull();
  });

  test('does not render the icon with negative value', () => {
    const { container } = render(<WorkIcon iconName="kindling" value={-1} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders the correct icon path', () => {
    render(<WorkIcon iconName="watering" value={3} />);
    const iconImage = screen.getByAltText(/watering icon/i);
    expect(iconImage).toHaveAttribute('src', expect.stringContaining('/_next/image?url=%2Fimages%2Fwork%2Fwatering.png'));
  });

  test('applies the correct aria-label', () => {
    render(<WorkIcon iconName="planting" value={2} />);
    const iconElement = screen.getByRole('img', { name: /planting: 2/i });
    expect(iconElement).toHaveAttribute('aria-label', 'planting: 2');
  });
});
