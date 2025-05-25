import React, { useState } from 'react';
import { HandRank } from '../lib/evaluator';
import { HoldResult } from '../lib/calculator';

interface ResultsPanelProps {
  result?: HoldResult;
  alternatives?: HoldResult[];
  onSelectAlternative: (holdPattern: number) => void;
}

// Map of hand ranks to their display names
const handRankNames: Record<number, string> = {
  [HandRank.ROYAL_FLUSH]: 'Royal Flush',
  [HandRank.STRAIGHT_FLUSH]: 'Straight Flush',
  [HandRank.FOUR_OF_A_KIND]: 'Four of a Kind',
  [HandRank.FULL_HOUSE]: 'Full House',
  [HandRank.FLUSH]: 'Flush',
  [HandRank.STRAIGHT]: 'Straight',
  [HandRank.THREE_OF_A_KIND]: 'Three of a Kind',
  [HandRank.TWO_PAIR]: 'Two Pair',
  [HandRank.JACKS_OR_BETTER]: 'Jacks or Better',
  [HandRank.HIGH_CARD]: 'High Card/Low Pair'
};

const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  result,
  alternatives = [],
  onSelectAlternative
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  
  console.log('ResultsPanel rendered with result:', result);
  console.log('Alternatives:', alternatives);
  
  if (!result) {
    console.log('No result available, showing placeholder');
    return (
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-2 text-center">Analysis</h2>
        <p className="text-gray-500 text-center">
          Select 5 cards to see the optimal play
        </p>
      </div>
    );
  }
  
  console.log('Showing analysis for result:', result.description);
  
  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold mb-2 text-center">Optimal Play</h2>
      
      <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
        <div className="font-medium text-green-800 mb-1">
          {result.description}
        </div>
        <div className="text-sm text-green-700">
          Expected Value: <span className="font-semibold">{result.ev.toFixed(2)} coins</span>
        </div>
      </div>
      
      {/* Probability Details Toggle */}
      <button
        className="w-full flex justify-between items-center py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg mb-3"
        onClick={() => setShowDetails(!showDetails)}
      >
        <span className="font-medium">Win Probabilities</span>
        <span>{showDetails ? '▲' : '▼'}</span>
      </button>
      
      {/* Probability Details */}
      {showDetails && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <ul className="space-y-1">
            {Object.entries(result.handProbabilities)
              .filter(([, probability]) => probability > 0)
              .sort(([, a], [, b]) => Number(b) - Number(a))
              .map(([rank, probability]) => (
                <li key={rank} className="flex justify-between text-sm">
                  <span>{handRankNames[Number(rank)]}</span>
                  <span className="font-medium">{(probability * 100).toFixed(2)}%</span>
                </li>
              ))}
          </ul>
        </div>
      )}
      
      {/* Alternative Plays Toggle */}
      {alternatives.length > 0 && (
        <>
          <button
            className="w-full flex justify-between items-center py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg mb-3"
            onClick={() => setShowAlternatives(!showAlternatives)}
          >
            <span className="font-medium">Alternative Plays</span>
            <span>{showAlternatives ? '▲' : '▼'}</span>
          </button>
          
          {/* Alternative Plays */}
          {showAlternatives && (
            <div className="space-y-2">
              {alternatives.map((alt, index) => (
                <div 
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectAlternative(alt.holdPattern)}
                >
                  <div className="font-medium text-gray-800 mb-1">
                    {alt.description}
                  </div>
                  <div className="text-sm text-gray-600">
                    EV: {alt.ev.toFixed(2)} coins
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResultsPanel;
