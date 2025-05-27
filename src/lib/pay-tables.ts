/**
 * Pay Tables for various Video Poker variants
 * Defines different pay schedules that affect optimal strategy
 */

import { HandRank } from './evaluator';

export interface PayTable {
  [key: number]: number;
  name?: string;
  shortName?: string;
}

// The classic 9/6 Jacks or Better pay table (9x for full house, 6x for flush)
// This is considered the "full pay" version with ~99.54% return
export const JACKS_OR_BETTER_9_6: PayTable = {
  [HandRank.ROYAL_FLUSH]: 800,     // 800x for 5 coins
  [HandRank.STRAIGHT_FLUSH]: 50,   // 50x
  [HandRank.FOUR_OF_A_KIND]: 25,   // 25x
  [HandRank.FULL_HOUSE]: 9,        // 9x
  [HandRank.FLUSH]: 6,             // 6x
  [HandRank.STRAIGHT]: 4,          // 4x
  [HandRank.THREE_OF_A_KIND]: 3,   // 3x
  [HandRank.TWO_PAIR]: 2,          // 2x
  [HandRank.JACKS_OR_BETTER]: 1,   // 1x
  [HandRank.HIGH_CARD]: 0,         // 0x
  name: "Jacks or Better (9/6)",
  shortName: "9/6"
};

// The 8/5 Jacks or Better pay table (~97.3% return)
// Common in many casinos, reduces payouts for full house and flush
export const JACKS_OR_BETTER_8_5: PayTable = {
  [HandRank.ROYAL_FLUSH]: 800,     // 800x for 5 coins
  [HandRank.STRAIGHT_FLUSH]: 50,   // 50x
  [HandRank.FOUR_OF_A_KIND]: 25,   // 25x
  [HandRank.FULL_HOUSE]: 8,        // 8x (reduced)
  [HandRank.FLUSH]: 5,             // 5x (reduced)
  [HandRank.STRAIGHT]: 4,          // 4x
  [HandRank.THREE_OF_A_KIND]: 3,   // 3x
  [HandRank.TWO_PAIR]: 2,          // 2x
  [HandRank.JACKS_OR_BETTER]: 1,   // 1x
  [HandRank.HIGH_CARD]: 0,         // 0x
  name: "Jacks or Better (8/5)",
  shortName: "8/5"
};

// The 7/5 Jacks or Better pay table (~96.3% return)
// Common in many casinos, further reduces full house payout
export const JACKS_OR_BETTER_7_5: PayTable = {
  [HandRank.ROYAL_FLUSH]: 800,     // 800x for 5 coins
  [HandRank.STRAIGHT_FLUSH]: 50,   // 50x
  [HandRank.FOUR_OF_A_KIND]: 25,   // 25x
  [HandRank.FULL_HOUSE]: 7,        // 7x (reduced)
  [HandRank.FLUSH]: 5,             // 5x (reduced)
  [HandRank.STRAIGHT]: 4,          // 4x
  [HandRank.THREE_OF_A_KIND]: 3,   // 3x
  [HandRank.TWO_PAIR]: 2,          // 2x
  [HandRank.JACKS_OR_BETTER]: 1,   // 1x
  [HandRank.HIGH_CARD]: 0,         // 0x
  name: "Jacks or Better (7/5)",
  shortName: "7/5"
};

// The 6/5 Jacks or Better pay table (~95.2% return)
// Poor pay table, but common in some casinos
export const JACKS_OR_BETTER_6_5: PayTable = {
  [HandRank.ROYAL_FLUSH]: 800,     // 800x for 5 coins
  [HandRank.STRAIGHT_FLUSH]: 50,   // 50x
  [HandRank.FOUR_OF_A_KIND]: 25,   // 25x
  [HandRank.FULL_HOUSE]: 6,        // 6x (reduced)
  [HandRank.FLUSH]: 5,             // 5x (reduced)
  [HandRank.STRAIGHT]: 4,          // 4x
  [HandRank.THREE_OF_A_KIND]: 3,   // 3x
  [HandRank.TWO_PAIR]: 2,          // 2x
  [HandRank.JACKS_OR_BETTER]: 1,   // 1x
  [HandRank.HIGH_CARD]: 0,         // 0x
  name: "Jacks or Better (6/5)",
  shortName: "6/5"
};

// Bonus Poker pay table (higher payouts for four aces)
export const BONUS_POKER: PayTable = {
  [HandRank.ROYAL_FLUSH]: 800,     // 800x for 5 coins
  [HandRank.STRAIGHT_FLUSH]: 50,   // 50x
  [HandRank.FOUR_OF_A_KIND]: 80,   // 80x for Aces
  // Note: In actual implementation, we'd need special logic for different 4 of a kind hands
  [HandRank.FULL_HOUSE]: 8,        // 8x
  [HandRank.FLUSH]: 5,             // 5x
  [HandRank.STRAIGHT]: 4,          // 4x
  [HandRank.THREE_OF_A_KIND]: 3,   // 3x
  [HandRank.TWO_PAIR]: 2,          // 2x
  [HandRank.JACKS_OR_BETTER]: 1,   // 1x
  [HandRank.HIGH_CARD]: 0,         // 0x
  name: "Bonus Poker",
  shortName: "BP"
};

// All pay tables in order of preference
export const ALL_PAY_TABLES = [
  JACKS_OR_BETTER_9_6,
  JACKS_OR_BETTER_8_5, 
  JACKS_OR_BETTER_7_5,
  JACKS_OR_BETTER_6_5,
  BONUS_POKER
];

// Set default pay table
export const DEFAULT_PAY_TABLE = JACKS_OR_BETTER_9_6;

/**
 * Calculate the adjusted expected value for a play based on the pay table
 * Different pay tables require slight strategy adjustments
 * 
 * @param baseEV - The base expected value from standard 9/6 calculations
 * @param handType - The type of hand being evaluated
 * @param payTable - The specific pay table being used
 * @returns The adjusted expected value
 */
export function getAdjustedEV(baseEV: number, handType: string, payTable: PayTable): number {
  // If using the standard 9/6 pay table, no adjustment needed
  if (payTable === JACKS_OR_BETTER_9_6) {
    return baseEV;
  }
  
  // Apply specific adjustments based on pay table and hand type
  if (payTable === JACKS_OR_BETTER_8_5 || payTable === JACKS_OR_BETTER_7_5) {
    // With reduced full house and flush payouts, drawing to flushes is slightly less valuable
    if (handType.includes("Flush") && !handType.includes("Royal")) {
      return baseEV * 0.95; // Reduce flush draw EV slightly
    }
    
    // In 8/5 and 7/5 games, the EV gap between low pairs and flush draws narrows
    if (handType.includes("Low Pair") && payTable === JACKS_OR_BETTER_7_5) {
      return baseEV * 1.02; // Boost low pair value slightly in 7/5 games
    }
  }
  
  // For 6/5 games, more significant adjustments
  if (payTable === JACKS_OR_BETTER_6_5) {
    if (handType.includes("Flush") && !handType.includes("Royal")) {
      return baseEV * 0.9; // Reduce flush draw EV more significantly
    }
    
    if (handType.includes("Low Pair")) {
      return baseEV * 1.05; // Boost low pair value more in 6/5 games
    }
  }
  
  // For Bonus Poker, four of a kind draws become more valuable
  if (payTable === BONUS_POKER) {
    if (handType.includes("Three of a Kind")) {
      return baseEV * 1.1; // Increase value of three of a kind (potential four of a kind)
    }
  }
  
  return baseEV;
}
