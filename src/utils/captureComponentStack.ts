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

class StackTrace<T> {
  constructor(private element: ElementWithOwner) {}

  static walkUp(
    element: ElementWithOwner,
    callback: (node: FiberNode) => void,
  ): void {
    let node: FiberNode | null = element._owner;
    while (node) {
      callback(node);
      node = node.return;
    }
  }

  capture(): string {
    let trace = '';
    StackTrace.walkUp(this.element, node => {
      // skipping components that are neither function/class nor html elements.
      // This will likely be the case with Work instances
      if (typeof node.type !== 'object') {
        trace += new StackFrame(node);
      }
    });
    return trace;
  }
}

class StackFrame {
  constructor(private node: FiberNode) {}

  private getNodeName(node: FiberNode): string | null {
    switch (typeof node.type) {
      case 'function':
        // The node is a function it will likely have a name
        return getDisplayName(node.type);
      case 'string':
        // The node is likely a tag
        return node.type;
      /* istanbul ignore next */
      default:
        return null;
    }
  }

  private describeSource(): string | null {
    const source = this.node._debugSource;
    if (!source) {
      return null;
    }
    const path = source.fileName;
    const fileName = path.replace(/^(.*)[\\/]/, '');
    return `${fileName}:${source.lineNumber}`;
  }

  private describeOwner(): string | null {
    const owner = this.node._debugOwner;
    if (!owner) {
      return null;
    }
    return this.getNodeName(owner);
  }

  toString(): string {
    const name = this.getNodeName(this.node);
    const source = this.describeSource();
    const ownerName = this.describeOwner();

    let hint = '';
    if (source) {
      hint = ` (at ${source})`;
    } else if (ownerName) {
      hint = ` (created by ${ownerName})`;
    }
    return `\n    in ${name}` + hint;
  }
}

export function captureComponentStack(element: JSX.Element): string {
  return new StackTrace(element as ElementWithOwner).capture();
}
