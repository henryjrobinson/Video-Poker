/**
 * Utility functions for the video poker application
 */

/**
 * Format expected value in dollar terms based on a bet amount
 * 
 * @param ev The expected value in coins
 * @param coinValue The value of each coin in dollars (defaults to $0.25)
 * @param betMultiplier The bet multiplier (typically 5 for max bet)
 * @returns Formatted string with dollar amount
 */
export function formatEVasDollars(ev: number, coinValue: number = 0.25, betMultiplier: number = 5): string {
  // Calculate total bet amount
  const betAmount = coinValue * betMultiplier;
  
  // Calculate dollar value of the EV
  const dollarValue = (ev / betMultiplier) * betAmount;
  
  // Calculate ROI percentage
  const roiPercentage = (dollarValue / betAmount) * 100;
  
  // Format the dollar value
  const formattedDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(dollarValue);
  
  // Format the ROI percentage
  const formattedROI = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(roiPercentage / 100);
  
  return `${formattedDollar} (${formattedROI} ROI)`;
}

/**
 * Convert a hold pattern bitmap to a readable description
 * e.g., 0b11001 (binary) would return "Hold 1st, 2nd, and 5th cards"
 * 
 * @param holdPattern A binary number representing which cards to hold (1=hold, 0=discard)
 * @returns A human-readable description of which cards to hold
 */
export function holdPatternToString(holdPattern: number): string {
  if (holdPattern === 0) {
    return "Discard all cards";
  }
  
  if (holdPattern === 31) { // 31 is 0b11111, meaning hold all cards
    return "Hold all cards";
  }
  
  const positions = ['1st', '2nd', '3rd', '4th', '5th'];
  const heldPositions = positions.filter((_, i) => (holdPattern & (1 << i)) > 0);
  
  if (heldPositions.length === 1) {
    return `Hold ${heldPositions[0]} card only`;
  }
  
  const lastPosition = heldPositions.pop();
  return `Hold ${heldPositions.join(', ')} and ${lastPosition} cards`;
}

/**
 * Format probability as a percentage with proper precision
 * 
 * @param probability Probability value between 0 and 1
 * @param precision Number of decimal places to show (default: 2)
 * @returns Formatted percentage string
 */
export function formatProbability(probability: number, precision: number = 2): string {
  return `${(probability * 100).toFixed(precision)}%`;
}
