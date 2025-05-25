import React from 'react';
import { HandRank } from '../lib/evaluator';
import { PayTable, DEFAULT_PAY_TABLE } from '../lib/calculator';

interface PayTableConfigProps {
  payTable: PayTable;
  onPayTableChange: (newPayTable: PayTable) => void;
}

// Predefined pay tables for Jacks or Better
const payTablePresets = {
  '9/6 (Full Pay)': {
    ...DEFAULT_PAY_TABLE,
    [HandRank.FULL_HOUSE]: 9,
    [HandRank.FLUSH]: 6
  },
  '8/5': {
    ...DEFAULT_PAY_TABLE,
    [HandRank.FULL_HOUSE]: 8,
    [HandRank.FLUSH]: 5
  },
  '7/5': {
    ...DEFAULT_PAY_TABLE,
    [HandRank.FULL_HOUSE]: 7,
    [HandRank.FLUSH]: 5
  },
  '6/5': {
    ...DEFAULT_PAY_TABLE,
    [HandRank.FULL_HOUSE]: 6,
    [HandRank.FLUSH]: 5
  }
};

// Labels for hand types in order
const handLabels = [
  { rank: HandRank.ROYAL_FLUSH, label: 'Royal Flush' },
  { rank: HandRank.STRAIGHT_FLUSH, label: 'Straight Flush' },
  { rank: HandRank.FOUR_OF_A_KIND, label: 'Four of a Kind' },
  { rank: HandRank.FULL_HOUSE, label: 'Full House' },
  { rank: HandRank.FLUSH, label: 'Flush' },
  { rank: HandRank.STRAIGHT, label: 'Straight' },
  { rank: HandRank.THREE_OF_A_KIND, label: 'Three of a Kind' },
  { rank: HandRank.TWO_PAIR, label: 'Two Pair' },
  { rank: HandRank.JACKS_OR_BETTER, label: 'Jacks or Better' }
];

const PayTableConfig: React.FC<PayTableConfigProps> = ({ payTable, onPayTableChange }) => {
  // Find if current payTable matches any preset
  const currentPreset = Object.entries(payTablePresets).find(
    ([, preset]) => 
      preset[HandRank.FULL_HOUSE] === payTable[HandRank.FULL_HOUSE] && 
      preset[HandRank.FLUSH] === payTable[HandRank.FLUSH]
  );
  
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value;
    if (presetName && payTablePresets[presetName]) {
      onPayTableChange(payTablePresets[presetName]);
    }
  };
  
  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold mb-4 text-center">Pay Table</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pay Table Preset
        </label>
        <select
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={currentPreset ? currentPreset[0] : ''}
          onChange={handlePresetChange}
        >
          {Object.keys(payTablePresets).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
          {!currentPreset && <option value="">Custom</option>}
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hand
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payout
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {handLabels.map(({ rank, label }) => (
              <tr key={rank}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {label}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {rank === HandRank.ROYAL_FLUSH ? (
                    <>
                      <span className="text-green-600">{payTable[rank]}</span>
                      <span className="text-xs text-gray-500 ml-1">(5 coins)</span>
                    </>
                  ) : (
                    <span className={
                      (rank === HandRank.FULL_HOUSE || rank === HandRank.FLUSH) 
                        ? 'text-green-600 font-bold' 
                        : ''
                    }>
                      {payTable[rank]}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>
          The name "9/6" refers to the payouts for Full House (9x) and Flush (6x).
          Full-pay Jacks or Better (9/6) has a theoretical return of 99.54%.
        </p>
      </div>
    </div>
  );
};

export default PayTableConfig;
