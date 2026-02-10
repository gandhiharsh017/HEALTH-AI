
import React, { useState, useEffect, useCallback } from 'react';
import { UserStats, Tab, ActivityData } from './types';
import StatCard from './components/StatCard';
import WaterTracker from './components/WaterTracker';
import ActivityChart from './components/ActivityChart';
import AICoach from './components/AICoach';

// Mock activity data
const MOCK_ACTIVITY: ActivityData[] = [
  { time: '06:00', steps: 0, calories: 0 },
  { time: '09:00', steps: 1200, calories: 150 },
  { time: '12:00', steps: 4500, calories: 420 },
  { time: '15:00', steps: 6800, calories: 580 },
  { time: '18:00', steps: 9200, calories: 810 },
  { time: '21:00', steps: 10450, calories: 920 },
];

const INITIAL_STATS: UserStats = {
  steps: 0,
  waterIntake: 0,
  caloriesBurned: 0,
  heartRate: 72,
  distance: 0,
  sleepHours: 0,
};

const STORAGE_KEY = 'health_ai_stats';
const DATE_KEY = 'health_ai_last_date';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  
  // Initialize stats from localStorage or defaults
  const [stats, setStats] = useState<UserStats>(() => {
    const savedDate = localStorage.getItem(DATE_KEY);
    const today = new Date().toDateString();
    
    // If it's a new day, return initial stats
    if (savedDate !== today) {
      return INITIAL_STATS;
    }

    const savedStats = localStorage.getItem(STORAGE_KEY);
    return savedStats ? JSON.parse(savedStats) : INITIAL_STATS;
  });

  // Effect to handle 24-hour (Daily) reset check
  useEffect(() => {
    const checkReset = () => {
      const savedDate = localStorage.getItem(DATE_KEY);
      const today = new Date().toDateString();

      if (savedDate !== today) {
        setStats(INITIAL_STATS);
        localStorage.setItem(DATE_KEY, today);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATS));
      }
    };

    // Check on mount
    checkReset();

    // Check every minute in case the app stays open overnight
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    localStorage.setItem(DATE_KEY, new Date().toDateString());
  }, [stats]);

  // Simulate real-time heart rate variation (doesn't need persistence)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        heartRate: 68 + Math.floor(Math.random() * 12)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddWater = (amount: number) => {
    setStats(prev => ({ ...prev, waterIntake: prev.waterIntake + amount }));
  };

  const renderDashboard = () => (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Hi, Alex! 👋</h1>
          <p className="text-gray-500 font-medium">Daily stats reset at midnight.</p>
        </div>
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
          <img src="https://picsum.photos/seed/user/100" className="w-10 h-10 rounded-xl" alt="profile" />
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Steps" 
          value={stats.steps.toLocaleString()} 
          unit="steps" 
          trend={stats.steps > 0 ? "Tracking..." : "Goal: 10k"}
          color="border-emerald-500"
          icon={<svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        />
        <StatCard 
          title="Distance" 
          value={stats.distance.toFixed(1)} 
          unit="km" 
          color="border-blue-500"
          icon={<svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard 
          title="Heart Rate" 
          value={stats.heartRate} 
          unit="bpm" 
          color="border-rose-500"
          icon={<svg className="w-6 h-6 text-rose-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        />
        <StatCard 
          title="Calories" 
          value={stats.caloriesBurned} 
          unit="kcal" 
          color="border-amber-500"
          icon={<svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.98 7.98 0 01-2.343 5.657z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart data={MOCK_ACTIVITY} />
        <WaterTracker current={stats.waterIntake} goal={3000} onAdd={handleAddWater} />
      </div>

      <div className="glass-card p-6 rounded-3xl bg-indigo-600 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">AI Health Strategy</h3>
          <p className="text-indigo-100 text-sm mb-4 max-w-md">
            {stats.steps === 0 ? "You haven't started your steps yet today! A short walk can boost your energy levels." : `You've taken ${stats.steps} steps so far. Keep it up!`}
          </p>
          <button 
            onClick={() => setActiveTab(Tab.AI_COACH)}
            className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
          >
            Talk to Coach
          </button>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <main className="h-[calc(100vh-140px)] overflow-y-auto">
        {activeTab === Tab.DASHBOARD && renderDashboard()}
        {activeTab === Tab.TRACKER && (
          <div className="space-y-6 pb-24">
            <h2 className="text-2xl font-bold">Comprehensive Logs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WaterTracker current={stats.waterIntake} goal={3000} onAdd={handleAddWater} />
              <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-lg font-bold mb-4">Manual Activity Log</h3>
                <div className="space-y-4">
                   <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                      <span>Add Steps</span>
                      <div className="flex gap-2">
                        <button onClick={() => setStats(s => ({...s, steps: s.steps + 500, distance: s.distance + 0.35, caloriesBurned: s.caloriesBurned + 20}))} className="bg-indigo-600 text-white px-4 py-1 rounded-lg">+500</button>
                      </div>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                      <span>Sleep (Hours)</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setStats(s => ({...s, sleepHours: Math.max(0, s.sleepHours - 0.5)}))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border shadow-sm">-</button>
                        <span className="font-bold">{stats.sleepHours}h</span>
                        <button onClick={() => setStats(s => ({...s, sleepHours: s.sleepHours + 0.5}))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border shadow-sm">+</button>
                      </div>
                   </div>
                   <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
                      <button 
                        onClick={() => {
                          if (confirm("Reset all data for today?")) {
                            setStats(INITIAL_STATS);
                          }
                        }}
                        className="text-indigo-600 font-bold text-sm"
                      >
                        Manually Reset Daily Stats
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === Tab.AI_COACH && (
          <div className="h-full pb-24">
            <AICoach stats={stats} />
          </div>
        )}
        {activeTab === Tab.PROFILE && (
          <div className="max-w-md mx-auto space-y-8 pb-24">
             <div className="text-center">
                <img src="https://picsum.photos/seed/user/200" className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-100 shadow-xl" alt="profile" />
                <h2 className="mt-4 text-2xl font-black">Alex Thompson</h2>
                <p className="text-gray-500">Member since Jan 2024</p>
             </div>
             <div className="glass-card p-6 rounded-3xl space-y-4">
                <div className="flex justify-between border-b pb-4">
                   <span className="text-gray-500">Weight</span>
                   <span className="font-bold">78.5 kg</span>
                </div>
                <div className="flex justify-between border-b pb-4">
                   <span className="text-gray-500">Height</span>
                   <span className="font-bold">182 cm</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-500">Daily Step Goal</span>
                   <span className="font-bold">12,000</span>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass-card rounded-3xl shadow-2xl p-2 z-50 flex items-center justify-between">
        {[
          { id: Tab.DASHBOARD, label: 'Home', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
          { id: Tab.TRACKER, label: 'Track', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
          { id: Tab.AI_COACH, label: 'AI Coach', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
          { id: Tab.PROFILE, label: 'Profile', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg scale-110' 
                : 'text-gray-400 hover:text-indigo-500'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
