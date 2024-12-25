import { createElement } from 'react';

export const formatPercentage = (value: number | null | undefined) => {
  if (value === undefined || value === null) {
    return createElement('span', { className: 'text-gray-400' }, 'N/A');
  }
  
  const isPositive = value > 0;
  return createElement(
    'span',
    {
      className: `${isPositive ? 'text-green-500' : 'text-red-500'}`,
    },
    `${isPositive ? '+' : ''}${value.toFixed(2)}%`
  );
};