/**
 * Card Utilities - Enhanced functions for working with cards in a user-friendly way
 * This supports our card identity-based approach to strategy
 */

import { Card, Suit, Rank, cardToString } from './cards';

// Full names for suits
export const SUIT_NAMES: Record<Suit, string> = {
  'S': 'Spades',
  'H': 'Hearts',
  'D': 'Diamonds',
  'C': 'Clubs'
};

// Full names for ranks
export const RANK_NAMES: Record<Rank, string> = {
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Jack',
  12: 'Queen',
  13: 'King',
  14: 'Ace'
};

/**
 * Get a user-friendly name for a card (e.g., "Ace of Hearts")
 * @param card The card to get a name for
 * @returns A human-readable name for the card
 */
export function getCardName(card: Card): string {
  return `${RANK_NAMES[card.rank]} of ${SUIT_NAMES[card.suit]}`;
}

/**
 * Get a shorter name for a card (e.g., "A♥")
 * @param card The card to get a short name for
 * @returns A short name for the card
 */
export function getCardShortName(card: Card): string {
  const rankSymbols: Record<Rank, string> = {
    2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
    11: 'J', 12: 'Q', 13: 'K', 14: 'A'
  };
  
  const suitSymbols: Record<Suit, string> = {
    'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣'
  };
  
  return `${rankSymbols[card.rank]}${suitSymbols[card.suit]}`;
}

/**
 * Check if two cards are the same
 * @param card1 First card
 * @param card2 Second card
 * @returns True if the cards have the same rank and suit
 */
export function cardsAreEqual(card1: Card, card2: Card): boolean {
  return card1.rank === card2.rank && card1.suit === card2.suit;
}

/**
 * Check if a card exists in an array of cards
 * @param card The card to check for
 * @param cards The array of cards to search
 * @returns True if the card exists in the array
 */
export function cardExistsIn(card: Card, cards: Card[]): boolean {
  return cards.some(c => cardsAreEqual(c, card));
}

/**
 * Filter an array of cards to only include those matching a specific suit
 * @param cards Array of cards to filter
 * @param suit The suit to filter for
 * @returns A new array containing only cards of the specified suit
 */
export function filterBySuit(cards: Card[], suit: Suit): Card[] {
  return cards.filter(card => card.suit === suit);
}

/**
 * Filter an array of cards to only include those matching a specific rank
 * @param cards Array of cards to filter
 * @param rank The rank to filter for
 * @returns A new array containing only cards of the specified rank
 */
export function filterByRank(cards: Card[], rank: Rank): Card[] {
  return cards.filter(card => card.rank === rank);
}

/**
 * Get all cards of a specific suit from a hand
 * @param hand The hand to search
 * @param suit The suit to look for
 * @returns Array of cards matching the suit
 */
export function getCardsOfSuit(hand: Card[], suit: Suit): Card[] {
  return hand.filter(card => card.suit === suit);
}

/**
 * Get all cards of a specific rank from a hand
 * @param hand The hand to search
 * @param rank The rank to look for
 * @returns Array of cards matching the rank
 */
export function getCardsOfRank(hand: Card[], rank: Rank): Card[] {
  return hand.filter(card => card.rank === rank);
}

/**
 * Sort cards by rank (low to high)
 * @param cards The cards to sort
 * @returns A new array of cards sorted by rank
 */
export function sortByRank(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => a.rank - b.rank);
}

/**
 * Sort cards by suit (Spades, Hearts, Diamonds, Clubs)
 * @param cards The cards to sort
 * @returns A new array of cards sorted by suit
 */
export function sortBySuit(cards: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = { 'S': 0, 'H': 1, 'D': 2, 'C': 3 };
  return [...cards].sort((a, b) => suitOrder[a.suit] - suitOrder[b.suit]);
}

/**
 * Get a string describing multiple cards (e.g., "Ace of Hearts, King of Hearts")
 * @param cards Array of cards to describe
 * @returns A human-readable string listing the cards
 */
export function describeCards(cards: Card[]): string {
  if (cards.length === 0) return "no cards";
  if (cards.length === 1) return getCardName(cards[0]);
  
  const cardNames = cards.map(getCardName);
  return cardNames.slice(0, -1).join(", ") + " and " + cardNames[cardNames.length - 1];
}

/**
 * Get cards to hold based on their identities rather than positions
 * @param hand All cards in the hand
 * @param cardsToHold The specific cards to hold
 * @returns Array of booleans indicating which positions to hold
 */
export function getHoldArray(hand: Card[], cardsToHold: Card[]): boolean[] {
  return hand.map(card => 
    cardsToHold.some(holdCard => cardsAreEqual(card, holdCard))
  );
}

/**
 * Convert from hold pattern (bit mask) to actual cards
 * @param hand The complete hand
 * @param holdPattern The hold pattern (bit mask)
 * @returns Array of cards that should be held
 */
export function holdPatternToCards(hand: Card[], holdPattern: number): Card[] {
  const result: Card[] = [];
  
  for (let i = 0; i < hand.length; i++) {
    if ((holdPattern & (1 << i)) !== 0) {
      result.push(hand[i]);
    }
  }
  
  return result;
}

/**
 * Determines if a specific card should be held based on the recommended cards to hold
 * @param card The card to check
 * @param cardsToHold Array of cards that are recommended to be held
 * @returns True if the card should be held, false otherwise
 */
export function shouldHoldCard(card: Card, cardsToHold: Card[]): boolean {
  return cardsToHold.some(holdCard => cardsAreEqual(card, holdCard));
}

/**
 * Converts cards-to-hold into a position-based hold pattern
 * @param cardsToHold The cards that should be held
 * @param hand The complete 5-card hand
 * @returns A position-based hold pattern (e.g., 10001 for holding first and last cards)
 */
export function cardsToPositionPattern(cardsToHold: Card[], hand: Card[]): number[] {
  const positions: number[] = [];
  
  // Find the position of each card to hold
  for (let i = 0; i < hand.length; i++) {
    if (shouldHoldCard(hand[i], cardsToHold)) {
      positions.push(i);
    }
  }
  
  return positions;
}

/**
 * Create a hold pattern (bit mask) based on specific cards to hold
 * @param hand The complete hand
 * @param cardsToHold The cards that should be held
 * @returns A hold pattern (bit mask)
 */
export function cardsToHoldPattern(hand: Card[], cardsToHold: Card[]): number {
  let pattern = 0;
  
  for (let i = 0; i < hand.length; i++) {
    if (cardsToHold.some(card => cardsAreEqual(card, hand[i]))) {
      pattern |= (1 << i);
    }
  }
  
  return pattern;
}
