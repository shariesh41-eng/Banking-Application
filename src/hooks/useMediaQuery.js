import { useState, useEffect } from 'react';

export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Hook to match media queries based on screen width
 * @param {string|number} query - Either breakpoint key ('sm', 'md', etc.) or min-width in pixels
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const getMatches = () => {
    if (typeof window === 'undefined') return false;

    let mediaQueryString = query;
    if (typeof query === 'number') {
      mediaQueryString = `(min-width: ${query}px)`;
    } else if (BREAKPOINTS[query]) {
      mediaQueryString = `(min-width: ${BREAKPOINTS[query]}px)`;
    }

    return window.matchMedia(mediaQueryString).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    let mediaQueryString = query;
    if (typeof query === 'number') {
      mediaQueryString = `(min-width: ${query}px)`;
    } else if (BREAKPOINTS[query]) {
      mediaQueryString = `(min-width: ${BREAKPOINTS[query]}px)`;
    }

    const matchMediaList = window.matchMedia(mediaQueryString);
    const handleChange = () => setMatches(matchMediaList.matches);

    // Initial check
    handleChange();

    if (matchMediaList.addEventListener) {
      matchMediaList.addEventListener('change', handleChange);
    } else {
      matchMediaList.addListener(handleChange);
    }

    return () => {
      if (matchMediaList.removeEventListener) {
        matchMediaList.removeEventListener('change', handleChange);
      } else {
        matchMediaList.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Returns convenience screen size flags
 */
export function useResponsive() {
  const isXs = useMediaQuery('xs');
  const isSm = useMediaQuery('sm');
  const isMd = useMediaQuery('md');
  const isLg = useMediaQuery('lg');
  const isXl = useMediaQuery('xl');
  const is2Xl = useMediaQuery('2xl');

  return {
    isMobile: !isMd, // < 768px
    isTablet: isMd && !isLg, // 768px - 1023px
    isDesktop: isLg, // >= 1024px
    isLargeDesktop: isXl, // >= 1280px
    breakpoints: {
      xs: isXs,
      sm: isSm,
      md: isMd,
      lg: isLg,
      xl: isXl,
      '2xl': is2Xl,
    },
  };
}
