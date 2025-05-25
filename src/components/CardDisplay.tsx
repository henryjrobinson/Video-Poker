import React from 'react';
import { Card as CardType } from '../lib/cards';
import Card from './Card';

interface CardDisplayProps {
  hand: CardType[];
  heldCards: boolean[];
  recommendedHolds?: boolean[];
  onToggleHold: (index: number) => void;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  hand,
  heldCards,
  recommendedHolds = new Array(5).fill(false),
  onToggleHold
}) => {
  return (
    <div className="card p-6 mb-4">
      <h2 className="text-lg font-semibold mb-4 text-center">Current Hand</h2>
      <div className="flex justify-center gap-2 sm:gap-4">
        {hand.map((card, index) => (
          card ? (
            <div key={index} className="flex flex-col items-center">
              <Card
                card={card}
                isHeld={heldCards[index]}
                isRecommended={recommendedHolds[index]}
                onClick={() => onToggleHold(index)}
              />
            </div>
          ) : (
            <div 
              key={index} 
              className="card-placeholder"
            >
              <span>?</span>
            </div>
          )
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        Tap a card to toggle hold/discard
      </div>
    </div>
  );
};

export default CardDisplay;
