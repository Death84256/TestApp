import { useSyncExternalStore } from 'react';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  return useSyncExternalStore(
    (onChange) => {
      const preference = window.matchMedia('(prefers-color-scheme: dark)');
      preference.addEventListener('change', onChange);
      return () => preference.removeEventListener('change', onChange);
    },
    () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    () => 'light',
  );
}
