import React from 'react';
import { render } from '@testing-library/react';

import { admitOne, AdmitOneBoundary } from '../src';

function createGreeterComponent() {
  const Greeter: React.SFC<{ name: string }> = props => (
    <div>Hello, {props.name}</div>
  );
  return Greeter;
}

describe('Boundary Context', () => {
  it('applies restrictions within a boundary', () => {
    const GreeterOnce = admitOne(createGreeterComponent());
    const { queryAllByText } = render(
      <>
        <GreeterOnce name="A" />
        <AdmitOneBoundary>
          <GreeterOnce name="A" />
        </AdmitOneBoundary>
      </>,
    );
    expect(queryAllByText('Hello, A')).toHaveLength(2);
  });

  it('ignores restrictions within a boundary', () => {
    const Greeter = createGreeterComponent();
    const GreeterOnce = admitOne(Greeter, { ignoreBoundary: true });
    const { queryAllByText } = render(
      <>
        <GreeterOnce name="A" />
        <AdmitOneBoundary>
          <GreeterOnce name="A" />
        </AdmitOneBoundary>
      </>,
    );
    expect(queryAllByText('Hello, A')).toHaveLength(1);
  });
});
