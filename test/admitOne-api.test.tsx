import React from 'react';
import { render } from '@testing-library/react';

import { admitOne } from '../src';

function createGreeterComponent() {
  const Greeter: React.SFC<{ name?: string }> = props => (
    <div>Hello, {props.name}</div>
  );
  Greeter.defaultProps = { name: 'User' };
  return Greeter;
}

describe('AdmitOne API', () => {
  it('returns the wrapped component and forwards its props', () => {
    const Greeter = createGreeterComponent();
    const GreeterOnce = admitOne(Greeter);
    const { queryByText } = render(<GreeterOnce name="A" />);

    expect(queryByText('Hello, A')).toBeTruthy();
  });

  it('renders the component only once', () => {
    const Greeter = createGreeterComponent();
    const GreeterOnce = admitOne(Greeter);
    const { queryAllByText } = render(
      <>
        <GreeterOnce name="A" />
        <GreeterOnce name="B" />
        <GreeterOnce name="C" />
      </>,
    );

    expect(queryAllByText(/Hello/)).toHaveLength(1);
  });

  it('allows mounting after the first instance unmounts', () => {
    const onMount = jest.fn();
    const Greeter = createGreeterComponent();
    const GreeterOnce = admitOne(Greeter, { onMount });
    const { unmount, rerender } = render(<GreeterOnce name="A" />);
    unmount();
    rerender(<GreeterOnce name="A" />);

    expect(onMount).toHaveBeenCalledTimes(2);
  });

  it('prevents mounting after the first instance unmounts using options.persistTrace', () => {
    const onMount = jest.fn();
    const Greeter = createGreeterComponent();
    const GreeterOnce = admitOne(Greeter, { onMount, persistTrace: true });
    const { unmount, rerender } = render(<GreeterOnce name="A" />);
    unmount();
    rerender(<GreeterOnce name="A" />);

    expect(onMount).toHaveBeenCalledTimes(1);
  });

  it('calls options.onMount when first instance mounts', async () => {
    const onMount = jest.fn();
    const Greeter = createGreeterComponent();
    const GreeterOnce = admitOne(Greeter, { onMount });

    const firstRenderElement = <GreeterOnce name="A" />;
    const { rerender } = render(firstRenderElement);

    const secondRenderElement = <GreeterOnce name="B" />;
    rerender(secondRenderElement);

    expect(onMount).toHaveBeenCalledTimes(1);
    expect(onMount).toHaveBeenCalledWith(
      expect.objectContaining({
        type: Greeter,
        props: { name: 'A' },
      }),
    );
  });

  it('calls options.onRestrictedMount on subsequent mounts', () => {
    const onRestrictedMount = jest.fn();
    const Greeter = createGreeterComponent();
    const GreeterOnce = admitOne(Greeter, { onRestrictedMount });
    const components = (
      <>
        <GreeterOnce name="A" />
        <GreeterOnce name="B" />
      </>
    );

    const { rerender } = render(components);
    rerender(components);

    expect(onRestrictedMount).toHaveBeenCalledTimes(1);
    expect(onRestrictedMount).toHaveBeenCalledWith(
      expect.objectContaining({
        type: Greeter,
        props: { name: 'B' },
      }),
    );
  });

  it('calls options.onUnmount when first instance unmounts', () => {
    const onUnmount = jest.fn();
    const Greeter = createGreeterComponent();
    const GreeterOnce = admitOne(Greeter, { onUnmount });

    const firstRenderElement = <GreeterOnce name="A" />;
    const { rerender, unmount } = render(firstRenderElement);

    const secondRenderElement = <GreeterOnce name="B" />;
    rerender(secondRenderElement);

    unmount();

    expect(onUnmount).toHaveBeenCalledTimes(1);
    expect(onUnmount).toHaveBeenCalledWith(
      expect.objectContaining({
        type: Greeter,
        props: { name: 'B' },
      }),
    );
  });
});
