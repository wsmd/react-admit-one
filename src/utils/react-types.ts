interface Source {
  fileName: string;
  lineNumber: number;
}

export interface ElementWithOwner extends JSX.Element {
  _owner: FiberNode;
}

export type FiberType =
  | React.ComponentType
  | ReactForwardRefType
  | ReactMemoType
  | string;

interface FiberNode {
  type: FiberType;
  return: FiberNode | null;
  _debugOwner: FiberNode | null;
  _debugSource: Source | null;
}

interface ReactForwardRefType {
  render: React.ComponentType;
}

interface ReactMemoType {
  type: React.ComponentType;
}

function isForwardRefType(type: FiberType): type is ReactForwardRefType {
  return Object.prototype.hasOwnProperty.call(type, 'render');
}

/* istanbul ignore next */
function isMemoType(type: FiberType): type is ReactMemoType {
  return Object.prototype.hasOwnProperty.call(type, 'type');
}

export { isForwardRefType, isMemoType, FiberNode };
