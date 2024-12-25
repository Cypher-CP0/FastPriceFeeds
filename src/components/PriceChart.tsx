import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

interface PriceChartProps {
  data: [number, number][];
  timeRange: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, timeRange }) => {
  const chartData = data.map(([timestamp, price]) => ({
    date: new Date(timestamp),
    price: price
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(date, 'MMM dd')}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            labelFormatter={(date) => format(date, 'MMM dd, yyyy HH:mm')}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};