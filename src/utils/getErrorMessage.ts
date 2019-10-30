import getDisplayName from './getDisplayName';
import { captureComponentStack } from './captureComponentStack';
import { InstanceMount } from '../types';

export default function getErrorMessage(
  element: JSX.Element,
  firstInstance: InstanceMount,
  usingBoundary: boolean,
) {
  const displayName = `<${getDisplayName(element.type)}>`;
  let error = '';
  error += `An attempt to render ${displayName} was made:\n`;
  error += captureComponentStack(element);
  error += `\n\nThe component ${displayName} `;
  error += `${firstInstance.element ? 'is already' : 'was'} rendered`;
  error += usingBoundary ? ' within a boundary:\n' : ':\n';
  error += firstInstance.stackTrace;
  return error;
}
