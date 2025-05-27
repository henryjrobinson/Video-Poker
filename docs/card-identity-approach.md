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

### Completed Tasks
1. [x] Create card-utils.ts with better display properties for cards
2. [x] Implement identity-pattern-calculator.ts with Card[] return values
3. [x] Create comprehensive pattern detection functions based on card identity
4. [x] Update calculateOptimalPlay to work with card identities
5. [x] Create test utilities for card identity comparison
6. [x] Implement and test the five previously failing test cases

### Next Steps (In Priority Order)
1. [ ] UI Integration: Update UI components to highlight cards based on identity
   - Modify the card component to show "hold" status based on card identity
   - Update the strategy display component to handle card identity data
   - Create card-specific descriptive text for strategy explanations

2. [ ] Enhanced Card Descriptions
   - Modify strategy guide to reference specific cards (e.g., "Hold the Ace of Hearts")
   - Create formatters for card-based strategy descriptions
   - Add specific card references to strategy explanations

3. [ ] Comprehensive Test Suite
   - Create tests for all strategy scenarios using the identity-based approach
   - Add tests for edge cases and specific hand combinations
   - Update test output format to show specific cards

4. [ ] Migration Path for Position-Based Code
   - Create utility functions to convert between position-based and identity-based approaches
   - Add compatibility layer for components still using position-based logic
   - Document migration strategy for existing code

## Timeline

- Phase 1: Core algorithm updates (est. 2-3 days)
- Phase 2: UI updates (est. 1-2 days)
- Phase 3: Test refactoring (est. 1-2 days)

## Success Criteria

- All tests pass with the new card identity-based approach
- UI correctly highlights specific cards to hold
- Strategy descriptions refer to specific cards rather than positions
