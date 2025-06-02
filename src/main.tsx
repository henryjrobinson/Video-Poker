import React, { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ErrorBoundary from './ErrorBoundary'
import AppDiagnostic from './AppDiagnostic'

// Set this to true to use the debug version instead of the main app
const USE_DEBUG_MODE = false;

// For debugging - you can modify this URL parameter to toggle debug mode
if (window.location.search.includes('debug=true')) {
  const AppDebug = lazy(() => import('./App.debug'));
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading debug mode...</div>}>
          <AppDebug />
        </Suspense>
      </ErrorBoundary>
    </StrictMode>
  );
} else {
  // Main application with error boundary
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <AppDiagnostic />
      </ErrorBoundary>
    </StrictMode>
  );
}
