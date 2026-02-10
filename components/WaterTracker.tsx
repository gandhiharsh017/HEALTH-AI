
import React from 'react';

interface WaterTrackerProps {
  current: number;
  goal: number;
  onAdd: (amount: number) => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ current, goal, onAdd }) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="glass-card p-6 rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Water Hydration</h3>
        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Goal: {goal}ml
        </span>
      </div>

      <div className="relative h-64 w-full bg-blue-50 rounded-2xl overflow-hidden flex items-end">
        <div 
          className="w-full bg-blue-400 transition-all duration-1000 ease-out"
          style={{ height: `${percentage}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
            <p className="text-4xl font-black text-blue-900 drop-shadow-sm">{current}ml</p>
            <p className="text-blue-700 font-medium">Daily Intake</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        {[250, 500, 750].map((amt) => (
          <button
            key={amt}
            onClick={() => onAdd(amt)}
            className="py-3 px-4 bg-white border border-blue-100 text-blue-600 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            +{amt}ml
          </button>
        ))}
      </div>
    </div>
  );
};

export default WaterTracker;
