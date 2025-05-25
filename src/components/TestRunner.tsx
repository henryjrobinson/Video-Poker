import React, { useState } from 'react';
import { runTests, formatTestResults } from '../tests/test-runner';
import { HandCategory } from '../tests/test-hands';
import { runPatternTests } from '../lib/pattern-calculator.test';
import './TestRunner.css';

interface TestResultsProps {
  results: string;
}

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  if (!results) return null;
  
  // Convert plain text results to formatted JSX
  const lines = results.split('\n');
  
  return (
    <div className="test-results">
      {lines.map((line, index) => {
        if (line.includes('===') && line.includes('===')) {
          // Section header
          return <h3 key={index} className="results-header">{line.replace(/===/g, '')}</h3>;
        } else if (line.includes('Test:')) {
          // Test case header
          return <h4 key={index} className="test-case-header">{line}</h4>;
        } else if (line.includes('Expected Hold:') || line.includes('Actual Hold:')) {
          // Hold pattern line - format specially for alignment
          return (
            <div key={index} className="hold-pattern-line">
              <span className={line.includes('Expected') ? 'expected' : 'actual'}>
                {line}
              </span>
            </div>
          );
        } else if (line.includes('✅')) {
          // Success message
          return <div key={index} className="success-message">{line}</div>;
        } else if (line.includes('❌')) {
          // Error message
          return <div key={index} className="error-message">{line}</div>;
        } else if (line.trim() === '') {
          // Empty line
          return <br key={index} />;
        } else {
          // Regular line
          return <div key={index}>{line}</div>;
        }
      })}
    </div>
  );
};

const TestRunner: React.FC = () => {
  const [results, setResults] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<HandCategory | undefined>(undefined);
  const [testType, setTestType] = useState<'strategy' | 'pattern' | 'all'>('all');
  
  const handleRunTests = () => {
    setIsRunning(true);
    
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      try {
        if (testType === 'strategy' || testType === 'all') {
          const summary = runTests(selectedCategory);
          const formattedResults = formatTestResults(summary);
          setResults(prev => testType === 'all' ? prev + '\n\n' + formattedResults : formattedResults);
        }
        
        if (testType === 'pattern' || testType === 'all') {
          if (testType === 'all') {
            setResults(prev => prev + '\n\n=== PATTERN CALCULATOR TESTS ===\n');
          }
          
          const patternResults = runPatternTests();
          const summaryText = `\n=== PATTERN TEST SUMMARY ===\nTotal tests: ${patternResults.total}\nPassed: ${patternResults.passed} (${Math.round((patternResults.passed / patternResults.total) * 100)}%)\nFailed: ${patternResults.failed}`;
          
          setResults(prev => testType === 'pattern' ? summaryText : prev + '\n' + summaryText);
        }
      } catch (error) {
        setResults(`Error running tests: ${error}`);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };
  
  return (
    <div className="test-runner-container">
      <h2>Video Poker Strategy Test Rig</h2>
      
      <div className="test-controls">
        <div className="test-type-selector">
          <label htmlFor="test-type-select">Test Type:</label>
          <select
            id="test-type-select"
            value={testType}
            onChange={(e) => setTestType(e.target.value as 'strategy' | 'pattern' | 'all')}
          >
            <option value="all">All Tests</option>
            <option value="strategy">Strategy Tests</option>
            <option value="pattern">Pattern Calculator Tests</option>
          </select>
        </div>
        
        {(testType === 'strategy' || testType === 'all') && (
          <div className="category-selector">
            <label htmlFor="category-select">Strategy Category:</label>
            <select 
              id="category-select"
              value={selectedCategory || ''}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCategory(value ? value as HandCategory : undefined);
              }}
            >
              <option value="">All Categories</option>
              {Object.values(HandCategory).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        )}
        
        <button 
          className="run-tests-button"
          onClick={handleRunTests}
          disabled={isRunning}
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>
      
      {results && <TestResults results={results} />}
      
      {!results && (
        <div className="test-instructions">
          <p>This test rig verifies that the poker calculator recommends the optimal hold strategy for various hand scenarios.</p>
          <p>Each test compares our calculated optimal play against established strategy charts.</p>
          <p>Select a category to test specific hand types, or run all tests to verify the entire strategy.</p>
        </div>
      )}
    </div>
  );
};

export default TestRunner;
