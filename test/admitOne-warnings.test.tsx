import React from 'react';
import { render } from '@testing-library/react';

import * as TestUtils from './test-utils';

import { admitOne, AdmitOneBoundary } from '../src';

describe('AdmitOne Errors', () => {
  // Tests Setup
  TestUtils.mockConsoleErrorForEachTest();

  describe('in "development" environment', () => {
    // Tests Setup
    TestUtils.setEnvironmentForAllTests('NODE_ENV', 'development');

    it('prints errors on subsequent mounts', () => {
      const TestComponent = () => <div />;
      const RenderComponentOnce = admitOne(TestComponent);
      render(
        <div>
          <RenderComponentOnce />
        </div>,
      );

      expect(console.error).not.toHaveBeenCalled();

      render(
        <main>
          <div>
            <RenderComponentOnce />
          </div>
        </main>,
      );

      expect((console as any).error.mock.calls[0][0]).toMatchInlineSnapshot(`
        "An attempt to render <TestComponent> was made:

            in AdmitOne(TestComponent) (at admitOne-warnings.test.tsx:30)
            in div (at admitOne-warnings.test.tsx:29)
            in main (at admitOne-warnings.test.tsx:28)

        The component <TestComponent> is already rendered:

            in AdmitOne(TestComponent) (at admitOne-warnings.test.tsx:21)
            in div (at admitOne-warnings.test.tsx:20)"
      `);
    });

    it('prints errors on subsequent mounts if debug info is not available', () => {
      const TestComponent = () => <div />;
      const RenderComponentOnce = admitOne(TestComponent);

      function NonJSXTree() {
        return React.createElement(
          'div',
          null,
          React.createElement(RenderComponentOnce, null),
          React.createElement(RenderComponentOnce, null),
        );
      }

      render(React.createElement(NonJSXTree));

      expect((console as any).error.mock.calls[0][0]).toMatchInlineSnapshot(`
        "An attempt to render <TestComponent> was made:

            in AdmitOne(TestComponent) (created by NonJSXTree)
            in div (created by NonJSXTree)
            in NonJSXTree

        The component <TestComponent> is already rendered:

            in AdmitOne(TestComponent) (created by NonJSXTree)
            in div (created by NonJSXTree)
            in NonJSXTree"
      `);
    });

    it('prints errors on subsequent mounts after the first instance unmounts', () => {
      const TestComponent = () => <div />;
      const RenderComponentOnce = admitOne(TestComponent, {
        persistTrace: true,
      });
      const { unmount } = render(
        <div>
          <RenderComponentOnce />
        </div>,
      );

      expect(console.error).not.toHaveBeenCalled();

      unmount();

      render(
        <main>
          <div>
            <RenderComponentOnce />
          </div>
        </main>,
      );

      expect(console.error).toHaveBeenCalled();

      expect((console as any).error.mock.calls[0][0]).toMatchInlineSnapshot(`
        "An attempt to render <TestComponent> was made:

            in AdmitOne(TestComponent) (at admitOne-warnings.test.tsx:97)
            in div (at admitOne-warnings.test.tsx:96)
            in main (at admitOne-warnings.test.tsx:95)

        The component <TestComponent> was rendered:

            in AdmitOne(TestComponent) (at admitOne-warnings.test.tsx:86)
            in div (at admitOne-warnings.test.tsx:85)"
      `);
    });

    it('prints errors on subsequent mounts withing a boundary', () => {
      const TestComponent = () => <div />;
      const RenderComponentOnce = admitOne(TestComponent);
      render(
        <div>
          <AdmitOneBoundary>
            <RenderComponentOnce />
            <RenderComponentOnce />
          </AdmitOneBoundary>
        </div>,
      );

      expect(console.error).toHaveBeenCalled();
      expect((console as any).error.mock.calls[0][0]).toMatchInlineSnapshot(`
        "An attempt to render <TestComponent> was made:

            in AdmitOne(TestComponent) (at admitOne-warnings.test.tsx:125)
            in AdmitOneBoundary (at admitOne-warnings.test.tsx:123)
            in div (at admitOne-warnings.test.tsx:122)

        The component <TestComponent> is already rendered within a boundary:

            in AdmitOne(TestComponent) (at admitOne-warnings.test.tsx:124)
            in AdmitOneBoundary (at admitOne-warnings.test.tsx:123)
            in div (at admitOne-warnings.test.tsx:122)"
      `);
    });
  });

  describe('in "production" environment', () => {
    // Tests Setup
    TestUtils.mockConsoleErrorForEachTest();
    TestUtils.setEnvironmentForAllTests('NODE_ENV', 'production');

    it('does not prints errors on subsequent mounts', () => {
      const TestComponent = () => <main />;
      const RenderComponentOnce = admitOne(TestComponent);

      render(<RenderComponentOnce />);
      expect(console.error).not.toHaveBeenCalled();

      const { container } = render(<RenderComponentOnce />);
      expect(console.error).not.toHaveBeenCalled();
      expect(container.hasChildNodes()).toBeFalsy();
    });
  });
});
