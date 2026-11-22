import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { PRINTING_LOCATIONS } from '../data/printingLandingContent';
import PrintingLandingLayout from '../components/printing/PrintingLandingLayout';

export default function PrintingLocationPage() {
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!slug || !PRINTING_LOCATIONS[slug]) {
    return <Navigate to="/printing" replace />;
  }

  return <PrintingLandingLayout page={PRINTING_LOCATIONS[slug]} />;
}
