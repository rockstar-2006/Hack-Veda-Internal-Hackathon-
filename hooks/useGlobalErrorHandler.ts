/**
 * Global Error Handler Hook
 * Prevents unhandled errors from causing the app to get stuck
 */

import { useEffect } from 'react';

export const useGlobalErrorHandler = () => {
  useEffect(() => {
    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error('Uncaught error:', event.error);
      
      // Prevent the default error behavior which can break the app
      event.preventDefault();
      
      // Log for debugging
      if (typeof window !== 'undefined' && window.navigator) {
        const errorLog = {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          timestamp: new Date().toISOString(),
          userAgent: window.navigator.userAgent,
        };
        console.error('Error Log:', errorLog);
      }
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
};

/**
 * Hook to prevent event handler pile-up
 * Useful for cleaning up after navigation or component unmount
 */
export const useCleanupOnUnmount = (cleanup?: () => void) => {
  useEffect(() => {
    return () => {
      // Clean up any pending operations
      if (cleanup) {
        cleanup();
      }
    };
  }, [cleanup]);
};

/**
 * Hook to handle stuck click handlers
 * Ensures buttons don't get disabled or unresponsive
 */
export const useClickHandler = (callback: () => void | Promise<void>) => {
  return async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      await callback?.();
    } catch (error) {
      console.error('Click handler error:', error);
    }
  };
};
