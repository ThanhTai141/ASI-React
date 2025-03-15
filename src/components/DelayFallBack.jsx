import { Suspense, useState, useEffect } from 'react';
import propTypes from 'prop-types';

const DelayedFallback = ({ children, fallback, delay = 2000 }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    // Cleanup timer khi component unmount
    return () => clearTimeout(timer);
  }, [delay]);

  return <Suspense fallback={isLoading ? fallback : null}>{children}</Suspense>;
};

DelayedFallback.propTypes = {
  children: propTypes.node,
  fallback: propTypes.node,
  delay: propTypes.number,
};
export default DelayedFallback;