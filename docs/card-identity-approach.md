# Card Identity-Based Strategy Approach

## Project Overview
This document outlines the architectural shift from a position-based card selection strategy to a card identity-based approach in our Video Poker application.

## Background & Problem Statement
Our current Video Poker strategy implementation identifies which positions (1st, 2nd, 3rd, etc.) to hold, rather than which specific cards. This has led to:
- Test failures when cards appear in unexpected positions
- Potential user confusion when following position-based advice
- Implementation complexity in handling positional ambiguity

## Technical Decision

### Before: Position-Based Approach
```typescript
// Example of position-based approach
function findFourToRoyal(hand: Card[]): number[] {
  // Returns positions like [0, 1, 2, 3]
}

// UI would instruct: "Hold cards in positions 1, 2, 3, 4"
```

### After: Card Identity-Based Approach
```typescript
// Example of card identity-based approach
function findFourToRoyal(hand: Card[]): Card[] {
  // Returns actual cards like [
  //   { rank: 14, suit: 'h' }, // Ace of Hearts
  //   { rank: 13, suit: 'h' }, // King of Hearts
  //   // etc.
  // ]
}

// UI would instruct: "Hold Ace of Hearts, King of Hearts, etc."
```

## Implementation Plan

1. **Data Model Updates**
   - Modify strategy functions to return Card objects instead of positions
   - Add utility functions for card comparison and identification
   - Update card representation for better display to users

2. **Algorithm Refinements**
   - Rewrite pattern detection to focus on card attributes rather than positions
   - Simplify logic to identify unique cards instead of positions

3. **UI Updates**
   - Enhance card component to show "hold" status based on card identity
   - Update strategy display to show card names instead of positions

4. **Test Refactoring**
   - Update test expectations to check for correct cards rather than positions
   - Create more robust tests that are position-independent

## Benefits

- **Improved User Experience**: Instructions like "Hold the Ace of Hearts" are more intuitive than "Hold card in position 2"
- **Reduced Ambiguity**: Strategy becomes position-independent
- **Simplified Testing**: Tests can focus on correct strategy rather than arbitrary positions
- **More Robust Code**: Implementation is less fragile to card arrangement changes

## Tasks Breakdown

1. [ ] Update Card model with better display properties
2. [ ] Refactor pattern detection functions to return Card[] instead of number[]
3. [ ] Update calculateOptimalPlay to work with card identities
4. [ ] Modify UI components to highlight cards based on identity
5. [ ] Update tests to verify card identities rather than positions
6. [ ] Create test utilities for card identity comparison

## Timeline

- Phase 1: Core algorithm updates (est. 2-3 days)
- Phase 2: UI updates (est. 1-2 days)
- Phase 3: Test refactoring (est. 1-2 days)

## Success Criteria

- All tests pass with the new card identity-based approach
- UI correctly highlights specific cards to hold
- Strategy descriptions refer to specific cards rather than positions
