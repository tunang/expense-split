import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const ScrollToTop = (smooth = false ) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    if (smooth) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Instant scroll to top for better performance on page changes
      window.scrollTo(0, 0);
    }
  }, [pathname, smooth]);

  return null;
};

export default ScrollToTop; 