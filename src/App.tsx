import React, { useState, useEffect } from 'react';
import './App.css';

// Core game modules
import { Card as CardType, createDeck } from './lib/cards';
// Use the pattern-based calculator
import { calculateOptimalPlay, PlayResult } from './lib/pattern-calculator';
import { defaultPayTable } from './lib/paytables';

// Components
import CardDisplay from './components/CardDisplay';
import CardSelector from './components/CardSelector';
import ResultsPanel from './components/ResultsPanel';
import TestRunner from './components/TestRunner';

// Add CSS for tab navigation
import './styles/tabs.css';

function App() {
  // Game state
  const [hand, setHand] = useState<(CardType | null)[]>(Array(5).fill(null));
  const [heldCards, setHeldCards] = useState<boolean[]>(Array(5).fill(false));
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'calculator' | 'test-runner'>('calculator');
  
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
        
        // Update held cards based on optimal play
        const optimalHeldPattern = result.optimal.holdPattern;
        const newHeldCards = Array(5).fill(false).map((_, i) => 
          Boolean(optimalHeldPattern & (1 << i))
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

  // Apply a different hold pattern
  const handleSelectAlternative = (holdPattern: number) => {
    const newHeldCards = Array(5).fill(false).map((_, i) => 
      Boolean(holdPattern & (1 << i))
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
            className={`tab-button ${activeTab === 'test-runner' ? 'active' : ''}`}
            onClick={() => setActiveTab('test-runner')}
          >
            Test Rig
          </button>
        </div>
      </header>
      
      <div className="tab-content">
        {activeTab === 'calculator' ? renderCalculator() : renderTestRunner()}
      </div>
    </div>
  );
}

export default App;
