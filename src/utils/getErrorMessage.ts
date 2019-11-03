import getDisplayName from './getDisplayName';
import captureComponentStack from './captureComponentStack';
import { InstanceMount } from '../types';

export default function getErrorMessage(
  element: JSX.Element,
  firstInstance: InstanceMount,
  usingBoundary: boolean,
) {
  const name = `<${getDisplayName(element.type)}>`;
  const firstInstanceTrace = firstInstance.stackTrace;
  const secondInstanceTrace = captureComponentStack(element);
  let error = '';
  error += `Warning: the component ${name} is expected to be mounted `;
  error += `once, but a second attempt to mount this component was made:\n`;
  error += `${secondInstanceTrace}\n\n`;
  error += 'As a result, the component mounted above will not be rendered. ';
  error += `Note that the first instance of ${name} `;
  error += `${firstInstance.element ? 'is already' : 'was'} mounted`;
  error += usingBoundary ? ' within a boundary:\n' : ':\n';
  error += firstInstanceTrace;
  return error;
}
