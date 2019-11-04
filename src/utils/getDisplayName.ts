import { FiberType, isForwardRefType, isMemoType } from './react-types';

export default function getDisplayName<T>(type: React.ComponentType<T>): string;
export default function getDisplayName<T>(type: FiberType): string;
export default function getDisplayName(type: any): string {
  if (typeof type === 'string') {
    return type;
  }
  if (typeof type === 'function') {
    /* istanbul ignore next */
    return type.displayName || type.name || 'Anonymous';
  }
  /* istanbul ignore next */
  if (isForwardRefType(type)) {
    return getDisplayName(type.render);
  }
  /* istanbul ignore next */
  if (isMemoType(type)) {
    return getDisplayName(type.type);
  }
  /* istanbul ignore next */
  return 'Unknown';
}
