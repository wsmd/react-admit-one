import getDisplayName from './getDisplayName';

interface Source {
  fileName: string;
  lineNumber: number;
}

interface ElementWithOwner extends JSX.Element {
  _owner: FiberNode;
}

interface FiberNode {
  type: React.ComponentType | string;
  return: FiberNode | null;
  _debugOwner: FiberNode | null;
  _debugSource: Source | null;
}

function getComponentName(node: FiberNode): string {
  switch (typeof node.type) {
    // The node is a function it will likely have a name
    case 'function':
      return getDisplayName(node.type);
    // The node is likely a tag
    case 'string':
      return node.type;
    /* istanbul ignore next */
    default:
      return 'Unknown';
  }
}

function describeStackFrame(node: FiberNode): string {
  // skipping components that are neither function/class nor html elements.
  // This will likely be the case with Work instances
  if (typeof node.type === 'object') {
    return '';
  }

  const name = getComponentName(node);
  const { _debugOwner: owner, _debugSource: source } = node;

  let info = '';
  if (source) {
    const path = source.fileName;
    const fileName = path.replace(/^(.*)[\\/]/, '');
    info = ` (at ${fileName}:${source.lineNumber})`;
  } else if (owner) {
    const ownerName = getComponentName(owner);
    info = ` (created by ${ownerName})`;
  }

  return `\n    in ${name}` + info;
}

export default function captureComponentStack(element: JSX.Element): string {
  let frames = '';
  let node: FiberNode | null = (element as ElementWithOwner)._owner;
  while (node) {
    frames += describeStackFrame(node);
    node = node.return;
  }
  return frames;
}
