import React, { useState, useEffect } from 'react';
import './App.css';

// Core game modules
import { Card as CardType, createDeck } from './lib/cards';
// Use the identity-based calculator instead of position-based
import { calculateOptimalPlay, PlayResult } from './lib/identity-pattern-calculator';
import { defaultPayTable } from './lib/paytables';
// Card utility functions for identity-based approach
import { shouldHoldCard, cardsToPositionPattern } from './lib/card-utils';

// Strategy guide
import { strategyChartText, expectedValueExplanation } from './lib/strategy-guide';

// Components
import CardDisplay from './components/CardDisplay';
import CardSelector from './components/CardSelector';
import ResultsPanel from './components/ResultsPanel';
import TestRunner from './components/TestRunner';
import StrategyExplainer from './components/StrategyExplainer';

// Add CSS for tab navigation
import './styles/tabs.css';

function App() {
  // Game state
  const [hand, setHand] = useState<(CardType | null)[]>(Array(5).fill(null));
  const [heldCards, setHeldCards] = useState<boolean[]>(Array(5).fill(false));
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'calculator' | 'strategy'>('calculator');
  
  // Analysis results
  const [analysisResult, setAnalysisResult] = useState<PlayResult | null>(null);
  
  // Update results when hand changes
  useEffect(() => {
    console.log('Hand changed:', hand);
    // Only analyze when we have a full hand
    if (hand.every(card => card !== null)) {
      console.log('Full hand detected, calculating optimal play');
      try {
        const result = calculateOptimalPlay(hand as CardType[], defaultPayTable);
        console.log('Analysis result:', result);
        setAnalysisResult(result);
        
        // Update held cards based on card identities from optimal play
        // Instead of using holdPattern, we check if each card should be held based on its identity
        const cardsToHold = result.optimal.cardsToHold;
        const newHeldCards = (hand as CardType[]).map(card => 
          shouldHoldCard(card, cardsToHold)
        );
        setHeldCards(newHeldCards);
      } catch (error) {
        console.error('Error calculating optimal play:', error);
      }
    } else {
      console.log('Hand not complete yet');
      setAnalysisResult(null);
      setHeldCards(Array(5).fill(false));
    }
  }, [hand]);

  // Add a card to the hand
  const handleCardSelect = (card: CardType) => {
    console.log('Card selected:', card);
    // Find the first empty slot in the hand
    const emptyIndex = hand.findIndex(card => card === null);
    console.log('Empty index found:', emptyIndex);
    if (emptyIndex !== -1) {
      const newHand = [...hand];
      newHand[emptyIndex] = card;
      console.log('New hand:', newHand);
      setHand(newHand);
      setSelectedCards([...selectedCards, card]);
    } else {
      console.log('Hand is full, cannot add more cards');
    }
  };

  // Toggle hold status for a card
  const handleToggleHold = (index: number) => {
    if (hand[index] !== null) {
      const newHeldCards = [...heldCards];
      newHeldCards[index] = !newHeldCards[index];
      setHeldCards(newHeldCards);
    }
  };

  // Clear the current hand
  const handleClearHand = () => {
    setHand(Array(5).fill(null));
    setHeldCards(Array(5).fill(false));
    setSelectedCards([]);
    setAnalysisResult(null);
  };

  // Apply a different hold pattern based on card identities
  const handleSelectAlternative = (alternative: any) => {
    // Use the cardsToHold from the alternative strategy
    const cardsToHold = alternative.cardsToHold;
    
    // Check each card in the hand to see if it should be held
    const newHeldCards = (hand as CardType[]).map(card => 
      shouldHoldCard(card, cardsToHold)
    );
    
    setHeldCards(newHeldCards);
  };

  // Render the calculator tab content
  const renderCalculator = () => (
    <>
      <div className="card-display-container mb-8">
        <CardDisplay 
          hand={hand as CardType[]} 
          heldCards={heldCards}
          onToggleHold={handleToggleHold}
        />
      </div>
      
      <div className="flex justify-center mb-4">
        <button
          className="red"
          onClick={handleClearHand}
        >
          Clear Hand
        </button>
      </div>
      
      {analysisResult ? (
        <ResultsPanel 
          result={analysisResult.optimal} 
          alternatives={analysisResult.alternatives}
          onSelectAlternative={handleSelectAlternative}
        />
      ) : (
        <CardSelector 
          selectedCards={selectedCards} 
          onCardSelect={handleCardSelect} 
        />
      )}
    </>
  );

  // Render the test runner tab content
  const renderTestRunner = () => (
    <div className="test-runner-container">
      <TestRunner />
    </div>
  );
  
  // Render the strategy guide tab content
  const renderStrategyGuide = () => (
    <div className="strategy-guide-container">
      <h2 className="text-2xl font-bold mb-4">Video Poker Strategy Guide</h2>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-2">Understanding Expected Value</h3>
        <div className="prose">
          <StrategyExplainer showGeneral={true} />
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-2">Complete Strategy Chart</h3>
        <div className="prose whitespace-pre-line">
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {strategyChartText}
          </pre>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">About This Calculator</h3>
        <p className="text-blue-700 text-sm">
          This calculator uses a pattern-based approach to analyze video poker hands, just like
          real machines. It follows expert strategy for Jacks or Better (9/6) and can help you
          learn optimal play for every situation.
        </p>
      </div>
    </div>
  );

  return (
    <div className="app-container p-4 max-w-4xl mx-auto">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Video Poker Calculator</h1>
        <p className="text-gray-600 mb-4">Optimize your video poker strategy</p>
        
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            Calculator
          </button>
          <button 
            className={`tab-button ${activeTab === 'strategy' ? 'active' : ''}`}
            onClick={() => setActiveTab('strategy')}
          >
            Strategy Guide
          </button>
          {/* Test rig tab hidden */}
        </div>
      </header>
      
      <div className="tab-content">
        {activeTab === 'calculator' 
          ? renderCalculator() 
          : renderStrategyGuide()
        }
      </div>
    </div>
  );
}

export default App;
