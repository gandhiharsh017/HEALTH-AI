
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ActivityData } from '../types';

interface ActivityChartProps {
  data: ActivityData[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  return (
    <div className="glass-card p-6 rounded-3xl h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Activity Trend</h3>
        <select className="bg-gray-50 border-none rounded-lg text-sm px-2 py-1 outline-none">
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
        </select>
      </div>
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="steps" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorSteps)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
