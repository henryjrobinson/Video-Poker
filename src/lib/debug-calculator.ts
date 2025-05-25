/**
 * Debug version of the calculator functions
 * This version includes console logs and simplified calculation to help debug
 */

import { Card } from './cards';
import { evaluateHand, HandRank } from './evaluator';

// Simplified pay table for Jacks or Better (9/6)
export const DEBUG_PAY_TABLE = {
  [HandRank.ROYAL_FLUSH]: 800,
  [HandRank.STRAIGHT_FLUSH]: 50,
  [HandRank.FOUR_OF_A_KIND]: 25,
  [HandRank.FULL_HOUSE]: 9,
  [HandRank.FLUSH]: 6,
  [HandRank.STRAIGHT]: 4,
  [HandRank.THREE_OF_A_KIND]: 3,
  [HandRank.TWO_PAIR]: 2,
  [HandRank.JACKS_OR_BETTER]: 1,
  [HandRank.HIGH_CARD]: 0
};

export interface SimpleHoldResult {
  holdPattern: number;
  ev: number;
  description: string;
}

export interface SimplePlayResult {
  optimal: SimpleHoldResult;
  alternatives: SimpleHoldResult[];
}

/**
 * Generates a human-readable description of a hold pattern
 */
function generateHoldDescription(holdPattern: number): string {
  const positions: number[] = [];
  for (let i = 0; i < 5; i++) {
    if (holdPattern & (1 << i)) {
      positions.push(i + 1);
    }
  }

  if (positions.length === 0) {
    return "Discard all cards";
  } else if (positions.length === 5) {
    return "Hold all cards";
  } else {
    return `Hold card${positions.length > 1 ? 's' : ''} in position${positions.length > 1 ? 's' : ''} ${positions.join(', ')}`;
  }
}

/**
 * Improved version of calculateEV that doesn't do probability calculations
 * but returns more meaningful results for testing
 */
export function calculateSimpleEV(hand: Card[], holdPattern: number): SimpleHoldResult {
  // For testing purposes, we'll use a basic logic that's deterministic but reasonable
  // This won't calculate real probabilities but will give consistent results
  
  // Evaluate the current hand to get a baseline
  const evaluation = evaluateHand(hand);
  const currentRank = evaluation.rank;
  const payoutForCurrentHand = DEBUG_PAY_TABLE[currentRank] || 0;
  
  // If we're holding all cards, just return their current value
  if (holdPattern === 31) { // 11111 in binary
    return {
      holdPattern,
      ev: payoutForCurrentHand,
      description: generateHoldDescription(holdPattern)
    };
  }
  
  // Otherwise, we'll use a simple heuristic:
  // - If holding 4 cards (potentially to a flush/straight/royal), EV is typically higher
  // - If holding 3 of a kind, EV is good
  // - If holding a pair, moderate EV
  // - Otherwise, low EV
  
  // Count how many cards we're holding
  let heldCount = 0;
  for (let i = 0; i < 5; i++) {
    if (holdPattern & (1 << i)) {
      heldCount++;
    }
  }
  
  // Simple heuristic based on current hand and hold pattern
  let estimatedEV = 0;
  
  if (currentRank >= HandRank.JACKS_OR_BETTER && heldCount >= 2) {
    // If we already have a paying hand and are holding most cards
    estimatedEV = payoutForCurrentHand * 0.8;
  } else if (heldCount === 4) {
    // Holding 4 cards has potential for straight/flush/etc.
    estimatedEV = 1.5;
  } else if (heldCount === 3) {
    // Holding 3 cards (potential three of a kind)
    estimatedEV = 1.0;
  } else if (heldCount === 2) {
    // Holding 2 cards (potential pair)
    estimatedEV = 0.5;
  } else if (heldCount === 1) {
    // Holding just one card (high card)
    estimatedEV = 0.3;
  } else {
    // Holding nothing
    estimatedEV = 0.1;
  }
  
  return {
    holdPattern,
    ev: estimatedEV,
    description: generateHoldDescription(holdPattern)
  };
}

/**
 * Improved version of calculateOptimalPlay that gives more reasonable results
 * for testing without doing full probability calculations
 */
export function calculateSimpleOptimalPlay(hand: Card[]): SimplePlayResult {
  // We'll test a few common hold patterns
  const holdPatterns = [
    31,   // 11111 - Hold all cards
    30,   // 11110 - Hold first 4 cards
    15,   // 01111 - Hold last 4 cards
    28,   // 11100 - Hold first 3 cards
    7,    // 00111 - Hold last 3 cards
    24,   // 11000 - Hold first 2 cards
    3,    // 00011 - Hold last 2 cards
    16,   // 10000 - Hold just the first card
    1,    // 00001 - Hold just the last card
    0     // 00000 - Hold nothing
  ];
  
  // Calculate EV for each hold pattern
  const results: SimpleHoldResult[] = [];
  for (const pattern of holdPatterns) {
    results.push(calculateSimpleEV(hand, pattern));
  }
  
  // Sort by EV, highest first
  results.sort((a, b) => b.ev - a.ev);
  
  // The optimal play is the one with the highest EV
  const optimal = results[0];
  
  // Alternatives are the next best options
  const alternatives = results.slice(1, 4); // Take the next 3 best options
  
  return {
    optimal,
    alternatives
  };
}
