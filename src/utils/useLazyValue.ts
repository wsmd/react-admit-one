import { useRef } from 'react';

const UNINITIALIZED_VALUE = {};

export default function useLazyValue<T>(getValue: () => T): T {
  const ref = useRef<T>(UNINITIALIZED_VALUE as T);
  if (ref.current === UNINITIALIZED_VALUE) {
    ref.current = getValue();
  }
  return ref.current as T;
}
