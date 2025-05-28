import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../(tabs)/index';

describe('HomeScreen', () => {
  it('renders welcome text', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Welcome to the Convention App!')).toBeTruthy();
  });
});
