import React, { useState } from 'react';
import { getStrategyExplanation, expectedValueExplanation, strategyChartText } from '../lib/strategy-guide';
import ReactMarkdown from 'react-markdown';

interface StrategyExplainerProps {
  strategyName?: string;
  showGeneral?: boolean;
}

/**
 * Component that explains poker strategy rules to the player
 */
const StrategyExplainer: React.FC<StrategyExplainerProps> = ({ 
  strategyName, 
  showGeneral = false 
}) => {
  const [showChart, setShowChart] = useState(false);
  const [activeTab, setActiveTab] = useState<'explanation' | 'examples' | 'chart'>('explanation');
  
  // Examples for different types of hands
  const strategyExamples: Record<string, { description: string, visual: string }> = {
    'Royal Flush': {
      description: 'A royal flush is the best possible hand in video poker, consisting of A-K-Q-J-10 of the same suit.',
      visual: '🂮 🂭 🂭 🂫 🂪'
    },
    '4 to a Royal Flush': {
      description: 'When you have four cards to a royal flush, you\'re just one card away from the jackpot!',
      visual: '🂮 🂭 🂭 🂫 🃑'
    },
    'Straight Flush': {
      description: 'Five sequential cards of the same suit. Second highest paying hand.',
      visual: '🂩 🂨 🂧 🂦 🂥'
    },
    'Four of a Kind': {
      description: 'Four cards of the same rank, such as four Aces or four Kings.',
      visual: '🂡 🂱 🃁 🃑 🂪'
    },
    'Full House': {
      description: 'Three of a kind plus a pair, such as three Aces and two Kings.',
      visual: '🂡 🂱 🃁 🂮 🃎'
    },
    'Flush': {
      description: 'Five cards of the same suit, not in sequence.',
      visual: '🂡 🂪 🂧 🂵 🂲'
    },
    'Straight': {
      description: 'Five sequential cards of mixed suits.',
      visual: '🂩 🂸 🃇 🃖 🂥'
    },
    'Three of a Kind': {
      description: 'Three cards of the same rank.',
      visual: '🂡 🂱 🃁 🂪 🃃'
    },
    'Two Pair': {
      description: 'Two different pairs, such as two Kings and two Queens.',
      visual: '🂮 🃎 🂭 🃍 🂪'
    },
    'Jacks or Better': {
      description: 'A pair of Jacks, Queens, Kings, or Aces.',
      visual: '🂫 🃋 🂪 🃃 🂧'
    },
  };
  
  // Find example that matches the strategy name or return a default
  const findMatchingExample = () => {
    if (!strategyName) return null;
    
    const exactMatch = Object.entries(strategyExamples).find(([key]) => 
      strategyName.includes(key)
    );
    
    if (exactMatch) return exactMatch[1];
    
    // Default example
    return {
      description: 'Follow the recommended strategy for optimal results.',
      visual: '🂠 🂠 🂠 🂠 🂠'
    };
  };
  
  const example = findMatchingExample();
  
  return (
    <div className="strategy-explainer p-4 bg-gray-50 rounded-md shadow-sm">
      {strategyName ? (
        <div className="strategy-specific">
          {/* Tabs for different content */}
          <div className="flex border-b mb-4">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'explanation' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('explanation')}
            >
              Explanation
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'examples' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('examples')}
            >
              Examples
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'chart' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('chart')}
            >
              Strategy Chart
            </button>
          </div>
          
          {/* Tab content */}
          {activeTab === 'explanation' && (
            <div>
              <h3 className="text-xl font-bold mb-2">Strategy for {strategyName}</h3>
              <div className="markdown-content prose prose-sm max-w-none">
                <ReactMarkdown>
                  {getStrategyExplanation(strategyName)}
                </ReactMarkdown>
              </div>
            </div>
          )}
          
          {activeTab === 'examples' && example && (
            <div>
              <h3 className="text-xl font-bold mb-3">Visual Example</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
                <div className="text-center text-4xl mb-3">{example.visual}</div>
                <p className="text-gray-700 text-sm">{example.description}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded p-3 text-sm text-blue-800">
                <p className="font-medium mb-1">Why this strategy matters:</p>
                <p>Following optimal strategy for this hand type maximizes your expected return over time. Even a single incorrect decision can reduce your long-term winnings.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'chart' && (
            <div>
              <h3 className="text-xl font-bold mb-3">Jacks or Better Strategy Chart</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 overflow-auto max-h-80">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap">{strategyChartText}</pre>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>This chart shows the priority order for different hand types. Always choose the highest priority play available.</p>
              </div>
            </div>
          )}
        </div>
      ) : null}
      
      {showGeneral ? (
        <div className="general-explanation mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-xl font-bold mb-3">Understanding Expected Value (EV)</h3>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <span className="text-2xl">EV</span>
              </div>
              <div>
                <h4 className="font-bold">Expected Value</h4>
                <p className="text-sm text-gray-600">The average return you can expect over the long run</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded border border-green-100">
                <div className="font-bold text-green-800 mb-1">EV &gt; 1.0</div>
                <div className="text-sm text-green-700">Profitable play (winning)</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                <div className="font-bold text-yellow-800 mb-1">EV = 1.0</div>
                <div className="text-sm text-yellow-700">Break-even play</div>
              </div>
              <div className="bg-red-50 p-3 rounded border border-red-100">
                <div className="font-bold text-red-800 mb-1">EV &lt; 1.0</div>
                <div className="text-sm text-red-700">Losing play over time</div>
              </div>
            </div>
          </div>
          
          <div className="markdown-content prose prose-sm max-w-none">
            <ReactMarkdown>
              {expectedValueExplanation}
            </ReactMarkdown>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StrategyExplainer;
