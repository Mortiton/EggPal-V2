import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import PalCard from '@/app/components/PalCard'; 

//Mock a test pal
const mockPal = {
  id: 1,
  name: 'Test Pal',
  type1: 'fire',
  type2: 'water',
  strength: 5,
  speed: 3,
  intelligence: 4
};
//Mock the Next Image
jest.mock('next/image', () => ({ src, alt }) => <img src={src} alt={alt} />);

//Mock the work icon
jest.mock('@/app/components/WorkIcon', () => ({ iconName, value }) => (
    <div data-testid={iconName}>
      {iconName}: {value}
    </div>
  ));

describe('PalCard component', () => {
  test('renders pal details correctly', () => {
    render(<PalCard pal={mockPal} />);

    // Check if the pal's name is displayed
    expect(screen.getByText('Test Pal')).toBeInTheDocument();

    // Check if the pal's images are displayed
    expect(screen.getByAltText('Type: fire')).toBeInTheDocument();
    expect(screen.getByAltText('Type: water')).toBeInTheDocument();
    expect(screen.getByAltText('Image of Test Pal')).toBeInTheDocument();

    // Check if the work attributes are displayed
    expect(screen.getByTestId('strength')).toHaveTextContent('strength: 5');
    expect(screen.getByTestId('speed')).toHaveTextContent('speed: 3');
    expect(screen.getByTestId('intelligence')).toHaveTextContent('intelligence: 4');
  });

  test('renders only one type if type2 is not provided', () => {
    const singleTypePal = {
      id: 2,
      name: 'Single Type Pal',
      type1: 'earth',
      strength: 7,
      speed: 2,
      intelligence: 6
    };

    render(<PalCard pal={singleTypePal} />);

    // Check if the single type image is displayed
    expect(screen.getByAltText('Type: earth')).toBeInTheDocument();

    // Ensure the second type image is not displayed
    expect(screen.queryByAltText('Type: water')).not.toBeInTheDocument();
  });

  test('renders no work attributes if they are zero or not present', () => {
    const noWorkPal = {
      id: 3,
      name: 'No Work Pal',
      type1: 'air',
      type2: 'fire'
    };

    render(<PalCard pal={noWorkPal} />);

    // Check if the work attributes are not rendered
    expect(screen.queryByTestId('strength')).not.toBeInTheDocument();
    expect(screen.queryByTestId('speed')).not.toBeInTheDocument();
    expect(screen.queryByTestId('intelligence')).not.toBeInTheDocument();
  });
});