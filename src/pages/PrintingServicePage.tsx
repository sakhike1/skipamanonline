import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { PRINTING_SERVICES } from '../data/printingLandingContent';
import PrintingLandingLayout from '../components/printing/PrintingLandingLayout';

export default function PrintingServicePage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug || !PRINTING_SERVICES[slug]) {
    return <Navigate to="/printing" replace />;
  }

  return <PrintingLandingLayout page={PRINTING_SERVICES[slug]} />;
}
