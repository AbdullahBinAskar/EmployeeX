import { useState, useEffect } from 'react';

function useMatch(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useMediaQuery() {
  const isMobile = useMatch('(max-width: 767px)');
  const isTablet = useMatch('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMatch('(min-width: 1024px)');
  return { isMobile, isTablet, isDesktop };
}
