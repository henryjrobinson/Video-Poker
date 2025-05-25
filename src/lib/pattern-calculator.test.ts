/**
 * Unit tests for the pattern-based calculator
 */

import { Card, Suit, Rank } from './cards';
import { calculateOptimalPlay } from './pattern-calculator';
import { defaultPayTable } from './paytables';

/**
 * Helper function to create cards from shorthand notation
 * Example: ['AS', 'KS', 'QS', 'JS', '10S'] -> [Ace of Spades, King of Spades, ...]
 */
export function createCards(cardCodes: string[]): Card[] {
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
    
    cards.push({ rank: rank as Rank, suit });
  }
  
  return cards;
}

/**
 * Test case for a poker hand
 */
interface PatternTestCase {
  name: string;
  hand: Card[];
  expectedPattern: number;
  expectedDescription: string;
}

/**
 * Convert a string representation to a bit pattern
 * Example: "11001" -> 25 (binary 11001)
 */
function holdPatternFromString(pattern: string): number {
  return parseInt(pattern, 2);
}

/**
 * Format a hold pattern as a readable string
 */
function formatHoldPattern(pattern: number): string {
  return pattern
    .toString(2)
    .padStart(5, '0')
    .split('')
    .join(' ');
}

/**
 * Test cases covering all major pattern detection scenarios
 */
const patternTestCases: PatternTestCase[] = [
  // Made hands (already complete)
  {
    name: 'Royal Flush',
    hand: createCards(['AS', 'KS', 'QS', 'JS', '10S']),
    expectedPattern: holdPatternFromString('11111'),
    expectedDescription: 'Royal Flush'
  },
  {
    name: 'Straight Flush',
    hand: createCards(['9S', '8S', '7S', '6S', '5S']),
    expectedPattern: holdPatternFromString('11111'),
    expectedDescription: 'Straight Flush'
  },
  {
    name: 'Four of a Kind',
    hand: createCards(['AS', 'AD', 'AH', 'AC', 'KS']),
    expectedPattern: holdPatternFromString('11110'),
    expectedDescription: 'Four of a Kind'
  },
  {
    name: 'Full House',
    hand: createCards(['AS', 'AD', 'AC', 'KS', 'KH']),
    expectedPattern: holdPatternFromString('11111'),
    expectedDescription: 'Full House'
  },
  {
    name: 'Flush',
    hand: createCards(['AS', 'KS', '9S', '7S', '3S']),
    expectedPattern: holdPatternFromString('11111'),
    expectedDescription: 'Flush'
  },
  {
    name: 'Straight',
    hand: createCards(['9S', '8D', '7H', '6C', '5S']),
    expectedPattern: holdPatternFromString('11111'),
    expectedDescription: 'Straight'
  },
  {
    name: 'Three of a Kind',
    hand: createCards(['AS', 'AD', 'AC', 'KS', 'QH']),
    expectedPattern: holdPatternFromString('11100'),
    expectedDescription: 'Three of a Kind'
  },
  {
    name: 'Two Pair',
    hand: createCards(['AS', 'AD', 'KS', 'KH', '2C']),
    expectedPattern: holdPatternFromString('11110'),
    expectedDescription: 'Two Pair'
  },
  {
    name: 'High Pair (JJ)',
    hand: createCards(['JS', 'JD', '9S', '7H', '2C']),
    expectedPattern: holdPatternFromString('11000'),
    expectedDescription: 'High Pair (JJ+)'
  },
  
  // Drawing hands (need to draw more cards)
  {
    name: '4 to a Royal Flush',
    hand: createCards(['AS', 'KS', 'QS', 'JS', '2C']),
    expectedPattern: holdPatternFromString('11110'),
    expectedDescription: '4 to Royal Flush'
  },
  {
    name: '4 to a Straight Flush',
    hand: createCards(['JS', '10S', '9S', '8S', 'AH']),
    expectedPattern: holdPatternFromString('11110'),
    expectedDescription: '4 to Straight Flush'
  },
  {
    name: 'Low Pair (55)',
    hand: createCards(['5S', '5D', 'KS', 'QH', 'JC']),
    expectedPattern: holdPatternFromString('11000'),
    expectedDescription: 'Low Pair (22-TT)'
  },
  {
    name: '4 to a Flush',
    hand: createCards(['AS', 'KS', '10S', '7S', '2H']),
    expectedPattern: holdPatternFromString('11110'),
    expectedDescription: '4 to Flush'
  },
  {
    name: '4 to an Outside Straight',
    hand: createCards(['9S', '8D', '7H', '6C', 'AS']),
    expectedPattern: holdPatternFromString('01111'),
    expectedDescription: '4 to Open-Ended Straight'
  },
  {
    name: '3 to a Royal Flush',
    hand: createCards(['AS', 'KS', 'QS', '9H', '2C']),
    expectedPattern: holdPatternFromString('11100'),
    expectedDescription: '3 to Royal Flush'
  },
  {
    name: '2 Suited High Cards',
    hand: createCards(['QS', 'JS', '9H', '7D', '2C']),
    expectedPattern: holdPatternFromString('11000'),
    expectedDescription: '2 Suited High Cards'
  },
  {
    name: 'QJ Unsuited',
    hand: createCards(['QS', 'JH', '9D', '7C', '2S']),
    expectedPattern: holdPatternFromString('11000'),
    expectedDescription: 'QJ Unsuited'
  },
  {
    name: 'One High Card (A)',
    hand: createCards(['AS', '9H', '7D', '5C', '2S']),
    expectedPattern: holdPatternFromString('10000'),
    expectedDescription: 'One High Card'
  },
  {
    name: 'Garbage Hand',
    hand: createCards(['9S', '7H', '5D', '4C', '2S']),
    expectedPattern: holdPatternFromString('00000'),
    expectedDescription: 'Nothing - Draw 5'
  },
  // Edge cases
  {
    name: 'Ace-low Straight',
    hand: createCards(['5S', '4D', '3H', '2C', 'AS']),
    expectedPattern: holdPatternFromString('11111'),
    expectedDescription: 'Straight'
  },
  {
    name: '4 to an Ace-low Straight',
    hand: createCards(['5S', '4D', '3H', '2C', 'KS']),
    expectedPattern: holdPatternFromString('11110'),
    expectedDescription: '4 to Open-Ended Straight'
  }
];

/**
 * Run all pattern detection tests
 */
export function runPatternTests(): { passed: number, failed: number, total: number } {
  console.log('=== PATTERN-BASED CALCULATOR TESTS ===');
  
  let passed = 0;
  let failed = 0;
  
  // Run each test case
  for (const testCase of patternTestCases) {
    const result = calculateOptimalPlay(testCase.hand, defaultPayTable);
    const actualPattern = result.optimal.holdPattern;
    const actualDescription = result.optimal.description;
    
    const patternMatches = actualPattern === testCase.expectedPattern;
    // Some descriptions might vary slightly, so we'll do a loose check
    const descriptionMatches = actualDescription.includes(testCase.expectedDescription) || 
                              testCase.expectedDescription.includes(actualDescription);
    
    if (patternMatches && descriptionMatches) {
      console.log(`✅ ${testCase.name} - PASS`);
      passed++;
    } else {
      console.error(`❌ ${testCase.name} - FAIL`);
      if (!patternMatches) {
        console.error(`   Expected pattern: ${formatHoldPattern(testCase.expectedPattern)}`);
        console.error(`   Actual pattern:   ${formatHoldPattern(actualPattern)}`);
      }
      if (!descriptionMatches) {
        console.error(`   Expected description: ${testCase.expectedDescription}`);
        console.error(`   Actual description:   ${actualDescription}`);
      }
      failed++;
    }
  }
  
  const total = patternTestCases.length;
  const successRate = Math.round((passed / total) * 100);
  
  console.log(`\n=== TEST SUMMARY ===`);
  console.log(`Total tests: ${total}`);
  console.log(`Passed: ${passed} (${successRate}%)`);
  console.log(`Failed: ${failed}`);
  
  return { passed, failed, total };
}

/**
 * Run the tests when this module is imported
 * This can be called from the browser console or included in a test page
 */
export function runTests(): void {
  runPatternTests();
}

/**
 * Function that can be called from the UI to run tests and return HTML results
 */
export function runTestsAndGetHtmlResults(): string {
  // Capture console output
  const originalLog = console.log;
  const originalError = console.error;
  
  let output = [];
  
  console.log = (...args) => {
    originalLog.apply(console, args);
    output.push(`<div>${args.join(' ')}</div>`);
  };
  
  console.error = (...args) => {
    originalError.apply(console, args);
    output.push(`<div class="error">${args.join(' ')}</div>`);
  };
  
  try {
    const results = runPatternTests();
    output.push(`<div class="summary">Total: ${results.total}, Passed: ${results.passed}, Failed: ${results.failed}</div>`);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    output.push(`<div class="error">Test execution error: ${errorMessage}</div>`);
  }
  
  // Restore console
  console.log = originalLog;
  console.error = originalError;
  
  return output.join('\n');
}
