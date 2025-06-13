import { useEffect, useState } from 'react';

/**
 * Breakpoint labels used by the application.
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Default pixel values for breakpoints. You can keep these in sync with your CSS variables
 * (e.g., --bp-mobile, --bp-tablet) once they are defined in `src/styles/settings/_variables.css`.
 */
const MOBILE_MAX = 599; // < 600px
const TABLET_MAX = 1023; // 600px – 1023px

/**
 * Returns the current responsive breakpoint as `'mobile' | 'tablet' | 'desktop'`.
 *
 * The hook listens to the `resize` event and updates the state whenever the
 * viewport crosses a breakpoint threshold.  For SSR or environments without a
 * `window` object, it defaults to `'desktop'`.
 *
 * @example
 * const bp = useBreakpoint();
 * if (bp === 'mobile') {
 *   // render mobile-specific UI
 * }
 */
export default function useBreakpoint(): Breakpoint {
  const getBreakpoint = (): Breakpoint => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width <= MOBILE_MAX) return 'mobile';
    if (width <= TABLET_MAX) return 'tablet';
    return 'desktop';
  };

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint);

  useEffect(() => {
    const handleResize = () => {
      const next = getBreakpoint();
      // Only update state when the label actually changes to avoid unnecessary re-renders.
      setBreakpoint(prev => (prev === next ? prev : next));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}
