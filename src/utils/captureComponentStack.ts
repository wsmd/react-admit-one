import getComponentName from './getDisplayName';
import { FiberNode, isForwardRefType, ElementWithOwner } from './react-types';

function describeStackFrame(node: FiberNode): string {
  // skipping components that are neither function/class components, nor html
  // elements, nor ref-forwarding components (admitOne uses forwardRef).
  // This will likely be the case with Work instances
  if (
    !node.type ||
    (typeof node.type === 'object' && !isForwardRefType(node.type))
  ) {
    return '';
  }

  const name = getComponentName(node.type);
  const { _debugOwner: owner, _debugSource: source } = node;

  let info = '';
  if (source) {
    const path = source.fileName;
    const fileName = path.replace(/^(.*)[\\/]/, '');
    info = ` (at ${fileName}:${source.lineNumber})`;
  } else if (owner) {
    const ownerName = getComponentName(owner.type);
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
