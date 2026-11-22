import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initMarketingAnalyticsFromConsent, trackPageView } from '../../lib/analytics';

/** SPA page views for GA4 + Meta after consent; loads scripts on return visits. */
export default function AnalyticsRouteListener() {
  const location = useLocation();

  useEffect(() => {
    initMarketingAnalyticsFromConsent();
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
}
