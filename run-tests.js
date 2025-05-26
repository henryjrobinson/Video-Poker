// Simple test runner script
// Using a dynamic import to work with TypeScript files

// Dynamically import the test file
async function runTestSuite() {
  try {
    // Use dynamic import to run the TypeScript test file
    const { runTests } = await import('./src/lib/pattern-calculator.test.ts');
    
    // Run the tests
    console.log('Running pattern calculator tests...');
    runTests();
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

runTestSuite();
