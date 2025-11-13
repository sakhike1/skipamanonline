import { createClient, ContentfulApi } from 'contentful';

// Validate environment variables
const validateConfig = () => {
  const requiredVars = [
    'REACT_APP_CONTENTFUL_SPACE_ID',
    'REACT_APP_CONTENTFUL_ACCESS_TOKEN',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Initialize Contentful client
const createContentfulClient = () => {
  validateConfig();
  
  return createClient({
    space: process.env.REACT_APP_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN!,
    environment: process.env.REACT_APP_CONTENTFUL_ENVIRONMENT || 'master',
  });
};

// Initialize preview client for draft content
const createPreviewClient = () => {
  validateConfig();
  
  if (!process.env.REACT_APP_CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
    throw new Error('Preview access token is required for preview client');
  }
  
  return createClient({
    space: process.env.REACT_APP_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.REACT_APP_CONTENTFUL_PREVIEW_ACCESS_TOKEN!,
    environment: process.env.REACT_APP_CONTENTFUL_ENVIRONMENT || 'master',
    host: 'preview.contentful.com',
  });
};

// Export clients
export const contentfulClient = createContentfulClient();
export const previewClient = createPreviewClient();

// Export types
export type { Entry, Asset, ContentfulApi } from 'contentful';

