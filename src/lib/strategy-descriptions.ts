/**
 * Card-Specific Strategy Descriptions
 * 
 * This module provides enhanced strategy descriptions that reference specific cards
 * rather than generic patterns, making it easier for users to understand which cards
 * to hold in each situation.
 */

import { Card } from './cards';
import { describeCards, getCardName } from './card-utils';

/**
 * Generate a card-specific strategy description
 * @param patternName The name of the pattern/strategy
 * @param cardsToHold The specific cards that should be held
 * @returns A detailed description including the specific cards to hold
 */
export function generateCardSpecificDescription(patternName: string, cardsToHold: Card[]): string {
  if (cardsToHold.length === 0) {
    return `Draw 5 new cards - discard everything`;
  }

  // For full hands (royal flush, straight flush, etc.)
  if (['Royal Flush', 'Straight Flush', 'Full House', 'Flush', 'Straight'].includes(patternName)) {
    return `Hold all cards - you have a ${patternName}`;
  }

  // For specific patterns with 4 cards
  if (patternName === '4 to a Royal Flush') {
    return `Hold ${describeCards(cardsToHold)} - drawing for a Royal Flush`;
  }
  
  if (patternName === '4 to a Straight Flush') {
    return `Hold ${describeCards(cardsToHold)} - drawing for a Straight Flush`;
  }

  if (patternName === '4 to a Flush') {
    return `Hold ${describeCards(cardsToHold)} - drawing for a Flush`;
  }

  if (patternName === '4 to an Outside Straight') {
    return `Hold ${describeCards(cardsToHold)} - drawing for an Outside Straight`;
  }

  if (patternName === 'Four of a Kind') {
    return `Hold the four ${cardsToHold[0].rank === 14 ? 'Aces' : 
      cardsToHold[0].rank === 13 ? 'Kings' : 
      cardsToHold[0].rank === 12 ? 'Queens' : 
      cardsToHold[0].rank === 11 ? 'Jacks' : 
      `${cardsToHold[0].rank}s`}`;
  }

  // For Three of a Kind
  if (patternName === 'Three of a Kind') {
    return `Hold the three ${cardsToHold[0].rank === 14 ? 'Aces' : 
      cardsToHold[0].rank === 13 ? 'Kings' : 
      cardsToHold[0].rank === 12 ? 'Queens' : 
      cardsToHold[0].rank === 11 ? 'Jacks' : 
      `${cardsToHold[0].rank}s`}`;
  }

  // For Two Pair
  if (patternName === 'Two Pair') {
    // Group cards by rank to identify the pairs
    const ranks = cardsToHold.reduce((acc, card) => {
      acc[card.rank] = (acc[card.rank] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const pairRanks = Object.keys(ranks)
      .filter(rank => ranks[Number(rank)] === 2)
      .map(Number)
      .sort((a, b) => b - a); // Sort descending
    
    const rankNames = pairRanks.map(rank => 
      rank === 14 ? 'Aces' : 
      rank === 13 ? 'Kings' : 
      rank === 12 ? 'Queens' : 
      rank === 11 ? 'Jacks' : 
      `${rank}s`
    );
    
    return `Hold the pair of ${rankNames[0]} and the pair of ${rankNames[1]}`;
  }

  // For High Pair (Jacks or Better)
  if (patternName === 'High Pair') {
    return `Hold the pair of ${cardsToHold[0].rank === 14 ? 'Aces' : 
      cardsToHold[0].rank === 13 ? 'Kings' : 
      cardsToHold[0].rank === 12 ? 'Queens' : 
      'Jacks'}`;
  }

  // For Low Pair
  if (patternName === 'Low Pair') {
    return `Hold the pair of ${cardsToHold[0].rank === 10 ? 'Tens' : 
      cardsToHold[0].rank === 9 ? 'Nines' : 
      cardsToHold[0].rank === 8 ? 'Eights' : 
      cardsToHold[0].rank === 7 ? 'Sevens' : 
      cardsToHold[0].rank === 6 ? 'Sixes' : 
      cardsToHold[0].rank === 5 ? 'Fives' : 
      cardsToHold[0].rank === 4 ? 'Fours' : 
      cardsToHold[0].rank === 3 ? 'Threes' : 
      'Twos'}`;
  }

  // For 3 to a Royal Flush
  if (patternName === '3 to a Royal Flush') {
    return `Hold ${describeCards(cardsToHold)} - drawing for a Royal Flush`;
  }

  // For high cards
  if (patternName.includes('High Card') || patternName.includes('Suited High Cards')) {
    return `Hold ${describeCards(cardsToHold)} - drawing for high-value combinations`;
  }

  // Default case - just describe the cards to hold
  return `Hold ${describeCards(cardsToHold)}`;
}
