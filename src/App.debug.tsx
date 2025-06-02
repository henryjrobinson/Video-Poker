import { useState } from 'react'
import './App.css'

/**
 * Simplified Debug App Component
 * 
 * This component is a minimal version of the app to test deployment
 * without any complex logic or edge case handling.
 */
function AppDebug() {
  const [count, setCount] = useState(0)

  return (
    <div className="debug-container" style={{ 
      fontFamily: 'sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1>Video Poker Debug Mode</h1>
      <div style={{ marginBottom: '20px' }}>
        <p>If you can see this page, React is working correctly.</p>
        <button 
          onClick={() => setCount((count) => count + 1)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Count: {count}
        </button>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {['♥', '♦', '♠', '♣', '♥'].map((suit, index) => (
          <div key={index} style={{
            width: '80px',
            height: '120px',
            border: '2px solid #000',
            borderRadius: '10px',
            margin: '10px',
            padding: '10px',
            textAlign: 'center',
            fontSize: '24px',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            color: ['♥', '♦'].includes(suit) ? 'red' : 'black'
          }}>
            {suit}<br />
            {['A', 'K', 'Q', 'J', '10'][index]}
          </div>
        ))}
      </div>

      <p>This is a minimal React component with basic state management.</p>
      <p>
        <a href="/test.html" style={{ color: '#2196F3' }}>
          View Static Test Page
        </a>
      </p>
    </div>
  )
}

export default AppDebug
