import React, { useContext, useEffect, useRef } from 'react';

import captureComponentStack from './utils/captureComponentStack';
import getErrorMessage from './utils/getErrorMessage';
import getDisplayName from './utils/getDisplayName';
import useLazyValue from './utils/useLazyValue';

import { AdmitOneBoundaryContext } from './AdmitOneBoundary';
import { AdmitOneOptions, InstancesMap } from './types';

const GLOBAL_INSTANCE_TRACKER: InstancesMap = new Map();

const noop = () => {};

const defaultOptions: Required<AdmitOneOptions> = {
  onMount: noop,
  onUnmount: noop,
  onRestrictedMount: noop,
  persistTrace: false,
  ignoreBoundary: false,
};

function admitOne<P, R, C>(
  WrappedComponent: React.JSXElementConstructor<P>,
  options?: AdmitOneOptions,
) {
  const opts = Object.assign({}, defaultOptions, options);

  function WithAdmitOne(
    props: JSX.LibraryManagedAttributes<C, P>,
    ref: React.Ref<R>,
  ): JSX.Element | null {
    const boundary = useContext(AdmitOneBoundaryContext);

    let mountedInstancesMap: InstancesMap = GLOBAL_INSTANCE_TRACKER;
    let withinBoundary = false;
    if (boundary && !opts.ignoreBoundary) {
      mountedInstancesMap = boundary;
      withinBoundary = true;
    }

    /**
     * Holds reference to the element at the current render. This is used to
     * prevent effects from firing on every re-render when the element is used
     * as a dependency
     */
    const elementRef = useRef() as React.MutableRefObject<JSX.Element>;
    elementRef.current = React.createElement(
      WrappedComponent,
      Object.assign({}, props as P, { ref }),
    );

    const renderAllowed = useLazyValue(() => {
      const element = elementRef.current;

      let mountedInstance = mountedInstancesMap.get(WrappedComponent);

      if (mountedInstance) {
        if (process.env.NODE_ENV === 'development') {
          const errorMessage = getErrorMessage(
            element,
            mountedInstance,
            withinBoundary,
          );
          console.error(errorMessage);
        }
        return false;
      }

      mountedInstance = {
        element,
      };

      if (process.env.NODE_ENV === 'development') {
        // Capturing stacktrace at mount time (as opposed to when needed)
        // because the stack may change after the first render, and this stack
        // will be needed to know exactly how the component was first rendered
        mountedInstance.stackTrace = captureComponentStack(element);
      }

      mountedInstancesMap.set(WrappedComponent, mountedInstance);

      return true;
    });

    useEffect(() => {
      const mountedElement = elementRef.current;

      if (renderAllowed) {
        opts.onMount(mountedElement);
      } else {
        opts.onRestrictedMount(mountedElement);
      }

      // Since the component wasn't allowed to render, there is nothing to
      // clean up or do when the HOC unmounts
      if (!renderAllowed) {
        return;
      }

      return () => {
        opts.onUnmount(elementRef.current);

        const mountedInstance = mountedInstancesMap.get(WrappedComponent)!;
        delete mountedInstance.element;

        if (!opts.persistTrace) {
          mountedInstancesMap.delete(WrappedComponent);
        }
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return renderAllowed ? elementRef.current : null;
  }

  if (process.env.NODE_ENV === 'development') {
    const wrappedDisplayName = getDisplayName(WrappedComponent);
    WithAdmitOne.displayName = `AdmitOne(${wrappedDisplayName})`;
  }

  return React.forwardRef(WithAdmitOne);
}

export { admitOne };
