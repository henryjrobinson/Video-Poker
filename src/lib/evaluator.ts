/**
 * Hand Evaluator - Classifies poker hands and determines their ranking
 */

import { Card } from './cards';

// Hand ranks from highest to lowest
export enum HandRank {
  ROYAL_FLUSH = 9,
  STRAIGHT_FLUSH = 8,
  FOUR_OF_A_KIND = 7,
  FULL_HOUSE = 6,
  FLUSH = 5,
  STRAIGHT = 4,
  THREE_OF_A_KIND = 3,
  TWO_PAIR = 2,
  JACKS_OR_BETTER = 1,
  HIGH_CARD = 0
}

// Result of hand evaluation
export interface HandEvaluation {
  rank: HandRank;
  name: string;
  kickers?: number[]; // Additional info for breaking ties
}

/**
 * Evaluates a 5-card poker hand and returns its rank
 */
export function evaluateHand(cards: Card[]): HandEvaluation {
  if (cards.length !== 5) {
    throw new Error('Hand must contain exactly 5 cards');
  }

  // Check for flush
  const isFlush = cards.every(card => card.suit === cards[0].suit);
  
  // Sort cards by rank (descending)
  const sortedCards = [...cards].sort((a, b) => b.rank - a.rank);
  
  // Check for straight
  let isStraight = true;
  for (let i = 1; i < sortedCards.length; i++) {
    if (sortedCards[i-1].rank !== sortedCards[i].rank + 1) {
      isStraight = false;
      break;
    }
  }
  
  // Special case for A-5-4-3-2 straight
  if (!isStraight && sortedCards[0].rank === 14) {
    isStraight = sortedCards[1].rank === 5 && 
                 sortedCards[2].rank === 4 && 
                 sortedCards[3].rank === 3 && 
                 sortedCards[4].rank === 2;
  }

  // Check for royal flush
  if (isFlush && isStraight && sortedCards[0].rank === 14 && sortedCards[4].rank === 10) {
    return { rank: HandRank.ROYAL_FLUSH, name: 'Royal Flush' };
  }

  // Check for straight flush
  if (isFlush && isStraight) {
    return { rank: HandRank.STRAIGHT_FLUSH, name: 'Straight Flush' };
  }

  // Count the occurrences of each rank
  const rankCounts = new Map<number, number>();
  for (const card of cards) {
    rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
  }

  // Convert to array for easier sorting
  const counts = Array.from(rankCounts.entries()).sort((a, b) => {
    // Sort by count (descending), then by rank (descending)
    if (b[1] !== a[1]) return b[1] - a[1];
    return b[0] - a[0];
  });

  // Check for four of a kind
  if (counts[0][1] === 4) {
    return { 
      rank: HandRank.FOUR_OF_A_KIND, 
      name: 'Four of a Kind', 
      kickers: [counts[1][0]] 
    };
  }

  // Check for full house
  if (counts[0][1] === 3 && counts[1][1] === 2) {
    return { 
      rank: HandRank.FULL_HOUSE, 
      name: 'Full House', 
      kickers: [counts[0][0], counts[1][0]] 
    };
  }

  // Check for flush
  if (isFlush) {
    return { 
      rank: HandRank.FLUSH, 
      name: 'Flush', 
      kickers: sortedCards.map(card => card.rank) 
    };
  }

  // Check for straight
  if (isStraight) {
    return { 
      rank: HandRank.STRAIGHT, 
      name: 'Straight', 
      kickers: [sortedCards[0].rank] 
    };
  }

  // Check for three of a kind
  if (counts[0][1] === 3) {
    return { 
      rank: HandRank.THREE_OF_A_KIND, 
      name: 'Three of a Kind', 
      kickers: [counts[0][0], counts[1][0], counts[2][0]] 
    };
  }

  // Check for two pair
  if (counts[0][1] === 2 && counts[1][1] === 2) {
    return { 
      rank: HandRank.TWO_PAIR, 
      name: 'Two Pair', 
      kickers: [counts[0][0], counts[1][0], counts[2][0]] 
    };
  }

  // Check for jacks or better (pair of jacks, queens, kings, or aces)
  if (counts[0][1] === 2 && counts[0][0] >= 11) {
    return { 
      rank: HandRank.JACKS_OR_BETTER, 
      name: 'Jacks or Better', 
      kickers: [counts[0][0], counts[1][0], counts[2][0], counts[3][0]] 
    };
  }

  // Check for pair (but less than jacks)
  if (counts[0][1] === 2) {
    return { 
      rank: HandRank.HIGH_CARD, 
      name: 'Pair', 
      kickers: [counts[0][0], counts[1][0], counts[2][0], counts[3][0]] 
    };
  }

  // High card
  return { 
    rank: HandRank.HIGH_CARD, 
    name: 'High Card', 
    kickers: sortedCards.map(card => card.rank) 
  };
}
