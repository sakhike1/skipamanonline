import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface PrefetchLinkProps extends LinkProps {
  to: string;
  children: React.ReactNode;
  prefetchOnHover?: boolean;
  prefetchOnMount?: boolean;
}

/**
 * Enhanced Link component that prefetches routes on hover
 * Improves perceived performance by loading routes before user clicks
 *
 * TEMP (live hotfix): prefetching disabled to avoid dynamic-import based chunking that caused
 * `vendor <-> react-vendor` circular initialization on the live server.
 */
export const PrefetchLink: React.FC<PrefetchLinkProps> = ({
  to,
  children,
  prefetchOnHover = true,
  prefetchOnMount = false,
  ...props
}) => {
  // Keep props for compatibility, but disable behavior.
  void prefetchOnHover;
  void prefetchOnMount;

  return (
    <Link
      to={to}
      {...props}
    >
      {children}
    </Link>
  );
};

export default PrefetchLink;
















