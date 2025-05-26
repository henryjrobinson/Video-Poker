// Comprehensive test runner for Video Poker
// Run with: npx tsx run-all-tests.js

// Import the test module that has an export
import { runTests as runPatternCalculatorTests } from './src/lib/pattern-calculator.test.ts';

async function runAllTests() {
  console.log('\n===============================================');
  console.log('🎮 VIDEO POKER FULL TEST SUITE');
  console.log('===============================================\n');
  
  let allTestsPassed = true;
  
  try {
    console.log('🔍 Running Pattern Calculator Tests...');
    console.log('-----------------------------------------------');
    await Promise.resolve(runPatternCalculatorTests());
    console.log('-----------------------------------------------\n');
  } catch (error) {
    console.error('❌ Error in Pattern Calculator Tests:', error);
    allTestsPassed = false;
  }
  
  try {
    console.log('🔍 Running Pattern Functions Tests...');
    console.log('-----------------------------------------------');
    // Import and run the pattern functions test
    const { runTests: runPatternFunctionsTests } = await import('./src/tests/pattern-functions.test.ts');
    await Promise.resolve(runPatternFunctionsTests());
    console.log('-----------------------------------------------\n');
  } catch (error) {
    console.error('❌ Error in Pattern Functions Tests:', error);
    allTestsPassed = false;
  }
  
  // Also run our verification script explicitly
  try {
    console.log('🔍 Running Verification Tests for Fixed Issues...');
    console.log('-----------------------------------------------');
    await import('./verify-fixes.js');
    console.log('-----------------------------------------------\n');
  } catch (error) {
    console.error('❌ Error in Verification Tests:', error);
    allTestsPassed = false;
  }
  
  console.log('===============================================');
  if (allTestsPassed) {
    console.log('✅ ALL TESTS PASSED!');
  } else {
    console.log('❌ SOME TESTS FAILED - See above for details');
  }
  console.log('===============================================\n');
}

// Run all tests
runAllTests();
