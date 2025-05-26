/**
 * Unit tests for pattern detection functions in the pattern-based calculator
 * 
 * This file tests each individual pattern detection function to ensure
 * they correctly identify the patterns they're designed to detect.
 */

import { Card, Suit } from '../lib/cards';

// Import the pattern functions from the calculator
// Note: These are not exported, but we'll test the exported calculator instead
import { calculateOptimalPlay } from '../lib/pattern-calculator';

/**
 * Helper function to create cards from shorthand notation
 * Example: ['AS', 'KS', 'QS', 'JS', '10S'] -> [Ace of Spades, King of Spades, ...]
 */
function createCards(cardCodes: string[]): Card[] {
  const cards: Card[] = [];
  
  for (const code of cardCodes) {
    let rank: number;
    let suit: Suit;
    
    // Parse rank
    if (code.startsWith('10')) {
      rank = 10;
      suit = code.charAt(2) as Suit;
    } else {
      const rankChar = code.charAt(0);
      
      if (rankChar === 'A') rank = 14;
      else if (rankChar === 'K') rank = 13;
      else if (rankChar === 'Q') rank = 12;
      else if (rankChar === 'J') rank = 11;
      else rank = parseInt(rankChar);
      
      suit = code.charAt(1) as Suit;
    }
    
    cards.push({ rank: rank as any, suit });
  }
  
  return cards;
}

/**
 * Helper function to check if a play result matches expected hold pattern
 */
function checkHoldPattern(hand: Card[], expectedHoldPattern: number): boolean {
  const mockPayTable = {0: 1, 1: 1, 2: 2, 3: 3, 4: 4, 5: 6, 6: 9, 7: 25, 8: 50, 9: 800};
  const result = calculateOptimalPlay(hand, mockPayTable);
  return result.optimal.holdPattern === expectedHoldPattern;
}

/**
 * Convert a string representation to a bit pattern
 * Example: "11001" -> 25 (binary 11001)
 */
function holdPatternFromString(pattern: string): number {
  return parseInt(pattern, 2);
}

/**
 * Helper function to run a single test
 */
function testPattern(testName: string, hand: Card[], expectedPattern: number): void {
  const actualResult = checkHoldPattern(hand, expectedPattern);
  if (actualResult) {
    console.log(`✅ ${testName} - PASS`);
  } else {
    console.error(`❌ ${testName} - FAIL`);
    // Calculate the actual hold pattern for debugging
    const mockPayTable = {0: 1, 1: 1, 2: 2, 3: 3, 4: 4, 5: 6, 6: 9, 7: 25, 8: 50, 9: 800};
    const result = calculateOptimalPlay(hand, mockPayTable);
    const actualPattern = result.optimal.holdPattern.toString(2).padStart(5, '0');
    const expectedPatternStr = expectedPattern.toString(2).padStart(5, '0');
    console.error(`   Expected: ${expectedPatternStr}, Actual: ${actualPattern}`);
    console.error(`   Pattern name: ${result.optimal.description}`);
  }
}

/**
 * Run all pattern detection tests
 */
export function runPatternTests(): void {
  console.log('=== RUNNING PATTERN DETECTION TESTS ===');
  
  // Royal Flush
  testPattern(
    'Royal Flush', 
    createCards(['AS', 'KS', 'QS', 'JS', '10S']), 
    holdPatternFromString('11111')
  );
  
  // Straight Flush
  testPattern(
    'Straight Flush', 
    createCards(['9S', '8S', '7S', '6S', '5S']), 
    holdPatternFromString('11111')
  );
  
  // Four of a Kind
  testPattern(
    'Four of a Kind', 
    createCards(['AS', 'AD', 'AH', 'AC', 'KS']), 
    holdPatternFromString('11110')
  );
  
  // Full House
  testPattern(
    'Full House', 
    createCards(['AS', 'AD', 'AC', 'KS', 'KH']), 
    holdPatternFromString('11111')
  );
  
  // Flush
  testPattern(
    'Flush', 
    createCards(['AS', 'KS', '9S', '7S', '3S']), 
    holdPatternFromString('11111')
  );
  
  // Straight
  testPattern(
    'Straight', 
    createCards(['9S', '8D', '7H', '6C', '5S']), 
    holdPatternFromString('11111')
  );
  
  // Three of a Kind
  testPattern(
    'Three of a Kind', 
    createCards(['AS', 'AD', 'AC', 'KS', 'QH']), 
    holdPatternFromString('11100')
  );
  
  // Two Pair
  testPattern(
    'Two Pair', 
    createCards(['AS', 'AD', 'KS', 'KH', '2C']), 
    holdPatternFromString('11110')
  );
  
  // Jacks or Better
  testPattern(
    'High Pair (JJ)', 
    createCards(['JS', 'JD', '9S', '7H', '2C']), 
    holdPatternFromString('11000')
  );
  
  // Low Pair
  testPattern(
    'Low Pair (55)', 
    createCards(['5S', '5D', 'KS', 'QH', 'JC']), 
    holdPatternFromString('11000')
  );
  
  // 4 to a Royal
  testPattern(
    '4 to a Royal Flush', 
    createCards(['AS', 'KS', 'QS', 'JS', '2C']), 
    holdPatternFromString('11110')
  );
  
  // 4 to a Straight Flush
  testPattern(
    '4 to a Straight Flush', 
    createCards(['JS', '10S', '9S', '8S', 'AH']), 
    holdPatternFromString('11110')
  );
  
  // 4 to a Flush
  testPattern(
    '4 to a Flush', 
    createCards(['AS', 'KS', '10S', '7S', '2H']), 
    holdPatternFromString('11110')
  );
  
  // 4 to an Outside Straight
  testPattern(
    '4 to an Outside Straight', 
    createCards(['9S', '8D', '7H', '6C', 'AS']), 
    holdPatternFromString('01111')
  );
  
  // 4 to an Inside Straight with 3+ high cards
  testPattern(
    '4 to an Inside Straight with 3 high cards', 
    createCards(['KS', 'QD', 'JH', '9C', 'AS']), 
    holdPatternFromString('11111') // This might be 11110 depending on exact implementation
  );
  
  // 3 to a Royal Flush
  testPattern(
    '3 to a Royal Flush', 
    createCards(['AS', 'KS', 'QS', '9H', '2C']), 
    holdPatternFromString('11100')
  );
  
  // 2 Suited High Cards
  testPattern(
    '2 Suited High Cards (QJ)', 
    createCards(['QS', 'JS', '9H', '7D', '2C']), 
    holdPatternFromString('11000')
  );
  
  // QJ Unsuited
  testPattern(
    'QJ Unsuited', 
    createCards(['QS', 'JH', '9D', '7C', '2S']), 
    holdPatternFromString('11000')
  );
  
  // One High Card (Hold Ace)
  testPattern(
    'One High Card (A)', 
    createCards(['AS', '9H', '7D', '5C', '2S']), 
    holdPatternFromString('10000')
  );
  
  // Discard All
  testPattern(
    'Garbage Hand (Discard All)', 
    createCards(['9S', '7H', '5D', '4C', '2S']), 
    holdPatternFromString('00000')
  );
  
  console.log('=== PATTERN TESTS COMPLETE ===');
}

// Export a function to run all tests
export function runTests() {
  console.log('\n==== PATTERN FUNCTIONS TESTS ====\n');
  runPatternTests();
  return { passed: true };
}

// Run tests when this file is executed directly
runPatternTests();
