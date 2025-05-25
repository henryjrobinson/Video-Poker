import React from 'react';
import { Card as CardType, Suit, Rank, createDeck } from '../lib/cards';
import './CardSelector.css';

interface CardSelectorProps {
  selectedCards: CardType[];
  onCardSelect: (card: CardType) => void;
}

const CardSelector: React.FC<CardSelectorProps> = ({ selectedCards, onCardSelect }) => {
  const deck = createDeck();
  
  // Group cards by suit
  const cardsBySuit: Record<Suit, CardType[]> = {
    'S': deck.filter(card => card.suit === 'S'),
    'H': deck.filter(card => card.suit === 'H'),
    'D': deck.filter(card => card.suit === 'D'),
    'C': deck.filter(card => card.suit === 'C'),
  };
  
  // Check if a card is already selected
  const isCardSelected = (card: CardType): boolean => {
    return selectedCards.some(
      selectedCard => selectedCard.rank === card.rank && selectedCard.suit === card.suit
    );
  };
  
  // Map ranks to display values
  const rankDisplay: Record<number, string> = {
    14: 'A', 13: 'K', 12: 'Q', 11: 'J', 10: '10', 9: '9',
    8: '8', 7: '7', 6: '6', 5: '5', 4: '4', 3: '3', 2: '2'
  };
  
  // Sort ranks in descending order (A, K, Q, J, 10, ...)
  const sortedRanks = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  
  console.log('CardSelector rendered, selected cards:', selectedCards);
  
  // Function to get the suit symbol and name
  const getSuitInfo = (suit: Suit): { symbol: string; name: string; colorClass: string } => {
    switch(suit) {
      case 'S':
        return { symbol: '♠', name: 'Spades', colorClass: 'suit-black' };
      case 'H':
        return { symbol: '♥', name: 'Hearts', colorClass: 'suit-red' };
      case 'D':
        return { symbol: '♦', name: 'Diamonds', colorClass: 'suit-red' };
      case 'C':
        return { symbol: '♣', name: 'Clubs', colorClass: 'suit-black' };
      default:
        return { symbol: '', name: '', colorClass: '' };
    }
  };
  
  // Predefined hands for quick selection
  const handleQuickSelect = (handType: string) => {
    // This would be implemented to select predefined hand patterns
    console.log(`Quick select: ${handType}`);
    // Implementation would depend on the actual card data structure
  };
  
  return (
    <div className="card-selector">
      <h2>Select Cards</h2>
      <p className="card-selector-counter">
        Select 5 cards to see analysis (<span>{selectedCards.length}/5</span> selected)
      </p>
      
      {Object.entries(cardsBySuit).map(([suit, cards]) => {
        const { symbol, name, colorClass } = getSuitInfo(suit as Suit);
        
        return (
          <div key={suit} className="suit-group">
            <div className="suit-header">
              <span className={`suit-symbol ${colorClass}`}>{symbol}</span>
              <span className="suit-name">{name}</span>
            </div>
            
            <div className="rank-buttons">
              {sortedRanks.map(rank => {
                const card = cards.find(c => c.rank === rank);
                if (!card) return null;
                
                const isSelected = isCardSelected(card);
                const buttonColorClass = colorClass.replace('suit-', '');
                
                return (
                  <button
                    key={`${card.rank}-${card.suit}`}
                    className={`rank-button ${buttonColorClass}`}
                    onClick={() => !isSelected && onCardSelect(card)}
                    disabled={isSelected}
                    aria-label={`${rankDisplay[card.rank]} of ${name}`}
                  >
                    {rankDisplay[card.rank]}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      
      <div className="quick-selection">
        <button onClick={() => handleQuickSelect('royal')}>Royal Flush</button>
        <button onClick={() => handleQuickSelect('straight')}>Straight Flush</button>
        <button onClick={() => handleQuickSelect('four')}>Four of a Kind</button>
        <button onClick={() => handleQuickSelect('fullhouse')}>Full House</button>
      </div>
    </div>
  );
};

export default CardSelector;
