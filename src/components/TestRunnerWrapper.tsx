import React from 'react';

/**
 * Production-safe test runner wrapper
 * Conditionally loads the TestRunner component only in development mode
 * Prevents test file imports in production builds
 */
function TestRunnerWrapper() {
  // In production, display an informative message instead of loading test files
  if (import.meta.env.PROD) {
    return (
      <div className="test-runner-placeholder" style={{
        padding: '20px',
        margin: '20px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <h3>Test Runner</h3>
        <p>Test functionality is only available in development mode.</p>
        <p>This helps reduce bundle size and prevent test-related errors in production.</p>
      </div>
    );
  }

  // In development, dynamically import the actual TestRunner
  // This ensures test files are only loaded in development
  const TestRunnerLazy = React.lazy(() => import('./TestRunner'));
  
  return (
    <React.Suspense fallback={<div>Loading test runner...</div>}>
      <TestRunnerLazy />
    </React.Suspense>
  );
}

export default TestRunnerWrapper;
