export interface AdmitOneOptions {
  /**
   * A callback function called on when the first instance of the component is
   * mounted.
   */
  onMount?(element: JSX.Element): void;
  /**
   * A callback function called when subsequent mount attempts occur after the
   * first instance of the component is mounted.
   */
  onRestrictedMount?(element: JSX.Element): void;
  /**
   * A callback function called when first instance of the component unmounts.
   */
  onUnmount?(element: JSX.Element): void;
  /**
   * Ignores mounting restrictions applied by any boundaries. When specified,
   * the component can only be mounted once through the entire application even
   * when mounted within a boundary. Defaults to `false`.
   */
  ignoreBoundary?: boolean;
  /**
   * Prevents subsequent mount attempts after the first instance of the component
   * unmounts. Defaults to `false`.
   */
  persistTrace?: boolean;
}

export interface InstanceMount {
  element: JSX.Element;
  stackTrace?: string;
}

export type InstancesMap = Map<React.JSXElementConstructor<any>, InstanceMount>;
