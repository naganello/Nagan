import React, { useState, useMemo } from 'react';
import { Plus, Trash2, PieChart, Flame, Utensils } from 'lucide-react';
import { Meal } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Helper ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

interface NutritionTrackerProps {
  meals: Meal[];
  onAddMeal: (meal: Meal) => void;
  onDeleteMeal: (id: string) => void;
}

const NutritionTracker: React.FC<NutritionTrackerProps> = ({ meals, onAddMeal, onDeleteMeal }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fats: '' });

  // Filter meals for today
  const today = new Date().toISOString().split('T')[0];
  const todaysMeals = meals.filter(m => m.date.startsWith(today));

  // Calculate totals
  const totals = useMemo(() => {
    return todaysMeals.reduce((acc, curr) => ({
      calories: acc.calories + curr.calories,
      protein: acc.protein + curr.protein,
      carbs: acc.carbs + curr.carbs,
      fats: acc.fats + curr.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  }, [todaysMeals]);

  // Mock targets
  const targets = { calories: 2500, protein: 150, carbs: 300, fats: 80 };

  const handleAdd = () => {
    if (!newMeal.name || !newMeal.calories) return;
    
    const meal: Meal = {
      id: generateId(),
      name: newMeal.name,
      calories: parseInt(newMeal.calories) || 0,
      protein: parseInt(newMeal.protein) || 0,
      carbs: parseInt(newMeal.carbs) || 0,
      fats: parseInt(newMeal.fats) || 0,
      date: new Date().toISOString()
    };

    onAddMeal(meal);
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fats: '' });
    setIsAdding(false);
  };

  const ProgressBar = ({ label, current, target, color }: { label: string, current: number, target: number, color: string }) => {
    const percentage = Math.min((current / target) * 100, 100);
    return (
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-300 font-medium">{label}</span>
          <span className="text-gray-400">{Math.round(current)} / {target}g</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${color}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-orange-500/20 rounded-full">
          <Utensils className="text-orange-500" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Diario Alimentare</h2>
          <p className="text-sm text-gray-400">Traccia i tuoi macro giornalieri</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-card p-5 rounded-xl border border-gray-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Flame className="text-orange-500" size={20} /> Riepilogo Oggi
          </h3>
          <span className="text-2xl font-bold text-white">{totals.calories} <span className="text-sm text-gray-500 font-normal">/ {targets.calories} kcal</span></span>
        </div>
        
        <ProgressBar label="Proteine" current={totals.protein} target={targets.protein} color="bg-blue-500" />
        <ProgressBar label="Carboidrati" current={totals.carbs} target={targets.carbs} color="bg-emerald-500" />
        <ProgressBar label="Grassi" current={totals.fats} target={targets.fats} color="bg-yellow-500" />
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Pasti</h3>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="text-sm bg-gray-800 hover:bg-gray-700 text-primary px-3 py-1 rounded-lg border border-gray-700 transition-colors"
          >
            {isAdding ? 'Annulla' : '+ Aggiungi Pasto'}
          </button>
        </div>

        {isAdding && (
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-3">
            <input 
              placeholder="Nome pasto (es. Pranzo)" 
              value={newMeal.name}
              onChange={e => setNewMeal({...newMeal, name: e.target.value})}
              className="w-full bg-dark p-2 rounded border border-gray-600 text-white outline-none focus:border-primary"
            />
            <div className="grid grid-cols-4 gap-2">
              <input placeholder="Kcal" type="number" value={newMeal.calories} onChange={e => setNewMeal({...newMeal, calories: e.target.value})} className="bg-dark p-2 rounded border border-gray-600 text-white outline-none text-center" />
              <input placeholder="Prot" type="number" value={newMeal.protein} onChange={e => setNewMeal({...newMeal, protein: e.target.value})} className="bg-dark p-2 rounded border border-gray-600 text-white outline-none text-center" />
              <input placeholder="Carb" type="number" value={newMeal.carbs} onChange={e => setNewMeal({...newMeal, carbs: e.target.value})} className="bg-dark p-2 rounded border border-gray-600 text-white outline-none text-center" />
              <input placeholder="Fat" type="number" value={newMeal.fats} onChange={e => setNewMeal({...newMeal, fats: e.target.value})} className="bg-dark p-2 rounded border border-gray-600 text-white outline-none text-center" />
            </div>
            <button 
              onClick={handleAdd}
              className="w-full py-2 bg-primary text-dark font-bold rounded-lg hover:bg-emerald-400"
            >
              Salva
            </button>
          </div>
        )}

        {todaysMeals.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Nessun pasto registrato oggi.</p>
        ) : (
          [...todaysMeals].reverse().map(meal => (
            <div key={meal.id} className="bg-card p-4 rounded-xl border border-gray-700 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">{meal.name}</p>
                <div className="text-xs text-gray-400 flex gap-2 mt-1">
                  <span className="text-blue-400">P: {meal.protein}g</span>
                  <span className="text-emerald-400">C: {meal.carbs}g</span>
                  <span className="text-yellow-400">F: {meal.fats}g</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-white">{meal.calories} kcal</span>
                <button onClick={() => onDeleteMeal(meal.id)} className="text-gray-600 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NutritionTracker;