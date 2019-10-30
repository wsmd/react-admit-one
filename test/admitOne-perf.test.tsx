import React from 'react';
import { render } from '@testing-library/react';

import { admitOne } from '../src';

describe('AdmitOne Performance', () => {
  it('renders only once on mount', () => {
    const mountCallback = jest.fn();
    const GreeterOnce = admitOne(() => {
      React.useEffect(mountCallback);
      return <div />;
    });
    render(<GreeterOnce />);
    expect(mountCallback).toBeCalledTimes(1);
  });

  it('does not causes a re-render with React.memo', () => {
    const mountCallback = jest.fn();
    // eslint-disable-next-line react/display-name
    const MemoizedGreeter = React.memo(() => {
      React.useEffect(mountCallback);
      return <div />;
    });
    const GreeterOnce = admitOne(MemoizedGreeter);
    const { rerender } = render(<GreeterOnce />);
    rerender(<GreeterOnce />);
    expect(mountCallback).toBeCalledTimes(1);
  });
});
