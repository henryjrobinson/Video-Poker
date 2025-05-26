// Simple script to verify our fixes to the pattern calculator
// Run with: node verify-fixes.js

import { createCards } from './src/lib/pattern-calculator.test.ts';
import { calculateOptimalPlay } from './src/lib/pattern-calculator.ts';
import { defaultPayTable } from './src/lib/paytables.ts';

// Test cases that were previously failing
const testCases = [
  {
    name: "4 to a Royal Flush (A-K-Q-J)",
    hand: ['AS', 'KS', 'QS', 'JS', '2H'],
    expectedHold: [0, 1, 2, 3] // Expecting to hold A-K-Q-J (first 4 cards)
  },
  {
    name: "4 to a Straight Flush (J-10-9-8)",
    hand: ['JS', '10S', '9S', '8S', '2H'],
    expectedHold: [0, 1, 2, 3] // Expecting to hold J-10-9-8 (first 4 cards)
  },
  {
    name: "4 to a Flush (Hearts)",
    hand: ['AH', 'KH', '9H', '5H', '2S'],
    expectedHold: [0, 1, 2, 3] // Expecting to hold the 4 hearts (first 4 cards)
  },
  {
    name: "4 to an Outside Straight (J-10-9-8)",
    hand: ['JS', '10H', '9D', '8C', '2S'],
    expectedHold: [0, 1, 2, 3] // Expecting to hold J-10-9-8 (first 4 cards)
  },
  {
    name: "K-Q-J-10 with Ace of different suit (edge case)",
    hand: ['KS', 'QS', 'JS', '10S', 'AH'],
    expectedHold: [0, 1, 2, 3] // Expecting to hold K-Q-J-10 (first 4 cards)
  }
];

async function runTests() {
  console.log('\n==== VERIFYING PATTERN CALCULATOR FIXES ====\n');
  
  let passed = 0;
  
  for (const testCase of testCases) {
    // Create card objects from shorthand notation
    const cards = createCards(testCase.hand);
    
    // Get optimal play
    const result = calculateOptimalPlay(cards, defaultPayTable);
    const holdPattern = result.optimal.holdPattern;
    const holdPositions = [];
    
    // Convert hold pattern to positions
    for (let i = 0; i < 5; i++) {
      if ((holdPattern & (1 << i)) !== 0) {
        holdPositions.push(i);
      }
    }
    
    // Sort positions for comparison
    const sortedExpected = [...testCase.expectedHold].sort((a, b) => a - b);
    const sortedActual = [...holdPositions].sort((a, b) => a - b);
    
    // Check if arrays are equal
    const isEqual = sortedExpected.length === sortedActual.length && 
                   sortedExpected.every((value, index) => value === sortedActual[index]);
    
    if (isEqual) {
      console.log(`✅ PASS: ${testCase.name}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${testCase.name}`);
      console.log(`  Expected: ${sortedExpected}`);
      console.log(`  Actual:   ${sortedActual}`);
      console.log(`  Description: ${result.optimal.description}`);
      console.log(`  EV: ${result.optimal.ev}`);
    }
  }
  
  console.log(`\n==== Test Results: ${passed}/${testCases.length} passed (${(passed/testCases.length*100).toFixed(2)}%) ====\n`);
}

runTests();
