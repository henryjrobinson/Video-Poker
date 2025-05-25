/**
 * Pay table configurations for different video poker variants
 */

import { PayTable } from './calculator';

// Jacks or Better (9/6) pay table
export const defaultPayTable: PayTable = {
  0: 0,   // High Card
  1: 1,   // Jacks or Better (1 pair)
  2: 2,   // Two Pair
  3: 3,   // Three of a Kind
  4: 4,   // Straight
  5: 6,   // Flush
  6: 9,   // Full House
  7: 25,  // Four of a Kind
  8: 50,  // Straight Flush
  9: 800  // Royal Flush
};

// Bonus Poker pay table
export const bonusPokerPayTable: PayTable = {
  0: 0,   // High Card
  1: 1,   // Jacks or Better (1 pair)
  2: 2,   // Two Pair
  3: 3,   // Three of a Kind
  4: 4,   // Straight
  5: 5,   // Flush
  6: 8,   // Full House
  7: 25,  // Four of a Kind (standard)
  // Bonus payouts for specific four of a kinds would be handled in code
  8: 50,  // Straight Flush
  9: 800  // Royal Flush
};

// Double Bonus (10/7) pay table
export const doubleBonusPayTable: PayTable = {
  0: 0,   // High Card
  1: 1,   // Jacks or Better (1 pair)
  2: 2,   // Two Pair
  3: 3,   // Three of a Kind
  4: 4,   // Straight
  5: 7,   // Flush
  6: 10,  // Full House
  7: 50,  // Four of a Kind (standard)
  // Bonus payouts for specific four of a kinds would be handled in code
  8: 50,  // Straight Flush
  9: 800  // Royal Flush
};
