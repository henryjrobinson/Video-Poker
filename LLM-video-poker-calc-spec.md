# Video Poker Calculator - Complete Project Specification

## Project Overview
Web-based calculator for video poker (starting with Jacks or Better) that provides real-time odds and optimal play recommendations. Single-page application optimized for mobile use during gameplay.

**IMPORTANT: This is a SIMPLE pattern-matching problem, NOT a complex simulation. Do not use Monte Carlo methods or GPU calculations. The entire strategy can be implemented with basic if/then rules and simple arithmetic.**

## Core Features

### 1. Game Variant Selection
- Initial support: Jacks or Better
- Configurable pay table (9/6, 8/5, etc.)
- Future: Deuces Wild, Double Bonus, etc.

### 2. Card Input System
- **Initial Deal Input**: 
  - Grid of all 52 cards
  - Tap to select, auto-fills positions 1-5
  - Visual feedback for selected cards (greyed out)
  - Clear/undo functionality
  
### 3. Analysis Engine
- Use pattern matching against known optimal strategy
- NO complex simulations needed
- Display:
  - Recommended cards to hold
  - Expected value in coins
  - Why this play is optimal (optional)

### 4. Pay Table
```
Royal Flush:     800x (with 5 coins) / 250x (1-4 coins)
Straight Flush:   50x
Four of a Kind:   25x
Full House:        9x
Flush:             6x
Straight:          4x
Three of a Kind:   3x
Two Pair:          2x
Jacks or Better:   1x
High Card:         0x
```

## UI Design

### Layout (Mobile-First)
```
┌─────────────────────────────────┐
│      VIDEO POKER CALCULATOR     │
│        Jacks or Better          │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ │
│  │ A │ │ K │ │ Q │ │ J │ │ 9 │ │
│  │ ♠ │ │ ♠ │ │ ♠ │ │ ♠ │ │ ♥ │ │
│  └───┘ └───┘ └───┘ └───┘ └───┘ │
│   HOLD  HOLD  HOLD  HOLD       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ OPTIMAL: Hold first 4 cards     │
│ Expected Value: 1.48 coins      │
│                                 │
│ Pattern: 4 to Royal Flush       │
└─────────────────────────────────┘

[Card Selection Grid - Always Visible]
```

## Technical Architecture

### Tech Stack
- **Frontend**: React (for component state management)
- **Styling**: Tailwind CSS (mobile-responsive)
- **Build**: Vite (fast dev experience)
- **Deploy**: Netlify/Vercel (static hosting)
- **Language**: TypeScript (for calculation accuracy)

## IMPLEMENTATION APPROACH: Pattern Matching, NOT Simulation

### The Key Insight
Video poker optimal strategy is a SOLVED problem. We don't need to calculate anything complex - we just need to match the current hand against known patterns and return the pre-determined optimal play.

### Strategy Implementation

```javascript
// THIS IS THE ENTIRE STRATEGY ENGINE - NO COMPLEX MATH NEEDED!

const STRATEGY_RULES = [
  // Check patterns from top to bottom - first match wins
  // Format: { name, check function, action }
  
  {
    name: "Royal Flush",
    check: (hand) => isRoyalFlush(hand),
    action: "HOLD_ALL"
  },
  {
    name: "Straight Flush", 
    check: (hand) => isStraightFlush(hand),
    action: "HOLD_ALL"
  },
  {
    name: "Four of a Kind",
    check: (hand) => isFourOfAKind(hand),
    action: "HOLD_ALL"
  },
  {
    name: "4 to Royal Flush",
    check: (hand) => {
      // Check all 5-card combinations for 4 royal cards of same suit
      const suits = ['S', 'H', 'D', 'C'];
      for (const suit of suits) {
        const suitedCards = hand.filter(card => card.suit === suit);
        const royalRanks = suitedCards.filter(card => 
          [10, 11, 12, 13, 14].includes(card.rank) // 10,J,Q,K,A
        );
        if (royalRanks.length === 4) return true;
      }
      return false;
    },
    action: "HOLD_ROYAL_FOUR"
  },
  {
    name: "Full House",
    check: (hand) => isFullHouse(hand),
    action: "HOLD_ALL"
  },
  {
    name: "Flush",
    check: (hand) => isFlush(hand),
    action: "HOLD_ALL"
  },
  {
    name: "Three of a Kind",
    check: (hand) => isThreeOfAKind(hand),
    action: "HOLD_TRIPS"
  },
  {
    name: "Straight",
    check: (hand) => isStraight(hand),
    action: "HOLD_ALL"
  },
  {
    name: "4 to Straight Flush",
    check: (hand) => hasFourToStraightFlush(hand),
    action: "HOLD_SF_FOUR"
  },
  {
    name: "Two Pair",
    check: (hand) => isTwoPair(hand),
    action: "HOLD_TWO_PAIR"
  },
  {
    name: "High Pair (JJ+)",
    check: (hand) => {
      const pairs = getPairs(hand);
      return pairs.length === 1 && pairs[0].rank >= 11; // J=11
    },
    action: "HOLD_PAIR"
  },
  {
    name: "3 to Royal Flush",
    check: (hand) => hasThreeToRoyal(hand),
    action: "HOLD_ROYAL_THREE"
  },
  {
    name: "4 to Flush",
    check: (hand) => hasFourToFlush(hand),
    action: "HOLD_FLUSH_FOUR"
  },
  {
    name: "Low Pair (22-TT)",
    check: (hand) => {
      const pairs = getPairs(hand);
      return pairs.length === 1 && pairs[0].rank <= 10;
    },
    action: "HOLD_PAIR"
  },
  {
    name: "4 to Open-Ended Straight",
    check: (hand) => hasOpenEndedStraight(hand),
    action: "HOLD_STRAIGHT_FOUR"
  },
  {
    name: "2 Suited High Cards",
    check: (hand) => {
      // JQ, JK, QK of same suit
      const highCards = hand.filter(card => card.rank >= 11);
      if (highCards.length < 2) return false;
      
      // Check if any 2 high cards are suited
      for (let i = 0; i < highCards.length - 1; i++) {
        for (let j = i + 1; j < highCards.length; j++) {
          if (highCards[i].suit === highCards[j].suit) {
            return true;
          }
        }
      }
      return false;
    },
    action: "HOLD_SUITED_HIGH"
  },
  {
    name: "3 to Straight Flush (Type 1)",
    check: (hand) => hasThreeToStraightFlush(hand, 1),
    action: "HOLD_SF_THREE"
  },
  {
    name: "4 to Inside Straight (3+ high cards)",
    check: (hand) => {
      const straights = getFourCardStraights(hand);
      return straights.some(s => 
        s.type === 'inside' && 
        s.cards.filter(c => c.rank >= 11).length >= 3
      );
    },
    action: "HOLD_INSIDE_STRAIGHT"
  },
  {
    name: "QJ Unsuited",
    check: (hand) => hasSpecificRanks(hand, [11, 12], false),
    action: "HOLD_QJ"
  },
  {
    name: "3 to Flush with 2 High Cards", 
    check: (hand) => hasThreeFlushWithHighCards(hand, 2),
    action: "HOLD_FLUSH_THREE"
  },
  {
    name: "2 Suited High Cards (with gap)",
    check: (hand) => hasSuitedHighWithGap(hand),
    action: "HOLD_SUITED_HIGH"
  },
  {
    name: "KQJ Unsuited",
    check: (hand) => hasSpecificRanks(hand, [11, 12, 13], false),
    action: "HOLD_KQJ"
  },
  {
    name: "JT Suited",
    check: (hand) => hasSpecificRanks(hand, [10, 11], true),
    action: "HOLD_JT_SUITED"
  },
  {
    name: "QT Suited", 
    check: (hand) => hasSpecificRanks(hand, [10, 12], true),
    action: "HOLD_QT_SUITED"
  },
  {
    name: "Jack or Better",
    check: (hand) => hand.some(card => card.rank >= 11),
    action: "HOLD_HIGH_CARD"
  },
  {
    name: "KT Suited",
    check: (hand) => hasSpecificRanks(hand, [10, 13], true),
    action: "HOLD_KT_SUITED"
  },
  {
    name: "Ace",
    check: (hand) => hand.some(card => card.rank === 14),
    action: "HOLD_ACE"
  },
  {
    name: "3 to Straight Flush (Type 2)",
    check: (hand) => hasThreeToStraightFlush(hand, 2),
    action: "HOLD_SF_THREE"
  },
  {
    name: "King",
    check: (hand) => hand.some(card => card.rank === 13),
    action: "HOLD_KING"
  },
  {
    name: "Nothing - Draw 5",
    check: (hand) => true, // Always true - last resort
    action: "HOLD_NONE"
  }
];

// MAIN STRATEGY FUNCTION - Just iterate through rules!
function getOptimalPlay(hand) {
  for (const rule of STRATEGY_RULES) {
    if (rule.check(hand)) {
      return {
        pattern: rule.name,
        action: rule.action,
        cards: getCardsToHold(hand, rule.action)
      };
    }
  }
}

// Helper to determine which cards to hold based on action
function getCardsToHold(hand, action) {
  switch(action) {
    case "HOLD_ALL":
      return hand;
    case "HOLD_NONE":
      return [];
    case "HOLD_PAIR":
      return getPairs(hand)[0].cards;
    case "HOLD_TRIPS":
      return getTrips(hand);
    case "HOLD_TWO_PAIR":
      return getTwoPairCards(hand);
    case "HOLD_ROYAL_FOUR":
      return getRoyalCards(hand, 4);
    case "HOLD_FLUSH_FOUR":
      return getFlushCards(hand, 4);
    // ... etc for each action type
  }
}
```

### Expected Value Calculation (OPTIONAL - for display only)

If you want to show the expected value, you can use simple lookup tables:

```javascript
// Pre-calculated EVs for common situations
const EXPECTED_VALUES = {
  "Royal Flush": 800.0,
  "Straight Flush": 50.0,
  "Four of a Kind": 25.0,
  "4 to Royal Flush": 18.5,
  "Full House": 9.0,
  "Flush": 6.0,
  "Three of a Kind": 4.3,
  "Straight": 4.0,
  "4 to Straight Flush": 3.4,
  "Two Pair": 2.6,
  "High Pair (JJ+)": 1.54,
  "3 to Royal Flush": 1.39,
  "4 to Flush": 1.22,
  "Low Pair (22-TT)": 0.82,
  "4 to Open-Ended Straight": 0.68,
  "2 Suited High Cards": 0.59,
  "4 to Inside Straight (3+ high)": 0.53,
  "3 to Straight Flush": 0.50,
  "2 Unsuited High Cards": 0.49,
  "Jack or Better": 0.47,
  "Nothing - Draw 5": 0.36
};
```

### Card Helper Functions

```javascript
// Card representation
interface Card {
  rank: number;  // 2-14 (J=11, Q=12, K=13, A=14)
  suit: 'S' | 'H' | 'D' | 'C';
}

// Basic hand evaluation functions
function isFlush(hand) {
  const suits = hand.map(card => card.suit);
  return suits.every(suit => suit === suits[0]);
}

function isStraight(hand) {
  const ranks = hand.map(card => card.rank).sort((a, b) => a - b);
  
  // Check for regular straight
  for (let i = 0; i < ranks.length - 1; i++) {
    if (ranks[i + 1] - ranks[i] !== 1) {
      // Check for Ace-low straight (A,2,3,4,5)
      if (ranks.toString() === '2,3,4,5,14') return true;
      return false;
    }
  }
  return true;
}

function getPairs(hand) {
  const rankCounts = {};
  hand.forEach(card => {
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
  });
  
  const pairs = [];
  for (const [rank, count] of Object.entries(rankCounts)) {
    if (count === 2) {
      pairs.push({
        rank: parseInt(rank),
        cards: hand.filter(card => card.rank === parseInt(rank))
      });
    }
  }
  return pairs;
}

// More helper functions as needed...
```

## Implementation Steps

1. **Set up the project structure** (React + TypeScript + Vite)
2. **Create the card data structures and types**
3. **Implement the helper functions** (isFlush, isStraight, etc.)
4. **Copy the STRATEGY_RULES array exactly as shown**
5. **Build the UI for card input**
6. **Wire up the strategy engine to the UI**
7. **Test against known hands**

## Testing the Implementation

Test these specific hands to verify correctness:

```javascript
// Test Case 1: Low Pair vs High Cards
// Hand: 7♠ 7♥ A♣ K♦ Q♠
// Correct: Hold 7♠ 7♥

// Test Case 2: 4 to Royal  
// Hand: K♠ Q♠ J♠ 10♠ 9♥
// Correct: Hold K♠ Q♠ J♠ 10♠

// Test Case 3: Break up straight flush for royal
// Hand: 9♠ 10♠ J♠ Q♠ K♠  
// Correct: Hold 10♠ J♠ Q♠ K♠

// Test Case 4: High cards
// Hand: A♠ K♥ 7♦ 4♣ 2♠
// Correct: Hold A♠ K♥

// Test Case 5: Suited high cards over unsuited
// Hand: K♠ Q♠ J♥ 7♦ 3♣
// Correct: Hold K♠ Q♠
```

## CRITICAL IMPLEMENTATION NOTES

1. **DO NOT use Monte Carlo simulation** - This is a solved problem with known optimal plays
2. **DO NOT calculate complex probabilities** - Use the pattern matching approach
3. **DO NOT implement "AI" or machine learning** - Simple if/then rules are perfect
4. **The ENTIRE strategy fits in the STRATEGY_RULES array above** - Just implement it as shown

## For the LLM Implementing This:

You are implementing a SIMPLE PATTERN MATCHER, not a complex calculator. The entire logic is:

1. Take the 5-card hand
2. Check it against each rule in STRATEGY_RULES from top to bottom
3. The first rule that matches is the optimal play
4. Return which cards to hold based on that rule's action

That's it! No complex math, no simulations, no probability calculations needed. The strategy is already solved and encoded in the rules array. Your job is just to implement the pattern matching.

If you find yourself writing complex probability calculations or Monte Carlo simulations, STOP - you're overcomplicating it. This entire calculator can be implemented in under 500 lines of clean TypeScript.