import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook to safely check if component is mounted before updating state
 * Prevents memory leaks and "Can't perform a React state update on an unmounted component" warnings
 */
export function useIsMounted() {
  const isMounted = useRef(false);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return useCallback(() => isMounted.current, []);
}
