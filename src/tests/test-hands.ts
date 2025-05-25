import { Card, Suit } from '../lib/cards';

/**
 * Test case for a poker hand
 */
export interface TestCase {
  id: string;
  description: string;
  hand: Card[];
  optimalHoldPattern: number; // Bit pattern for optimal hold (1 for hold, 0 for discard)
  expectedEV: number; // Expected value for optimal play
  category: HandCategory;
}

/**
 * Categories of test hands to organize our test cases
 */
export enum HandCategory {
  HIGH_CARDS = 'High Cards',
  ONE_PAIR = 'One Pair',
  TWO_PAIR = 'Two Pair',
  THREE_OF_A_KIND = 'Three of a Kind',
  STRAIGHT = 'Straight',
  FLUSH = 'Flush',
  FULL_HOUSE = 'Full House',
  FOUR_OF_A_KIND = 'Four of a Kind',
  STRAIGHT_FLUSH = 'Straight Flush',
  ROYAL_FLUSH = 'Royal Flush',
  NEAR_ROYAL = 'Near Royal Flush',
  NEAR_STRAIGHT_FLUSH = 'Near Straight Flush',
  NEAR_FLUSH = 'Near Flush',
  NEAR_STRAIGHT = 'Near Straight',
  EDGE_CASES = 'Edge Cases'
}

/**
 * Helper function to convert a string representation to a bit pattern
 * Example: "11001" -> 25 (binary 11001)
 */
function holdPatternFromString(pattern: string): number {
  return parseInt(pattern, 2);
}

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
 * Test cases for Jacks or Better (9/6 pay table)
 * Based on standard strategy charts
 */
export const testCases: TestCase[] = [
  // Royal Flush - always hold
  {
    id: 'royal-1',
    description: 'Royal Flush',
    hand: createCards(['AS', 'KS', 'QS', 'JS', '10S']),
    optimalHoldPattern: holdPatternFromString('11111'),
    expectedEV: 800, // Max payout for Royal Flush
    category: HandCategory.ROYAL_FLUSH
  },
  
  // Straight Flush - always hold
  {
    id: 'sf-1',
    description: 'Straight Flush (9-K)',
    hand: createCards(['KS', 'QS', 'JS', '10S', '9S']),
    optimalHoldPattern: holdPatternFromString('11111'),
    expectedEV: 50,
    category: HandCategory.STRAIGHT_FLUSH
  },
  
  // Four of a Kind - always hold
  {
    id: '4kind-1',
    description: 'Four Aces',
    hand: createCards(['AS', 'AD', 'AC', 'AH', 'KS']),
    optimalHoldPattern: holdPatternFromString('11110'),
    expectedEV: 25,
    category: HandCategory.FOUR_OF_A_KIND
  },
  
  // Full House - always hold
  {
    id: 'full-1',
    description: 'Full House (Aces over Kings)',
    hand: createCards(['AS', 'AD', 'AC', 'KS', 'KH']),
    optimalHoldPattern: holdPatternFromString('11111'),
    expectedEV: 9,
    category: HandCategory.FULL_HOUSE
  },
  
  // Flush - always hold
  {
    id: 'flush-1',
    description: 'Flush (Hearts)',
    hand: createCards(['AH', '9H', '7H', '5H', '2H']),
    optimalHoldPattern: holdPatternFromString('11111'),
    expectedEV: 6,
    category: HandCategory.FLUSH
  },
  
  // Straight - always hold
  {
    id: 'straight-1',
    description: 'Straight (A-5)',
    hand: createCards(['AS', '2D', '3C', '4H', '5S']),
    optimalHoldPattern: holdPatternFromString('11111'),
    expectedEV: 4,
    category: HandCategory.STRAIGHT
  },
  
  // Three of a Kind - hold just the three
  {
    id: '3kind-1',
    description: 'Three Aces with King and Queen',
    hand: createCards(['AS', 'AD', 'AC', 'KS', 'QH']),
    optimalHoldPattern: holdPatternFromString('11100'),
    expectedEV: 3.4, // Approximate EV
    category: HandCategory.THREE_OF_A_KIND
  },
  
  // Two Pair - hold both pairs
  {
    id: '2pair-1',
    description: 'Two Pair (Aces and Kings)',
    hand: createCards(['AS', 'AD', 'KS', 'KH', 'QH']),
    optimalHoldPattern: holdPatternFromString('11110'),
    expectedEV: 2.6, // Approximate EV
    category: HandCategory.TWO_PAIR
  },
  
  // High Pair (Jacks or Better) - hold the pair
  {
    id: 'pair-1',
    description: 'Pair of Aces',
    hand: createCards(['AS', 'AD', 'KS', 'QH', '2C']),
    optimalHoldPattern: holdPatternFromString('11000'),
    expectedEV: 1.54, // Approximate EV
    category: HandCategory.ONE_PAIR
  },
  
  // Low Pair - hold the pair
  {
    id: 'pair-2',
    description: 'Pair of Tens',
    hand: createCards(['10S', '10D', 'KS', 'QH', '2C']),
    optimalHoldPattern: holdPatternFromString('11000'),
    expectedEV: 1.42, // Approximate EV
    category: HandCategory.ONE_PAIR
  },
  
  // 4 to a Royal Flush - hold the 4 cards
  {
    id: 'near-royal-1',
    description: '4 to a Royal Flush (A-K-Q-J)',
    hand: createCards(['AS', 'KS', 'QS', 'JS', '2C']),
    optimalHoldPattern: holdPatternFromString('11110'),
    expectedEV: 18.6, // Approximate EV
    category: HandCategory.NEAR_ROYAL
  },
  
  // 4 to a Straight Flush - hold the 4 cards
  {
    id: 'near-sf-1',
    description: '4 to a Straight Flush (J-10-9-8)',
    hand: createCards(['JS', '10S', '9S', '8S', 'AH']),
    optimalHoldPattern: holdPatternFromString('11110'),
    expectedEV: 8.7, // Approximate EV
    category: HandCategory.NEAR_STRAIGHT_FLUSH
  },
  
  // 4 to a Flush - hold the 4 cards
  {
    id: 'near-flush-1',
    description: '4 to a Flush (Hearts)',
    hand: createCards(['AH', 'KH', 'QH', '5H', '2C']),
    optimalHoldPattern: holdPatternFromString('11110'),
    expectedEV: 1.3, // Approximate EV
    category: HandCategory.NEAR_FLUSH
  },
  
  // 4 to an Outside Straight - hold the 4 cards
  {
    id: 'near-straight-1',
    description: '4 to an Outside Straight (J-10-9-8)',
    hand: createCards(['JS', '10D', '9C', '8H', 'AH']),
    optimalHoldPattern: holdPatternFromString('11110'),
    expectedEV: 0.9, // Approximate EV
    category: HandCategory.NEAR_STRAIGHT
  },
  
  // Interesting edge case: hold high cards or go for the straight?
  {
    id: 'edge-1',
    description: 'K-Q-J-10 with Ace of different suit',
    hand: createCards(['KS', 'QS', 'JS', '10S', 'AD']),
    optimalHoldPattern: holdPatternFromString('11110'),
    expectedEV: 3.4, // Approximate EV - better to go for the royal
    category: HandCategory.EDGE_CASES
  },
  
  // Edge case: low pair or 4 to a flush?
  {
    id: 'edge-2',
    description: 'Pair of 2s with 3 cards to a flush',
    hand: createCards(['2S', '2D', 'AS', 'KS', 'QS']),
    optimalHoldPattern: holdPatternFromString('00111'),
    expectedEV: 2.1, // Approximate EV - better to go for the flush
    category: HandCategory.EDGE_CASES
  }
];

// Export a function to get test cases by category
export function getTestCasesByCategory(category?: HandCategory): TestCase[] {
  if (!category) return testCases;
  return testCases.filter(tc => tc.category === category);
}
