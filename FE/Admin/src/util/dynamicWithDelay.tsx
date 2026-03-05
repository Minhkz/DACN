import dynamic from 'next/dynamic';
import type { ComponentType, JSX } from 'react';

/* delay helper */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface DynamicWithDelayOptions {
  delayMs?: number;
  ssr?: boolean;
  loading?: () => JSX.Element;
}

/**
 * dynamic import with artificial delay (dev only friendly)
 */
export function dynamicWithDelay<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
  options?: DynamicWithDelayOptions
) {
  const { delayMs = 0, ssr = false, loading } = options || {};

  return dynamic(
    async () => {
      if (delayMs > 0) {
        await delay(delayMs);
      }
      return loader();
    },
    {
      ssr,
      loading,
    }
  );
}
