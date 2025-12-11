import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, Bot, Utensils, Trophy, User as UserIcon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import AIPlanner from './components/AIPlanner';
import NutritionTracker from './components/NutritionTracker';
import ChallengeTracker from './components/ChallengeTracker';
import Auth from './components/Auth';
import Profile from './components/Profile';
import { Workout, Meal, Challenge, User } from './types';

// Hook for local storage with support for dynamic keys
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Use a state to force re-render when key changes
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize/Read whenever the key changes
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(error);
      setStoredValue(initialValue);
    }
  }, [key]);

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

interface AuthenticatedAppProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (u: User) => void;
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({ user, onLogout, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'ai' | 'nutrition' | 'challenges' | 'profile'>('dashboard');
  
  // Dynamic Keys based on User ID to ensure data isolation
  const workoutKey = `fitgenius_workouts_${user.id}`;
  const mealKey = `fitgenius_meals_${user.id}`;
  const challengeKey = `fitgenius_challenges_${user.id}`;

  const [workouts, setWorkouts] = useLocalStorage<Workout[]>(workoutKey, []);
  const [meals, setMeals] = useLocalStorage<Meal[]>(mealKey, []);
  const [challenges, setChallenges] = useLocalStorage<Challenge[]>(challengeKey, []);

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
      case 'profile':
        return <Profile user={user} onUpdateUser={onUpdateUser} onLogout={onLogout} />;
      default:
        return <Dashboard workouts={workouts} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-gray-100 font-sans selection:bg-primary selection:text-white pb-20">
      {/* Header */}
      <header className="px-4 py-3 sticky top-0 bg-dark/80 backdrop-blur-md z-10 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
          FitGenius AI
        </h1>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`p-2 rounded-full transition-all ${activeTab === 'profile' ? 'bg-primary/20 text-primary' : 'hover:bg-gray-800 text-gray-400'}`}
        >
          <UserIcon size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pt-6 max-w-2xl">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      {activeTab !== 'profile' && (
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
      )}
    </div>
  );
};

// Main App Container handling Auth State
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const sessionUser = localStorage.getItem('fitgenius_session');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('fitgenius_session', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fitgenius_session');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('fitgenius_session', JSON.stringify(updatedUser));
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <AuthenticatedApp 
      user={user} 
      onLogout={handleLogout} 
      onUpdateUser={handleUpdateUser} 
    />
  );
};

export default App;