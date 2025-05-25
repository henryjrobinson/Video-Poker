/**
 * EV Calculator - Calculates expected values for different hold/discard combinations
 */

import { Card, getRemainingDeck } from './cards';
import { evaluateHand, HandRank } from './evaluator';

// Pay table for Jacks or Better (9/6)
export const DEFAULT_PAY_TABLE = {
  [HandRank.ROYAL_FLUSH]: 800,     // 800x for 5 coins
  [HandRank.STRAIGHT_FLUSH]: 50,   // 50x
  [HandRank.FOUR_OF_A_KIND]: 25,   // 25x
  [HandRank.FULL_HOUSE]: 9,        // 9x
  [HandRank.FLUSH]: 6,             // 6x
  [HandRank.STRAIGHT]: 4,          // 4x
  [HandRank.THREE_OF_A_KIND]: 3,   // 3x
  [HandRank.TWO_PAIR]: 2,          // 2x
  [HandRank.JACKS_OR_BETTER]: 1,   // 1x
  [HandRank.HIGH_CARD]: 0          // 0x
};

// Pay table configurations
export interface PayTable {
  [key: number]: number;
}

// Result of EV calculation for a specific hold pattern
export interface HoldResult {
  holdPattern: number;
  ev: number;
  handProbabilities: { [key: number]: number };
  description: string;
}

// Overall result including optimal and alternative plays
export interface PlayResult {
  optimal: HoldResult;
  alternatives: HoldResult[];
}

/**
 * Calculate all possible 5-card combinations from the remaining deck
 */
function getCombinations(cards: Card[], remaining: Card[], positions: number[]): Card[][] {
  // Base case: when all positions are filled
  if (positions.length === 0) {
    return [cards];
  }

  const result: Card[][] = [];
  const pos = positions[0];
  const nextPositions = positions.slice(1);

  for (let i = 0; i < remaining.length; i++) {
    const newCards = [...cards];
    newCards[pos] = remaining[i];
    
    // For next recursive call, remove the card that we just used
    const newRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
    
    const combinations = getCombinations(newCards, newRemaining, nextPositions);
    result.push(...combinations);
  }

  return result;
}

/**
 * Generates a human-readable description of a hold pattern
 */
function generateHoldDescription(holdPattern: number, hand: Card[]): string {
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
 * Calculate the expected value (EV) for a specific hold pattern
 */
export function calculateEV(hand: Card[], holdPattern: number, payTable: PayTable = DEFAULT_PAY_TABLE): HoldResult {
  // Separate held and discarded cards
  const heldCards: Card[] = [];
  const discardPositions: number[] = [];
  
  for (let i = 0; i < 5; i++) {
    if (holdPattern & (1 << i)) {
      heldCards.push(hand[i]);
    } else {
      discardPositions.push(i);
    }
  }
  
  // If holding all cards, EV is just the value of the current hand
  if (discardPositions.length === 0) {
    const evaluation = evaluateHand(hand);
    const payout = payTable[evaluation.rank];
    
    return {
      holdPattern,
      ev: payout,
      handProbabilities: { [evaluation.rank]: 1 },
      description: generateHoldDescription(holdPattern, hand)
    };
  }
  
  // Calculate EV across all possible draws
  const deck = getRemainingDeck(hand);
  let totalEV = 0;
  
  // Track probabilities for different hand types
  const handCounts: { [key: number]: number } = Object.keys(payTable).reduce(
    (acc, key) => ({ ...acc, [key]: 0 }), {}
  );
  
  // Create a template hand with held cards in their positions
  const templateHand: (Card | null)[] = new Array(5).fill(null);
  for (let i = 0; i < 5; i++) {
    if (holdPattern & (1 << i)) {
      templateHand[i] = hand[i];
    }
  }
  
  // Get all possible combinations of drawn cards
  const possibleDraws = getCombinations(
    templateHand as Card[], 
    deck, 
    discardPositions
  );
  
  // Calculate EV as the average payout over all possible draws
  for (const drawnHand of possibleDraws) {
    const evaluation = evaluateHand(drawnHand);
    const payout = payTable[evaluation.rank];
    
    totalEV += payout;
    handCounts[evaluation.rank]++;
  }
  
  // Convert counts to probabilities
  const totalDraws = possibleDraws.length;
  const handProbabilities: { [key: number]: number } = {};
  
  for (const rank in handCounts) {
    handProbabilities[rank] = handCounts[rank] / totalDraws;
  }
  
  return {
    holdPattern,
    ev: totalEV / totalDraws,
    handProbabilities,
    description: generateHoldDescription(holdPattern, hand)
  };
}

/**
 * Calculate the optimal play for a given hand
 */
export function calculateOptimalPlay(hand: Card[], payTable: PayTable = DEFAULT_PAY_TABLE): PlayResult {
  const results: HoldResult[] = [];
  
  // Generate all 32 hold patterns (2^5)
  for (let holdPattern = 0; holdPattern < 32; holdPattern++) {
    const result = calculateEV(hand, holdPattern, payTable);
    results.push(result);
  }
  
  // Sort by EV descending
  results.sort((a, b) => b.ev - a.ev);
  
  return {
    optimal: results[0],
    alternatives: results.slice(1, 4)
  };
}
