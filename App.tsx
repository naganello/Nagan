import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, Bot, Utensils, Trophy } from 'lucide-react';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import AIPlanner from './components/AIPlanner';
import NutritionTracker from './components/NutritionTracker';
import ChallengeTracker from './components/ChallengeTracker';
import { Workout, Meal, Challenge } from './types';

// Hook for local storage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'ai' | 'nutrition' | 'challenges'>('dashboard');
  
  // Persistence
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('fitgenius_workouts', []);
  const [meals, setMeals] = useLocalStorage<Meal[]>('fitgenius_meals', []);
  const [challenges, setChallenges] = useLocalStorage<Challenge[]>('fitgenius_challenges', []);

  // Handlers
  const handleSaveWorkout = (newWorkout: Workout) => {
    setWorkouts([...workouts, newWorkout]);
    setActiveTab('dashboard');
  };

  const handleAddMeal = (meal: Meal) => {
    setMeals([...meals, meal]);
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const handleAddChallenge = (challenge: Challenge) => {
    setChallenges([...challenges, challenge]);
  };

  const handleUpdateChallenge = (id: string, current: number) => {
    setChallenges(challenges.map(c => {
      if (c.id === id) {
        const completed = current >= c.target;
        return { ...c, current, completed };
      }
      return c;
    }));
  };

  const handleDeleteChallenge = (id: string) => {
    setChallenges(challenges.filter(c => c.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard workouts={workouts} />;
      case 'log':
        return <WorkoutLogger onSave={handleSaveWorkout} onCancel={() => setActiveTab('dashboard')} />;
      case 'ai':
        return <AIPlanner />;
      case 'nutrition':
        return <NutritionTracker meals={meals} onAddMeal={handleAddMeal} onDeleteMeal={handleDeleteMeal} />;
      case 'challenges':
        return (
          <ChallengeTracker 
            challenges={challenges} 
            onAddChallenge={handleAddChallenge} 
            onUpdateChallenge={handleUpdateChallenge} 
            onDeleteChallenge={handleDeleteChallenge}
          />
        );
      default:
        return <Dashboard workouts={workouts} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-gray-100 font-sans selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="p-4 sticky top-0 bg-dark/80 backdrop-blur-md z-10 border-b border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
          FitGenius AI
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pt-6 max-w-2xl">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark/95 backdrop-blur-md border-t border-gray-800 z-50">
        <div className="container mx-auto max-w-2xl flex justify-between px-6 py-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-primary scale-110' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <LayoutDashboard size={22} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button 
            onClick={() => setActiveTab('log')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'log' ? 'text-primary scale-110' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <PlusCircle size={22} strokeWidth={activeTab === 'log' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Log</span>
          </button>

          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'ai' ? 'text-secondary scale-110' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Bot size={22} strokeWidth={activeTab === 'ai' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Coach</span>
          </button>

          <button 
            onClick={() => setActiveTab('nutrition')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'nutrition' ? 'text-orange-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Utensils size={22} strokeWidth={activeTab === 'nutrition' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Food</span>
          </button>

           <button 
            onClick={() => setActiveTab('challenges')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'challenges' ? 'text-purple-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Trophy size={22} strokeWidth={activeTab === 'challenges' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Sfide</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;