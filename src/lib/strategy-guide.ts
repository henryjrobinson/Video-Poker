/**
 * Video Poker Strategy Guide
 * 
 * This module provides detailed documentation and explanations about optimal 
 * Jacks or Better video poker strategy. It includes both technical details and 
 * player-friendly explanations.
 */

/**
 * Strategy rule descriptions with detailed explanations
 */
export const strategyRuleExplanations = {
  ROYAL_FLUSH: {
    name: "Royal Flush",
    action: "Hold all cards",
    explanation: "You've hit the jackpot! A Royal Flush is the best possible hand in video poker. This hand pays the highest amount, typically 800 coins on a 5-coin bet (or 4000 coins with a royal flush bonus). Always hold all cards."
  },
  STRAIGHT_FLUSH: {
    name: "Straight Flush",
    action: "Hold all cards",
    explanation: "A Straight Flush is the second-best hand. It pays 50 coins on a 5-coin bet. Always hold all cards."
  },
  FOUR_OF_A_KIND: {
    name: "Four of a Kind",
    action: "Hold all four matching cards",
    explanation: "Four of a Kind is a very strong hand, paying 25 coins on a 5-coin bet. Hold the four matching cards and discard the fifth card for a small chance at a Royal Flush or Straight Flush."
  },
  FOUR_TO_ROYAL: {
    name: "4 to a Royal Flush",
    action: "Hold the four royal cards",
    explanation: "When you have four cards to a Royal Flush (10, J, Q, K, A of the same suit), hold these four cards and discard the fifth. This gives you a 1 in 47 chance (about 2%) of completing the Royal Flush, with an expected value of around 18.6 coins."
  },
  FULL_HOUSE: {
    name: "Full House",
    action: "Hold all cards",
    explanation: "A Full House pays 9 coins on a 5-coin bet in 9/6 Jacks or Better. Always hold all cards."
  },
  FLUSH: {
    name: "Flush",
    action: "Hold all cards",
    explanation: "A Flush pays 6 coins on a 5-coin bet in 9/6 Jacks or Better. Always hold all cards."
  },
  STRAIGHT: {
    name: "Straight",
    action: "Hold all cards", 
    explanation: "A Straight pays 4 coins on a 5-coin bet. Always hold all cards."
  },
  THREE_OF_A_KIND: {
    name: "Three of a Kind",
    action: "Hold the three matching cards",
    explanation: "With Three of a Kind, hold the three matching cards and discard the other two. This gives you a chance to draw into a Four of a Kind or Full House."
  },
  FOUR_TO_STRAIGHT_FLUSH: {
    name: "4 to a Straight Flush",
    action: "Hold the four sequential suited cards",
    explanation: "When you have four cards in sequence of the same suit, hold these cards and discard the fifth. This gives you a good chance of drawing to a Straight Flush or other paying hands."
  },
  TWO_PAIR: {
    name: "Two Pair",
    action: "Hold both pairs",
    explanation: "With Two Pair, hold both pairs and discard the fifth card. This gives you a 1 in 47 chance (about 2%) of drawing to a Full House."
  },
  HIGH_PAIR: {
    name: "High Pair (Jacks or Better)",
    action: "Hold the pair",
    explanation: "With a pair of Jacks, Queens, Kings, or Aces, hold the pair and discard the other three cards. This is a paying hand already, but you also have a chance to improve to Three of a Kind, Full House, or Four of a Kind."
  },
  THREE_TO_ROYAL: {
    name: "3 to a Royal Flush",
    action: "Hold the three royal cards",
    explanation: "When you have three cards to a Royal Flush (e.g., Q-K-A of the same suit), hold these three cards and discard the other two. The expected value of this play is higher than holding a low pair."
  },
  FOUR_TO_FLUSH: {
    name: "4 to a Flush",
    action: "Hold the four suited cards",
    explanation: "When you have four cards of the same suit, hold these four cards and discard the fifth. This gives you a 1 in 47 chance (about 2%) of completing the Flush."
  },
  LOW_PAIR: {
    name: "Low Pair (Tens or Lower)",
    action: "Hold the pair",
    explanation: "With a pair of Tens or lower, hold the pair and discard the other three cards. While this isn't a paying hand yet, you have a chance to improve to Three of a Kind, Full House, or Four of a Kind."
  },
  FOUR_TO_OUTSIDE_STRAIGHT: {
    name: "4 to an Outside Straight",
    action: "Hold the four sequential cards",
    explanation: "When you have four cards in sequence that can be completed on either end (like 4-5-6-7 which can be completed with a 3 or 8), hold these four cards and discard the fifth. This gives you 8 cards that can complete the straight (4 of each rank needed)."
  },
  FOUR_TO_INSIDE_STRAIGHT_WITH_HIGH: {
    name: "4 to an Inside Straight with 3+ High Cards",
    action: "Hold the four cards",
    explanation: "When you have four cards that need one specific rank to complete a straight, and at least three of these cards are high cards (J, Q, K, A), hold all four cards."
  },
  TWO_SUITED_HIGH_CARDS: {
    name: "2 Suited High Cards",
    action: "Hold the two suited high cards",
    explanation: "When you have two suited high cards (J, Q, K, A), hold these two cards and discard the other three. This preserves the possibility of drawing to a Royal Flush or high pair."
  },
  UNSUITED_HIGH_CARDS: {
    name: "2+ Unsuited High Cards",
    action: "Hold the high cards",
    explanation: "When you have multiple unsuited high cards, hold these cards and discard the rest. This gives you a chance to draw to high pairs."
  },
  SUITED_TEN_PLUS_FACE: {
    name: "10 + Face Card, Suited",
    action: "Hold the suited 10 and face card",
    explanation: "When you have a Ten and a face card (J, Q, K) of the same suit, hold these two cards and discard the other three. This preserves the possibility of drawing to a Royal Flush."
  },
  SINGLE_HIGH_CARD: {
    name: "Single High Card",
    action: "Hold the highest card",
    explanation: "If you have a single high card (J, Q, K, A), hold this card and discard the other four. This gives you a chance to pair up for a paying hand."
  },
  NOTHING: {
    name: "Nothing - Draw 5 New Cards",
    action: "Discard all cards",
    explanation: "When you don't have any of the above patterns, discard all five cards and draw a completely new hand."
  }
};

/**
 * Expected Value (EV) explanation for players
 */
export const expectedValueExplanation = `
# Understanding Expected Value (EV) in Video Poker

Expected Value (EV) represents the average return you can expect from a particular play over the long run.

## How EV Works

- **EV is measured in coins**: An EV of 1.0 means you'll get back, on average, the same number of coins you bet.
- **EV above 1.0** is good: It means you're getting more back than you're putting in.
- **EV below 1.0** means you're losing money on average.

## Examples

- A Royal Flush has an EV of 800 (on a max bet) because that's what it pays.
- A 4 to a Royal Flush has an EV of ~18.6 because:
  * You have a ~2% chance (1/47) of drawing the fifth card for a Royal Flush (800 coins)
  * You also have chances to draw other paying hands

## How EV Guides Strategy

The optimal play in any situation is the one with the highest EV. This is why:

- We sometimes break up a paying hand (like a low pair) to draw to a 4 to a Royal Flush
- We hold different cards in seemingly similar situations based on subtle differences that affect EV

The pattern-based calculator in this app uses EVs derived from expert strategy to recommend the best play in every situation.
`;

/**
 * Complete Jacks or Better strategy chart in text format
 */
export const strategyChartText = `
# 9/6 Jacks or Better Perfect Strategy

## In Order of Priority:

1. Hold Royal Flush, Straight Flush, Four of a Kind, Full House, Flush, or Straight
2. Hold 4 to a Royal Flush
3. Hold Three of a Kind, Straight, Flush, or Full House
4. Hold 4 to a Straight Flush
5. Hold Two Pair
6. Hold High Pair (Jacks or Better)
7. Hold 3 to a Royal Flush
8. Hold 4 to a Flush
9. Hold Low Pair
10. Hold 4 to an Outside Straight
11. Hold 2 Suited High Cards
12. Hold 4 to an Inside Straight with 3 High Cards
13. Hold 2 Unsuited High Cards (if JQ or better)
14. Hold suited 10/J, 10/Q, or 10/K
15. Hold single Jack, Queen, King, or Ace
16. Discard Everything

## Special Notes:

- Always hold four cards to a royal flush over a made hand (except royal flush)
- Always hold a low pair over four to a flush or four to an outside straight
- Always hold a high pair over three to a royal flush
- Never break up a paying hand (pair of jacks or better) for a single draw to a straight or flush
`;

/**
 * Get a user-friendly explanation for a specific strategy rule
 * 
 * @param ruleName The name of the rule to get an explanation for
 * @returns A detailed explanation of the rule and its reasoning
 */
export function getStrategyExplanation(ruleName: string): string {
  const rule = Object.values(strategyRuleExplanations)
    .find(rule => rule.name === ruleName || ruleName.includes(rule.name));
  
  if (rule) {
    return `
      **${rule.name}**
      
      **Recommended Action:** ${rule.action}
      
      **Explanation:** ${rule.explanation}
    `;
  }
  
  return `No explanation available for "${ruleName}"`;
}
