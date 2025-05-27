import React, { useState } from 'react';
import { HandRank } from '../lib/evaluator';
import { HoldResult } from '../lib/identity-pattern-calculator';
import StrategyExplainer from './StrategyExplainer';
import { formatEVasDollars, formatProbability } from '../lib/utils';
import { describeCards } from '../lib/card-utils';

interface ResultsPanelProps {
  result?: HoldResult;
  alternatives?: HoldResult[];
  onSelectAlternative: (alternative: HoldResult) => void;
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
  const [showStrategy, setShowStrategy] = useState(false);
  
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
        <div className="text-sm text-green-700 mb-2 font-semibold">
          {result.detailedDescription}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-green-700">
              <span className="font-medium">Expected Value:</span> 
              <span className="font-semibold ml-1">{result.ev.toFixed(2)} coins</span>
              <div className="relative group ml-1">
                <span className="cursor-help text-gray-500">ⓘ</span>
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white border border-gray-200 rounded shadow-lg p-2 w-64 z-10 text-xs text-gray-700">
                  Expected Value (EV) represents the average return on your bet over the long run. 
                  A value above 1.0 means you're getting more back than you're putting in.
                </div>
              </div>
            </div>
            <div className="text-green-700">
              <span className="font-medium">Cash Value:</span> 
              <span className="font-semibold ml-1">{formatEVasDollars(result.ev)}</span>
            </div>
          </div>
          
          {/* EV Visualization Bar */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full rounded-full ${result.ev >= 1 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${Math.min(Math.max(result.ev / 10 * 100, 5), 100)}%` }} 
              title={`Expected Value: ${result.ev.toFixed(2)}`}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>1.0 (Break-even)</span>
            <span>5.0+</span>
          </div>
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
          <div className="text-xs text-gray-500 mb-3">
            These are your chances of making each hand after drawing new cards. Hover over any hand to see its payout.
          </div>
          <ul className="space-y-2">
            {Object.entries(result.handProbabilities)
              .filter(([, probability]) => probability > 0)
              .sort(([, a], [, b]) => Number(b) - Number(a))
              .map(([rank, probability]) => {
                const rankNum = Number(rank);
                const payoutMultiplier = rankNum === HandRank.ROYAL_FLUSH ? 800 : 
                                        rankNum === HandRank.STRAIGHT_FLUSH ? 50 :
                                        rankNum === HandRank.FOUR_OF_A_KIND ? 25 :
                                        rankNum === HandRank.FULL_HOUSE ? 9 :
                                        rankNum === HandRank.FLUSH ? 6 :
                                        rankNum === HandRank.STRAIGHT ? 4 :
                                        rankNum === HandRank.THREE_OF_A_KIND ? 3 :
                                        rankNum === HandRank.TWO_PAIR ? 2 :
                                        rankNum === HandRank.JACKS_OR_BETTER ? 1 : 0;
                                        
                return (
                  <li key={rank} className="relative group">
                    <div className="flex justify-between text-sm items-center">
                      <div className="flex items-center">
                        <span>{handRankNames[rankNum]}</span>
                        <div className="relative ml-1">
                          <span className="cursor-help text-gray-400 text-xs">ⓘ</span>
                          <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block bg-white border border-gray-200 rounded shadow-lg p-2 z-10 text-xs text-gray-700 w-48">
                            Pays {payoutMultiplier}:1 ({payoutMultiplier} coins per coin bet)
                          </div>
                        </div>
                      </div>
                      <span className="font-medium">{formatProbability(probability)}</span>
                    </div>
                    {/* Probability visualization bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className={`h-full rounded-full ${payoutMultiplier >= 4 ? 'bg-green-500' : payoutMultiplier > 0 ? 'bg-blue-400' : 'bg-gray-300'}`}
                        style={{ width: `${Math.max(probability * 100, 0.5)}%` }}
                      ></div>
                    </div>
                  </li>
                );
              })}
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
            <span className="font-medium">Alternative Plays ({alternatives.length})</span>
            <span>{showAlternatives ? '▲' : '▼'}</span>
          </button>
          
          {showAlternatives && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
              <div className="text-xs text-gray-500 mb-2">
                These alternative plays might be better in certain situations or with different pay tables.
              </div>
              
              {alternatives.map((alt, index) => {
                // Calculate difference from optimal EV
                const evDifference = alt.ev - result.ev;
                const percentDifference = result.ev > 0 ? (evDifference / result.ev) * 100 : 0;
                const isCloseToOptimal = Math.abs(percentDifference) < 5; // Within 5% of optimal
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium flex items-center">
                          {alt.description}
                          {isCloseToOptimal && (
                            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Close to Optimal</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          {alt.detailedDescription}
                        </div>
                      </div>
                      <button 
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 py-1 px-2 rounded"
                        onClick={() => onSelectAlternative(alt)}
                      >
                        Try This Play
                      </button>
                    </div>
                    
                    <div className="text-sm mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Expected Value:</span>
                        <span className="font-medium">{alt.ev.toFixed(2)} coins</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cash Value:</span>
                        <span>{formatEVasDollars(alt.ev)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-600">Compared to optimal:</span>
                        <span className={`font-medium ${evDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {evDifference > 0 ? '+' : ''}{evDifference.toFixed(2)} coins ({percentDifference.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    
                    {/* Comparative EV visualization */}
                    <div className="mt-2 relative h-6 bg-gray-100 rounded overflow-hidden">
                      {/* Baseline for optimal play */}
                      <div className="absolute top-0 bottom-0 border-r-2 border-black" style={{ left: `${Math.min(Math.max(result.ev / 10 * 100, 5), 100)}%` }}></div>
                      {/* Alternative play */}
                      <div className={`absolute top-0 bottom-0 ${alt.ev >= result.ev ? 'bg-green-200' : 'bg-red-200'}`} 
                           style={{ 
                             left: evDifference < 0 ? `${Math.min(Math.max(alt.ev / 10 * 100, 0), 100)}%` : `${Math.min(Math.max(result.ev / 10 * 100, 0), 100)}%`,
                             width: `${Math.abs(evDifference) / 10 * 100}%`
                           }}>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                        Optimal vs Alternative
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      
      {/* Strategy Explanation Toggle */}
      <button
        className="w-full flex justify-between items-center py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg mb-3"
        onClick={() => setShowStrategy(!showStrategy)}
      >
        <span className="font-medium">Strategy Explanation</span>
        <span>{showStrategy ? '▲' : '▼'}</span>
      </button>
      
      {/* Strategy Explanation */}
      {showStrategy && (
        <div className="mt-4">
          <StrategyExplainer 
            strategyName={result.description} 
            showGeneral={false}
          />
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
