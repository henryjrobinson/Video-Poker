# Video Poker Calculator - Project To-Do List

## Phase 1: Core Calculator (MVP)
- [x] Set up React + Vite + TypeScript project
- [x] Implement card data structures
- [x] Build hand evaluator
- [x] Create EV calculation engine
- [x] Design card selection UI
- [x] Display results
- [ ] Improve results display
  - [ ] Add explanations for Expected Value (EV) and what it means
  - [ ] Show EV in dollars/percentage terms instead of just coins
  - [ ] Add tooltips for poker terminology
  - [ ] Include more intuitive visualizations of probabilities
- [ ] Implement pattern-based calculator following the LLM-video-poker-calc-spec.md
  - [ ] Create strategy rule system with pattern matching approach
  - [ ] Implement helper functions for pattern detection
  - [ ] Ensure calculator aligns exactly with expert strategy
  - [ ] Create unified calculator for both app and test rig
  - [ ] Fix all failing test cases
    - [ ] Four of a Kind scenarios
    - [ ] Three of a Kind scenarios
    - [ ] Two Pair scenarios
    - [ ] One Pair scenarios
    - [ ] Near Royal/Straight/Flush scenarios
    - [ ] Edge cases
      - [x] **Priority Conflicts**
        - [x] Low Pair vs. 4 to a Flush: Ensure correct hold when both are present
        - [x] 3 to a Royal vs. Low Pair: Verify the royal draw is preferred only in specific scenarios
        - [x] 4 to an Inside Straight with 3+ High Cards vs. High Cards only
        - [x] 3 to a Straight Flush vs. Low Pair: Confirm correct strategy based on EV
      - [ ] **Card Combinations**
        - [x] Overlapping Draws: Hand contains both flush and straight potential
        - [x] Multiple High Cards across different suits
        - [x] Near Royal with Lower Pair present
        - [x] Ace-Low Straight Flush Draws (A-2-3-4 suited)
      - [ ] **Suit-Specific Cases**
        - [x] Royal Potential in Multiple Suits
        - [x] High Cards Same Suit vs. Different Suits (JQ suited vs. JQ unsuited)
      - [x] **Deceptive Hands**
        - [x] Almost Royal but Better Play exists (e.g., pat straight flush)
        - [x] Full House with 4 to a Royal Possibility
        - [x] Four of a Kind with Royal Potential
      - [x] **Additional Edge Cases**
        - [x] Handling Ties in Expected Value
        - [x] Optimal Strategy Exceptions
        - [x] Multiple Straight Flush Draws
      - [x] **Advanced Edge Cases**
        - [x] Pay Table Variations (9/6, 8/5, etc.)
        - [x] Special Kicker Considerations
        - [x] Ace-Low Straight Edge Cases
        - [x] Gap Position Significance
        - [x] Sequential Royal Draws
        - [x] High-Card Ranking Subtleties
      - [ ] **Future Advanced Edge Cases**
        - [ ] Penalty Card Considerations
        - [ ] Transitional Probabilities
        - [ ] Two High Pair vs. Four to a Flush
        - [ ] Tournament Strategy Adjustments
        - [ ] Redraw Probabilities
        - [ ] Three-Card Straight Flush Variations
        - [ ] Card Removal Effects in Multi-Hand Games
        - [ ] Bankroll Management Integration
  - [ ] Add comprehensive unit tests for calculation logic
- [ ] Deploy to Netlify/Vercel

## Phase 2: UI/UX Improvements
- [x] Fix basic card styling
- [ ] Improve Card Selector styling
  - [ ] Create a more visually appealing grid layout
  - [ ] Add suit grouping with better visual separation
  - [ ] Improve selected/disabled state styling
  - [ ] Add quick selection shortcuts for common hands
- [ ] Card Visual Enhancements
  - [ ] Add subtle patterns or textures to card backgrounds
  - [ ] Create distinct visual differences between suits
  - [ ] Implement face card visuals (J, Q, K) instead of just letters
  - [ ] Add card back designs for placeholders
- [ ] Animation and Interaction
  - [ ] Add subtle animations when cards are selected
  - [ ] Add transition effects when cards are held/discarded
  - [ ] Improve hover and active states for all interactive elements
  - [ ] Add deal/draw animation sequences
- [ ] Layout and Responsiveness
  - [ ] Optimize layout for different screen sizes
  - [ ] Ensure cards display well on small screens
  - [ ] Implement landscape mode optimizations for mobile
  - [ ] Test and fix any responsive design issues
- [ ] Accessibility
  - [ ] Add ARIA attributes to all interactive elements
  - [ ] Ensure proper focus management
  - [ ] Add keyboard navigation support
  - [ ] Test with screen readers
  - [ ] Implement high-contrast mode option

## Phase 3: Enhanced Features
- [ ] Game Variants and Options
  - [ ] Multiple pay table presets (9/6, 8/5, etc.)
  - [ ] Add settings panel for game configuration
  - [ ] Implement additional game variants (Deuces Wild, Double Bonus)
  - [ ] Add coin denomination selector
- [ ] Analysis and Learning Tools
  - [ ] Hand history tracking
  - [ ] Session statistics
  - [ ] Strategy guide/tips
  - [ ] Detailed probability explanations
  - [ ] "Why is this the best play?" explanations
- [ ] Data Persistence
  - [ ] Implement local storage for settings
  - [ ] Save hand history between sessions
  - [ ] Allow exporting/importing of hand history
- [ ] Performance Optimization
  - [ ] Optimize calculation engine for speed
  - [ ] Implement web workers for background calculations
  - [ ] Add caching for common calculations
  - [ ] Optimize bundle size and load time

## Phase 4: Advanced Features (Future)
- [ ] Automatic Play Mode
  - [ ] Option to auto-hold optimal cards
  - [ ] Auto-play functionality with speed controls
  - [ ] Session simulation with statistics
- [ ] Multi-hand Support
  - [ ] Triple Play, Five Play, etc. variants
  - [ ] Comparative EV calculations across multiple hands
- [ ] Social Features
  - [ ] Share interesting hands
  - [ ] Compare strategies with friends
- [ ] Progressive Web App
  - [ ] Enable offline functionality
  - [ ] Add to home screen experience
  - [ ] Push notifications for updates/tips

## Infrastructure and Development
- [ ] Testing Infrastructure
  - [ ] Set up unit testing for core logic
  - [ ] Implement component testing
  - [ ] Add end-to-end tests for critical paths
  - [ ] Set up continuous integration
- [ ] Comprehensive Test Rig
  - [ ] Create test suite for standard poker scenarios
  - [ ] Build automated verification of optimal holds
  - [ ] Compare results against published strategy charts
  - [ ] Test edge cases and unusual hands
  - [ ] Create regression test suite for different pay tables
- [ ] Documentation
  - [ ] Create comprehensive API documentation
  - [ ] Add inline code comments
  - [ ] Create user guide
  - [ ] Document calculation methodology
- [ ] DevOps
  - [ ] Configure automated deployment pipeline
  - [ ] Set up monitoring and analytics
  - [ ] Implement error tracking
