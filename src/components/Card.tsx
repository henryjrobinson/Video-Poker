import React from 'react';
import { Card as CardType, Suit } from '../lib/cards';
import './Card.css';

interface CardProps {
  card: CardType;
  isHeld: boolean;
  isRecommended?: boolean;
  onClick?: () => void;
}

// Map of suits to their symbols and colors
const suitConfig: Record<Suit, { symbol: string; color: string }> = {
  'S': { symbol: '♠', color: 'text-black' },
  'H': { symbol: '♥', color: 'text-red-600' },
  'D': { symbol: '♦', color: 'text-red-600' },
  'C': { symbol: '♣', color: 'text-black' }
};

// Map of ranks to their display values
const rankDisplay: Record<number, string> = {
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A'
};

const Card: React.FC<CardProps> = ({ card, isHeld, isRecommended = false, onClick }) => {
  const { symbol, color } = suitConfig[card.suit];
  const rankText = rankDisplay[card.rank];
  
  // Determine the color class based on suit
  const colorClass = card.suit === 'H' || card.suit === 'D' ? 'suit-red' : 'suit-black';

  return (
    <div 
      className={`playing-card ${isHeld ? 'held' : ''} ${isRecommended ? 'recommended' : ''}`}
      onClick={onClick}
      data-testid={`card-${card.rank}-${card.suit}`}
    >
      {/* Top left rank and suit */}
      <div className="card-corner card-top-left">
        <span className="card-rank">{rankText}</span>
        <span className={`card-suit ${colorClass}`}>{symbol}</span>
      </div>
      
      {/* Center suit */}
      <span className={`card-center ${colorClass}`}>{symbol}</span>
      
      {/* Bottom right rank and suit */}
      <div className="card-corner card-bottom-right">
        <span className="card-rank">{rankText}</span>
        <span className={`card-suit ${colorClass}`}>{symbol}</span>
      </div>
      
      {/* Held indicator */}
      {isHeld && (
        <div className="card-hold-indicator">
          <span className="hold-badge">HOLD</span>
        </div>
      )}
    </div>
  );
};

export default Card;
