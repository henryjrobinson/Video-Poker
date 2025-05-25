import { calculateOptimalPlay } from '../lib/pattern-calculator';
import { testCases, TestCase, HandCategory, getTestCasesByCategory } from './test-hands';
import { defaultPayTable } from '../lib/paytables';

/**
 * Results from running a test case
 */
interface TestResult {
  testCase: TestCase;
  actualHoldPattern: number;
  actualEV: number;
  passed: boolean;
  evDifference: number;
}

/**
 * Summary results for a test run
 */
interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
  resultsByCategory: Record<string, {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    passRate: number;
  }>;
  results: TestResult[];
}

/**
 * Formats a bit pattern as a human-readable string (e.g., 10101 -> "1 0 1 0 1")
 */
function formatHoldPattern(pattern: number): string {
  return pattern
    .toString(2)
    .padStart(5, '0')
    .split('')
    .join(' ');
}

/**
 * Run a single test case and return the result
 */
function runTestCase(testCase: TestCase): TestResult {
  // Get the actual result using our pattern-based calculator
  const result = calculateOptimalPlay(testCase.hand, defaultPayTable);
  
  const actualHoldPattern = result.optimal.holdPattern;
  const actualEV = result.optimal.ev;
  
  // Determine if the test passed
  // We check both the hold pattern and the EV (within a small margin of error for floating point)
  const holdPatternMatches = actualHoldPattern === testCase.optimalHoldPattern;
  const evCloseEnough = Math.abs(actualEV - testCase.expectedEV) < 0.1;
  
  const passed = holdPatternMatches && evCloseEnough;
  
  return {
    testCase,
    actualHoldPattern,
    actualEV,
    passed,
    evDifference: actualEV - testCase.expectedEV
  };
}

/**
 * Run all test cases or a subset by category and return summary results
 */
export function runTests(category?: HandCategory): TestSummary {
  const casesToRun = category ? getTestCasesByCategory(category) : testCases;
  const results: TestResult[] = [];
  
  // Run each test case
  for (const testCase of casesToRun) {
    const result = runTestCase(testCase);
    results.push(result);
  }
  
  // Calculate overall statistics
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;
  const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  
  // Calculate statistics by category
  const resultsByCategory: Record<string, {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    passRate: number;
  }> = {};
  
  // Group results by category
  for (const result of results) {
    const category = result.testCase.category;
    
    if (!resultsByCategory[category]) {
      resultsByCategory[category] = {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        passRate: 0
      };
    }
    
    resultsByCategory[category].totalTests++;
    
    if (result.passed) {
      resultsByCategory[category].passedTests++;
    } else {
      resultsByCategory[category].failedTests++;
    }
    
    resultsByCategory[category].passRate = 
      (resultsByCategory[category].passedTests / resultsByCategory[category].totalTests) * 100;
  }
  
  return {
    totalTests,
    passedTests,
    failedTests,
    passRate,
    resultsByCategory,
    results
  };
}

/**
 * Format test results for display
 */
export function formatTestResults(summary: TestSummary): string {
  let output = `
=== VIDEO POKER STRATEGY TEST RESULTS ===
Total Tests: ${summary.totalTests}
Passed: ${summary.passedTests} (${summary.passRate.toFixed(2)}%)
Failed: ${summary.failedTests}

=== RESULTS BY CATEGORY ===
`;

  // Add category breakdowns
  for (const [category, stats] of Object.entries(summary.resultsByCategory)) {
    output += `${category}: ${stats.passedTests}/${stats.totalTests} (${stats.passRate.toFixed(2)}%)\n`;
  }
  
  // Add detailed results for failed tests
  const failedResults = summary.results.filter(r => !r.passed);
  
  if (failedResults.length > 0) {
    output += `\n=== FAILED TESTS ===\n`;
    
    for (const result of failedResults) {
      output += `
Test: ${result.testCase.description} (${result.testCase.id})
Category: ${result.testCase.category}
Expected Hold: ${formatHoldPattern(result.testCase.optimalHoldPattern)}
Actual Hold:   ${formatHoldPattern(result.actualHoldPattern)}
Expected EV: ${result.testCase.expectedEV.toFixed(2)}
Actual EV:   ${result.actualEV.toFixed(2)}
EV Difference: ${result.evDifference.toFixed(2)}
`;
    }
  }
  
  return output;
}

/**
 * Run all tests and log the results to the console
 */
export function runAllTestsAndLog(): void {
  console.log('Running Video Poker strategy tests...');
  const summary = runTests();
  console.log(formatTestResults(summary));
  
  if (summary.failedTests === 0) {
    console.log('✅ All tests passed!');
  } else {
    console.log(`❌ ${summary.failedTests} tests failed!`);
  }
}
