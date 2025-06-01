# Video Poker Calculator

A sophisticated video poker calculator that implements expert strategy for optimal play in Jacks or Better and other video poker variants. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🎮 Interactive card selection interface
- 📊 Detailed Expected Value (EV) calculations
- 🧠 Expert strategy recommendations following professional-level pattern matching
- 🎯 Comprehensive edge case handling for optimal play
- 📱 Mobile-responsive design
- 🧪 Extensive test suite for strategy verification

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/henryjrobinson/Video-Poker.git
cd Video-Poker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Tests

The project includes a comprehensive test suite that verifies optimal strategy across various scenarios:

```bash
# Run all tests
npm test

# Run specific test file
node run-tests.js src/tests/yourTest.test.ts
```

## Project Structure

```
Video-Poker/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── lib/                # Core calculation engine
│   ├── patterns/           # Strategy pattern definitions
│   ├── tests/              # Test suite
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── docs/                   # Documentation
```

## Deployment

This project is configured for deployment on Netlify. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick deployment:

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy

## Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Jest
- **Deployment**: Netlify
- **CI/CD**: GitHub Actions

## Project Roadmap

See [TODO.md](./TODO.md) for the complete project roadmap and current status.

## Edge Cases Handled

The calculator implements a comprehensive set of edge cases including:

- Priority conflicts between different potential hands
- Deceptive hands with multiple drawing options
- Pay table variations
- Special kicker considerations
- See memory [8ef0c53c-2b0a-4ae3-97b0-097823e16da5] for more details

## License

MIT
