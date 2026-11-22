import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { normalizeUrlPathname } from '../../seo/normalizePath';

/**
 * Redirects odd URLs (mixed slashes, trailing slash) to a single canonical pathname.
 */
const CanonicalPathRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const normalized = normalizeUrlPathname(location.pathname);
    if (normalized !== location.pathname) {
      navigate({ pathname: normalized, search: location.search, hash: location.hash }, { replace: true });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  return null;
};

export default CanonicalPathRedirect;
