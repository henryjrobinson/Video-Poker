/**
 * Main test runner script for Video Poker tests
 * 
 * This file provides a command-line interface for running various test suites
 * in the project.
 */

import { runAllTestsAndLog } from './test-runner';
import { runPatternTests } from './pattern-functions.test';

// Parse command line arguments
const args = process.argv.slice(2);
const testType = args[0] || 'all';

console.log('=== VIDEO POKER TEST SUITE ===');

switch (testType.toLowerCase()) {
  case 'strategy':
  case 'strategies':
    // Run only the strategy test cases
    console.log('Running strategy tests...');
    runAllTestsAndLog();
    break;
    
  case 'pattern':
  case 'patterns':
    // Run only the pattern detection tests
    console.log('Running pattern detection tests...');
    runPatternTests();
    break;
    
  case 'all':
  default:
    // Run all test suites
    console.log('Running all test suites...');
    runPatternTests();
    console.log('\n');
    runAllTestsAndLog();
    break;
}
