/**
 * Tests for the identity-based pattern calculator
 * 
 * These tests focus on verifying that the identity-based approach correctly 
 * identifies which cards to hold, especially for the previously failing test cases.
 */

import { Card, Suit } from '../lib/cards';
import { calculateOptimalPlay } from '../lib/identity-pattern-calculator';
import { defaultPayTable } from '../lib/paytables';
import { cardsAreEqual, describeCards, getCardShortName } from '../lib/card-utils';

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
 * Test case for the identity-based calculator
 */
interface IdentityTestCase {
  name: string;
  hand: string[];
  expectedCardsToHold: string[];
  expectedDescription: string;
}

/**
 * Run a single test case
 */
function runTest(testCase: IdentityTestCase): boolean {
  // Create cards from shorthand notation
  const hand = createCards(testCase.hand);
  const expectedCardsToHold = createCards(testCase.expectedCardsToHold);
  
  // Calculate optimal play
  const result = calculateOptimalPlay(hand, defaultPayTable);
  const cardsToHold = result.optimal.cardsToHold;
  
  // Check if the cards to hold match the expected cards
  let allCardsMatch = true;
  
  // Check count
  if (cardsToHold.length !== expectedCardsToHold.length) {
    allCardsMatch = false;
  } else {
    // Check each card
    for (const expectedCard of expectedCardsToHold) {
      const found = cardsToHold.some(card => cardsAreEqual(card, expectedCard));
      if (!found) {
        allCardsMatch = false;
        break;
      }
    }
  }
  
  // Output result
  if (allCardsMatch) {
    console.log(`✅ PASS: ${testCase.name}`);
    return true;
  } else {
    console.log(`❌ FAIL: ${testCase.name}`);
    console.log(`  Expected: ${expectedCardsToHold.map(getCardShortName).join(', ')}`);
    console.log(`  Actual:   ${cardsToHold.map(getCardShortName).join(', ')}`);
    console.log(`  Description: ${result.optimal.description}`);
    return false;
  }
}

/**
 * Test cases for previously failing scenarios
 */
const testCases: IdentityTestCase[] = [
  {
    name: "4 to a Royal Flush (A-K-Q-J)",
    hand: ['AS', 'KS', 'QS', 'JS', '2H'],
    expectedCardsToHold: ['AS', 'KS', 'QS', 'JS'],
    expectedDescription: "4 to a Royal Flush"
  },
  {
    name: "4 to a Straight Flush (J-10-9-8)",
    hand: ['JS', '10S', '9S', '8S', '2H'],
    expectedCardsToHold: ['JS', '10S', '9S', '8S'],
    expectedDescription: "4 to a Straight Flush"
  },
  {
    name: "4 to a Flush (Hearts)",
    hand: ['AH', 'KH', '9H', '5H', '2S'],
    expectedCardsToHold: ['AH', 'KH', '9H', '5H'],
    expectedDescription: "4 to a Flush"
  },
  {
    name: "4 to an Outside Straight (J-10-9-8)",
    hand: ['JS', '10H', '9D', '8C', '2S'],
    expectedCardsToHold: ['JS', '10H', '9D', '8C'],
    expectedDescription: "4 to an Outside Straight"
  },
  {
    name: "K-Q-J-10 with Ace of different suit (edge case)",
    hand: ['KS', 'QS', 'JS', '10S', 'AH'],
    expectedCardsToHold: ['KS', 'QS', 'JS', '10S'],
    expectedDescription: "4 to a Royal Flush"
  }
];

/**
 * Run all the tests
 */
export function runTests(): { passed: number, failed: number, total: number } {
  console.log('\n==== IDENTITY-BASED CALCULATOR TESTS ====\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    if (runTest(testCase)) {
      passed++;
    } else {
      failed++;
    }
  }
  
  const total = testCases.length;
  console.log(`\n==== Results: ${passed}/${total} passed (${(passed/total*100).toFixed(2)}%) ====\n`);
  
  return { passed, failed, total };
}

// Run the tests when this file is executed directly
runTests();
