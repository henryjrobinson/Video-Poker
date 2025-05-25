/**
 * Video Poker Calculator Core
 * 
 * This module provides the fundamental probability-based calculations for video poker strategy.
 * It is designed to be the single source of truth for both the application and test framework.
 */

import { Card, getRemainingDeck } from './cards';
import { evaluateHand, HandRank } from './evaluator';

// Types
export interface PayTable {
  [key: number]: number;
}

export interface HandProbabilities {
  [rank: number]: number;
}

export interface HoldResult {
  holdPattern: number;
  ev: number;
  handProbabilities: HandProbabilities;
  description: string;
}

export interface PlayResult {
  optimal: HoldResult;
  alternatives: HoldResult[];
}

/**
 * Cache for evaluation results to avoid redundant calculations
 */
const evaluationCache = new Map<string, { rank: number }>();

/**
 * Cache for EV calculations to avoid redundant calculations
 */
const evCache = new Map<string, HoldResult>();

/**
 * Create a unique key for a hand of cards
 */
function getHandKey(cards: Card[]): string {
  return cards
    .sort((a, b) => (a.suit === b.suit) ? b.rank - a.rank : a.suit.localeCompare(b.suit))
    .map(card => `${card.rank}${card.suit}`)
    .join(',');
}

/**
 * Evaluate a hand with caching for performance
 */
function memoizedEvaluateHand(hand: Card[]): { rank: number } {
  const key = getHandKey(hand);
  
  if (evaluationCache.has(key)) {
    return evaluationCache.get(key)!;
  }
  
  const result = evaluateHand(hand);
  evaluationCache.set(key, result);
  return result;
}

/**
 * Generates a human-readable description of a hold pattern
 */
export function generateHoldDescription(holdPattern: number, hand: Card[]): string {
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
 * Generate all possible outcomes for a draw
 * Uses combinatorial algorithm to avoid generating duplicates
 */
function generateDrawCombinations(
  heldCards: Card[],
  discardCount: number,
  remainingDeck: Card[]
): Card[][] {
  // If we're not drawing any cards, return just the held cards
  if (discardCount === 0) {
    return [heldCards];
  }
  
  // If we're drawing all 5 cards, we need to generate all 5-card combinations from the deck
  if (heldCards.length === 0) {
    return generateAllCombinations(remainingDeck, 5);
  }
  
  // Otherwise, we're holding some cards and drawing others
  const combinations = generateAllCombinations(remainingDeck, discardCount);
  
  // Combine held cards with each draw combination
  return combinations.map(drawnCards => {
    // Create a new 5-card hand by placing drawn cards in the discard positions
    const newHand = [...heldCards];
    
    // Add drawn cards to the hand
    for (const card of drawnCards) {
      newHand.push(card);
    }
    
    return newHand;
  });
}

/**
 * Generate all combinations of k elements from an array
 * This is an implementation of the "n choose k" algorithm
 */
function generateAllCombinations<T>(array: T[], k: number): T[][] {
  const result: T[][] = [];
  
  // Recursive helper function
  function combine(start: number, current: T[]): void {
    // If we've selected k elements, add this combination to results
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    
    // If we can't select enough remaining elements to reach k, stop
    if (current.length + (array.length - start) < k) {
      return;
    }
    
    // Try including the current element
    current.push(array[start]);
    combine(start + 1, current);
    current.pop();
    
    // Try excluding the current element
    combine(start + 1, current);
  }
  
  combine(0, []);
  return result;
}

/**
 * Calculate the expected value for a specific hold pattern
 * This is the core calculation function that considers all possible outcomes
 */
export function calculateEV(
  hand: Card[], 
  holdPattern: number, 
  payTable: PayTable
): HoldResult {
  // Check cache first
  const cacheKey = `${getHandKey(hand)}-${holdPattern}-${JSON.stringify(payTable)}`;
  if (evCache.has(cacheKey)) {
    return evCache.get(cacheKey)!;
  }
  
  // Determine which cards are being held
  const heldCards: Card[] = [];
  const discardPositions: number[] = [];
  
  for (let i = 0; i < 5; i++) {
    if (holdPattern & (1 << i)) {
      heldCards.push(hand[i]);
    } else {
      discardPositions.push(i);
    }
  }
  
  // If holding all 5 cards, EV is just the current hand value
  if (discardPositions.length === 0) {
    const evaluation = memoizedEvaluateHand(hand);
    const result = {
      holdPattern,
      ev: payTable[evaluation.rank],
      handProbabilities: { [evaluation.rank]: 1 },
      description: generateHoldDescription(holdPattern, hand)
    };
    evCache.set(cacheKey, result);
    return result;
  }
  
  // Get remaining deck (cards not in the current hand)
  const remainingDeck = getRemainingDeck(hand);
  
  // Generate all possible draw combinations
  const drawCombinations = generateDrawCombinations(
    heldCards,
    discardPositions.length,
    remainingDeck
  );
  
  // Calculate expected value across all possible outcomes
  let totalEV = 0;
  const handProbabilities: {[key: number]: number} = {};
  
  for (const drawnHand of drawCombinations) {
    const evaluation = memoizedEvaluateHand(drawnHand);
    const payout = payTable[evaluation.rank];
    
    // Update our running EV calculation
    totalEV += payout;
    
    // Track hand probabilities for reporting
    handProbabilities[evaluation.rank] = (handProbabilities[evaluation.rank] || 0) + 1;
  }
  
  // Normalize the EV and probabilities
  const drawCount = drawCombinations.length;
  totalEV = totalEV / drawCount;
  
  // Normalize probabilities
  Object.keys(handProbabilities).forEach(rank => {
    handProbabilities[Number(rank)] = handProbabilities[Number(rank)] / drawCount;
  });
  
  const result = {
    holdPattern,
    ev: totalEV,
    handProbabilities,
    description: generateHoldDescription(holdPattern, hand)
  };
  
  evCache.set(cacheKey, result);
  return result;
}

/**
 * Calculate the optimal play for a given hand
 * This evaluates all 32 possible hold patterns and returns them sorted by EV
 */
export function calculateOptimalPlay(hand: Card[], payTable: PayTable): PlayResult {
  const results: HoldResult[] = [];
  
  // Try statistical optimization for hands with too many calculations
  if (shouldUseStatisticalOptimization()) {
    return calculateOptimalPlayStatistical(hand, payTable);
  }
  
  // Generate all 32 possible hold patterns
  for (let holdPattern = 0; holdPattern < 32; holdPattern++) {
    // Skip obviously bad patterns
    if (shouldSkipPattern(hand, holdPattern, payTable)) {
      continue;
    }
    
    const result = calculateEV(hand, holdPattern, payTable);
    results.push(result);
  }
  
  // Sort by EV (highest first)
  results.sort((a, b) => b.ev - a.ev);
  
  // The optimal play is the one with the highest EV
  const optimal = results[0];
  const alternatives = results.slice(1);
  
  return {
    optimal,
    alternatives
  };
}

/**
 * Determines if we should use statistical optimization
 * This is a placeholder - in a full implementation, this would check
 * if the computation is too intensive for exact calculation
 */
function shouldUseStatisticalOptimization(): boolean {
  // For now, always use exact calculation
  return false;
}

/**
 * Determines if a hold pattern can be skipped (optimization)
 * This is a placeholder - in a full implementation, this would
 * check for obviously suboptimal patterns
 */
function shouldSkipPattern(hand: Card[], holdPattern: number, payTable: PayTable): boolean {
  // For now, don't skip any patterns
  return false;
}

/**
 * Use statistical sampling for faster approximation of optimal play
 * This is a placeholder - in a full implementation, this would
 * use statistical methods to approximate the results
 */
function calculateOptimalPlayStatistical(hand: Card[], payTable: PayTable): PlayResult {
  // For now, just return the exact calculation
  // In a full implementation, this would use statistical sampling
  
  const results: HoldResult[] = [];
  
  // Generate all 32 possible hold patterns
  for (let holdPattern = 0; holdPattern < 32; holdPattern++) {
    const result = calculateEV(hand, holdPattern, payTable);
    results.push(result);
  }
  
  // Sort by EV (highest first)
  results.sort((a, b) => b.ev - a.ev);
  
  // The optimal play is the one with the highest EV
  const optimal = results[0];
  const alternatives = results.slice(1);
  
  return {
    optimal,
    alternatives
  };
}

/**
 * Clear all caches - useful for testing
 */
export function clearCalculatorCaches(): void {
  evaluationCache.clear();
  evCache.clear();
}
