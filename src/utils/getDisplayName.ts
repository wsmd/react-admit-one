export default function getDisplayName<T>(Component: React.ComponentType<T>) {
  return Component.displayName || Component.name || 'Anonymous';
}
