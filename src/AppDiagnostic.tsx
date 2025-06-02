import React, { useState, useEffect } from 'react';
import App from './App';

/**
 * Diagnostic wrapper for the main App component
 * Implements progressive rendering and verbose error reporting
 * to diagnose production deployment issues
 */
function AppDiagnostic() {
  const [error, setError] = useState<Error | null>(null);
  const [renderStage, setRenderStage] = useState(0);
  const [componentInfo, setComponentInfo] = useState<Record<string, any>>({});

  // Simulate progressive rendering for diagnostics
  useEffect(() => {
    try {
      console.log('AppDiagnostic: Initial mount');
      
      // Record environment info
      const envInfo = {
        isDevelopment: import.meta.env.DEV,
        mode: import.meta.env.MODE,
        baseUrl: import.meta.env.BASE_URL,
        userAgent: navigator.userAgent,
        windowSize: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toISOString()
      };
      
      console.log('Environment info:', envInfo);
      setComponentInfo(prev => ({ ...prev, environment: envInfo }));
      
      // Progressive rendering stages
      const stageTimers = [
        setTimeout(() => setRenderStage(1), 500),  // After 500ms, show basic UI
        setTimeout(() => setRenderStage(2), 1500)  // After 1.5s, attempt full render
      ];
      
      return () => stageTimers.forEach(timer => clearTimeout(timer));
    } catch (err) {
      console.error('Error in AppDiagnostic setup:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  // Handle caught errors
  if (error) {
    return (
      <div className="error-container" style={{
        padding: '20px',
        margin: '20px auto',
        maxWidth: '800px',
        border: '1px solid #f5c6cb',
        borderRadius: '4px',
        backgroundColor: '#f8d7da',
        color: '#721c24'
      }}>
        <h2>Diagnostic Error</h2>
        <p>An error occurred while initializing the Video Poker Calculator:</p>
        <pre style={{
          whiteSpace: 'pre-wrap',
          backgroundColor: '#f1f1f1',
          padding: '10px',
          borderRadius: '4px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {error.message}
          {error.stack}
        </pre>
        <div style={{ marginTop: '20px' }}>
          <a href="/?debug=true" style={{
            padding: '8px 16px',
            backgroundColor: '#0275d8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            textDecoration: 'none',
            marginRight: '10px'
          }}>
            Launch Debug Mode
          </a>
          <a href="/test.html" style={{
            padding: '8px 16px',
            backgroundColor: '#5cb85c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>
            View Test Page
          </a>
        </div>
      </div>
    );
  }

  // Staging the render process
  if (renderStage === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Loading Video Poker Calculator...</h2>
        <p>Initializing components</p>
      </div>
    );
  }

  if (renderStage === 1) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Video Poker Calculator</h2>
        <p>Preparing advanced strategy calculator...</p>
        <div style={{ marginTop: '20px' }}>
          <div>Environment: {componentInfo.environment?.mode || 'unknown'}</div>
          <div>Base URL: {componentInfo.environment?.baseUrl || '/'}</div>
        </div>
      </div>
    );
  }

  // Full render with wrapped App component
  return (
    <React.Profiler id="AppProfiler" onRender={(id, phase, actualDuration) => {
      console.log(`App render [${phase}]: ${actualDuration.toFixed(2)}ms`);
    }}>
      <div className="diagnostic-wrapper">
        <App />
      </div>
    </React.Profiler>
  );
}

export default AppDiagnostic;
