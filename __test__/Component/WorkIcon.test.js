import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkIcon from '@/app/components/WorkIcon';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ src, alt, width, height, className, priority }) => (
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
      data-priority={priority ? 'true' : 'false'}
    />
  ))
}));
describe('WorkIcon', () => {
  const mockIconUrl = '/mock-icon.png';

  it('renders the icon and value when value is positive', () => {
    render(<WorkIcon iconUrl={mockIconUrl} value={5} />);
    
    const iconContainer = screen.getByRole('img', { name: 'Icon: 5' });
    expect(iconContainer).toBeInTheDocument();

    const iconImage = screen.getByAltText('Icon');
    expect(iconImage).toBeInTheDocument();
    expect(iconImage).toHaveAttribute('src', mockIconUrl);
    expect(iconImage).toHaveAttribute('width', '25');
    expect(iconImage).toHaveAttribute('height', '25');

    const valueText = screen.getByText('5');
    expect(valueText).toBeInTheDocument();
  });

  it('does not render anything when value is 0', () => {
    const { container } = render(<WorkIcon iconUrl={mockIconUrl} value={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render anything when value is negative', () => {
    const { container } = render(<WorkIcon iconUrl={mockIconUrl} value={-1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('applies correct CSS classes', () => {
    render(<WorkIcon iconUrl={mockIconUrl} value={5} />);
    
    const iconContainer = screen.getByRole('img', { name: 'Icon: 5' });
    expect(iconContainer).toHaveClass('iconContainer');

    const iconImage = screen.getByAltText('Icon');
    expect(iconImage).toHaveClass('iconImage');

    const valueText = screen.getByText('5');
    expect(valueText).toHaveClass('iconValue');
  });

  it('sets priority prop on Image component', () => {
    render(<WorkIcon iconUrl={mockIconUrl} value={5} />);
    
    const iconImage = screen.getByAltText('Icon');
    expect(iconImage).toHaveAttribute('data-priority', 'true');
  });
});