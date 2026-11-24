import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Soft fade when the page changes. Opacity only, on purpose: a transform here would
 * trap position:fixed and sticky children (headers, bars) inside the page while it animates.
 */
const PageFade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-fade">
      <style>{`
        @keyframes page-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .page-fade { animation: page-fade-in 280ms ease-out both; }
        @media (prefers-reduced-motion: reduce) { .page-fade { animation: none; } }
      `}</style>
      {children}
    </div>
  );
};

export default PageFade;
