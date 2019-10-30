import React from 'react';
import { render } from '@testing-library/react';

import { AdmitOneBoundary } from '../src';

describe('AdmitOneBoundary', () => {
  it('renders its children', () => {
    const { queryByText } = render(
      <AdmitOneBoundary>
        <div>Hello, world!</div>
      </AdmitOneBoundary>,
    );
    expect(queryByText('Hello, world!')).toBeTruthy();
  });
});
