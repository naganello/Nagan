import React, { useState } from 'react';
import { Plus, Trash2, Save, Dumbbell } from 'lucide-react';
import { Exercise, ExerciseSet, Workout } from '../types';
import { v4 as uuidv4 } from 'uuid'; // Assumption: Using uuid or random string for IDs

// Simple ID generator if uuid isn't available in environment
const generateId = () => Math.random().toString(36).substr(2, 9);

interface WorkoutLoggerProps {
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ onSave, onCancel }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: generateId(),
        name: '',
        sets: [
          { id: generateId(), reps: 0, weight: 0 }
        ]
      }
    ]);
  };

  const updateExerciseName = (id: string, name: string) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, name } : ex));
  };

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        // Copy values from previous set for convenience
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, { 
            id: generateId(), 
            reps: lastSet ? lastSet.reps : 0, 
            weight: lastSet ? lastSet.weight : 0 
          }]
        };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof ExerciseSet, value: number) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      }
      return ex;
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
      }
      return ex;
    }));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSave = () => {
    if (!workoutName.trim()) {
      alert("Inserisci un nome per l'allenamento");
      return;
    }
    if (exercises.length === 0) {
      alert("Aggiungi almeno un esercizio");
      return;
    }

    // Calculate total volume (weight * reps)
    const totalVolume = exercises.reduce((acc, ex) => {
      return acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0);
    }, 0);

    const newWorkout: Workout = {
      id: generateId(),
      date: new Date().toISOString(),
      name: workoutName,
      exercises,
      totalVolume
    };

    onSave(newWorkout);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Dumbbell className="text-primary" /> Registra Allenamento
        </h2>
      </div>

      <div className="bg-card p-4 rounded-xl border border-gray-700">
        <label className="block text-sm text-gray-400 mb-1">Nome Allenamento</label>
        <input 
          type="text" 
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="Es. Gambe Pesante"
          className="w-full bg-dark text-white p-3 rounded-lg border border-gray-600 focus:border-primary outline-none"
        />
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div key={exercise.id} className="bg-card p-4 rounded-xl border border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-3">
              <input 
                type="text" 
                value={exercise.name}
                onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                placeholder={`Esercizio ${index + 1}`}
                className="bg-transparent text-lg font-semibold text-white placeholder-gray-500 outline-none w-full mr-2"
              />
              <button onClick={() => removeExercise(exercise.id)} className="text-red-400 hover:text-red-300">
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-10 gap-2 text-xs text-gray-400 mb-1 text-center">
                <div className="col-span-2">SET</div>
                <div className="col-span-3">KG</div>
                <div className="col-span-3">REPS</div>
                <div className="col-span-2"></div>
              </div>
              {exercise.sets.map((set, sIndex) => (
                <div key={set.id} className="grid grid-cols-10 gap-2 items-center">
                  <div className="col-span-2 flex justify-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded-full text-xs text-white">
                      {sIndex + 1}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      value={set.weight || ''} 
                      onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value))}
                      className="w-full bg-dark text-center text-white p-2 rounded border border-gray-600 focus:border-primary outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      value={set.reps || ''} 
                      onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseFloat(e.target.value))}
                      className="w-full bg-dark text-center text-white p-2 rounded border border-gray-600 focus:border-primary outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <button onClick={() => removeSet(exercise.id, set.id)} className="text-gray-500 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => addSet(exercise.id)}
              className="mt-3 w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-sm text-primary font-medium rounded-lg transition-colors"
            >
              + Aggiungi Set
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={addExercise}
        className="w-full py-3 border-2 border-dashed border-gray-600 text-gray-400 hover:border-primary hover:text-primary rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Aggiungi Esercizio
      </button>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark/95 border-t border-gray-800 backdrop-blur-sm flex gap-4">
        <button 
          onClick={onCancel}
          className="flex-1 py-3 text-gray-300 font-semibold bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Annulla
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 py-3 text-dark font-bold bg-primary rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} /> Salva Allenamento
        </button>
      </div>
    </div>
  );
};

export default WorkoutLogger;