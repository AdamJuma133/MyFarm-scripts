import { useNativePush } from '@/hooks/use-native-push';

/**
 * Mounts native-only side-effect hooks (push registration, etc.).
 * Must live inside <AuthProvider>. Renders nothing.
 */
export function NativeBridge() {
  useNativePush();
  return null;
}
