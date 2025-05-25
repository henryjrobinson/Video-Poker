# Video Poker Calculator - Complete Project Specification

## Project Overview
Web-based calculator for video poker (starting with Jacks or Better) that provides real-time odds and optimal play recommendations. Single-page application optimized for mobile use during gameplay.

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
- Calculate EV for all 32 hold/discard combinations
- Identify optimal play (highest EV)
- Display:
  - Recommended cards to hold
  - Expected value in coins
  - Win probabilities by hand type
  - Top 3 alternative plays with EVs

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
│ Win Probabilities:              │
│ • Royal Flush: 2.04%            │
│ • Straight: 8.16%               │
│ • Nothing: 89.80%               │
└─────────────────────────────────┘

[Card Selection Grid - Always Visible]
```

### UI Components

1. **Card Display**
   - 5 card positions with visual cards
   - Tap to toggle HOLD status
   - Green border for recommended holds
   - Clear visual distinction for held cards

2. **Card Input Grid**
   - 4x13 grid (suits × ranks) or 
   - Alternative: Rank buttons + Suit buttons
   - Disabled state for already selected cards
   - Quick clear button

3. **Results Panel**
   - Prominent optimal play recommendation
   - Expected value display
   - Expandable probability details
   - Alternative plays (optional)

4. **Controls**
   - Clear Hand
   - Settings (pay table adjustment)
   - Help/Strategy Guide

## Technical Architecture

### Tech Stack
- **Frontend**: React (for component state management)
- **Styling**: Tailwind CSS (mobile-responsive)
- **Build**: Vite (fast dev experience)
- **Deploy**: Netlify/Vercel (static hosting)
- **Language**: TypeScript (for calculation accuracy)

### Core Modules

1. **Card Engine** (`/src/lib/cards.ts`)
   ```typescript
   interface Card {
     rank: 2-14  // 11=J, 12=Q, 13=K, 14=A
     suit: 'S' | 'H' | 'D' | 'C'
   }
   
   interface Hand {
     cards: Card[]
     held: boolean[]
   }
   ```

2. **Hand Evaluator** (`/src/lib/evaluator.ts`)
   - Classify poker hands
   - Fast bit manipulation for performance
   - Return hand rank and kickers

3. **EV Calculator** (`/src/lib/calculator.ts`)
   - Generate all 32 hold combinations
   - For each combination:
     - Calculate all possible draws
     - Sum probabilities × payouts
   - Return sorted results by EV

4. **UI Components** (`/src/components/`)
   - CardDisplay
   - CardSelector
   - ResultsPanel
   - PayTableConfig

### Calculation Logic

```typescript
function calculateOptimalPlay(hand: Card[]): PlayResult {
  const results = []
  
  // Generate all 32 hold patterns (2^5)
  for (let holdPattern = 0; holdPattern < 32; holdPattern++) {
    const ev = calculateEV(hand, holdPattern)
    results.push({ holdPattern, ev })
  }
  
  // Sort by EV descending
  results.sort((a, b) => b.ev - a.ev)
  
  return {
    optimal: results[0],
    alternatives: results.slice(1, 4)
  }
}

function calculateEV(hand: Card[], holdPattern: number): number {
  const held = []
  const discarded = []
  
  // Separate held/discarded cards
  for (let i = 0; i < 5; i++) {
    if (holdPattern & (1 << i)) {
      held.push(hand[i])
    } else {
      discarded.push(hand[i])
    }
  }
  
  // Calculate EV across all possible draws
  const deck = getRemainingDeck(hand)
  let totalEV = 0
  
  // Iterate through all possible draw combinations
  // Sum: P(outcome) × Payout(outcome)
  
  return totalEV
}
```

## Implementation Plan

### Phase 1: Core Calculator (MVP)
1. Set up React + Vite + TypeScript project
2. Implement card data structures
3. Build hand evaluator
4. Create EV calculation engine
5. Design card selection UI
6. Display results
7. Deploy to Netlify/Vercel

### Phase 2: Enhanced Features
1. Multiple pay table presets
2. Hand history tracking
3. Strategy guide/tips
4. Additional game variants

### Phase 3: Multiplayer Expansion
1. Texas Hold'em calculator
2. Omaha calculator
3. Tournament considerations
4. Multi-way pot calculations

## Testing Strategy
- Unit tests for hand evaluator
- Unit tests for EV calculations
- Validate against known optimal strategies
- Mobile device testing

## Success Metrics
- Calculation accuracy (match published strategies)
- Performance (<100ms calculation time)
- Mobile usability (easy input during play)
- Correct EV calculations for all 32 combinations

## Example Test Cases

### Test 1: Low Pair vs High Cards
- Hand: 7♠ 7♥ A♣ K♦ Q♠
- Optimal: Hold 7♠ 7♥
- EV: ~1.47 coins

### Test 2: Royal Draw
- Hand: K♠ Q♠ J♠ 10♠ 9♥
- Optimal: Hold K♠ Q♠ J♠ 10♠
- EV: ~18.5 coins

### Test 3: Straight Flush Draw
- Hand: 9♠ 10♠ J♠ Q♠ K♠
- Optimal: Hold 10♠ J♠ Q♠ K♠ (break the straight flush!)
- EV: ~19.15 coins

## Notes for Implementation
- Assume 5-coin play for optimal royal flush payout
- Use bit manipulation for fast hand evaluation
- Pre-calculate lookup tables where possible
- Keep UI minimal for quick reference during play