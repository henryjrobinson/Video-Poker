/**
 * Card Engine - Core data structures for representing cards and poker hands
 */

// Card suit type
export type Suit = 'S' | 'H' | 'D' | 'C';

// Card ranks from 2 to Ace (14)
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

// Card interface representing a playing card
export interface Card {
  rank: Rank;  // 11=J, 12=Q, 13=K, 14=A
  suit: Suit;
}

// Hand interface representing a poker hand
export interface Hand {
  cards: Card[];
  held: boolean[];
}

// Utility function to create a standard 52-card deck
export function createDeck(): Card[] {
  const deck: Card[] = [];
  const suits: Suit[] = ['S', 'H', 'D', 'C'];
  
  for (const suit of suits) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({ rank: rank as Rank, suit });
    }
  }
  
  return deck;
}

// Utility function to get a deck without the cards already in a hand
export function getRemainingDeck(hand: Card[]): Card[] {
  const deck = createDeck();
  
  return deck.filter(card => 
    !hand.some(handCard => 
      handCard.rank === card.rank && handCard.suit === card.suit
    )
  );
}

// Utility function to get a string representation of a card
export function cardToString(card: Card): string {
  const rankMap: Record<number, string> = {
    11: 'J',
    12: 'Q',
    13: 'K',
    14: 'A'
  };
  
  const rankStr = rankMap[card.rank] || card.rank.toString();
  return `${rankStr}${card.suit}`;
}

// Utility function to get a card from a string representation
export function stringToCard(cardStr: string): Card | null {
  if (!cardStr || cardStr.length < 2) return null;
  
  const suitChar = cardStr.charAt(cardStr.length - 1);
  const rankStr = cardStr.substring(0, cardStr.length - 1);
  
  if (!['S', 'H', 'D', 'C'].includes(suitChar)) return null;
  
  const rankMap: Record<string, number> = {
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14
  };
  
  let rank: number;
  
  if (rankMap[rankStr]) {
    rank = rankMap[rankStr];
  } else {
    rank = parseInt(rankStr, 10);
    if (isNaN(rank) || rank < 2 || rank > 10) return null;
  }
  
  return {
    rank: rank as Rank,
    suit: suitChar as Suit
  };
}
