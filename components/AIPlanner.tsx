import React, { useState } from 'react';
import { Bot, Check, Sparkles, Loader2, Save } from 'lucide-react';
import { Goal, Level, AIPlanRequest, AIPlanResponse } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';

const AIPlanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<AIPlanResponse | null>(null);
  
  // Form State
  const [goal, setGoal] = useState<Goal>(Goal.HYPERTROPHY);
  const [level, setLevel] = useState<Level>(Level.INTERMEDIATE);
  const [days, setDays] = useState(3);
  const [equipment, setEquipment] = useState('Palestra completa');

  const handleGenerate = async () => {
    setLoading(true);
    setPlan(null);
    try {
      const request: AIPlanRequest = {
        goal,
        level,
        daysPerWeek: days,
        equipment
      };
      const result = await generateWorkoutPlan(request);
      setPlan(result);
    } catch (error) {
      alert("Errore nella generazione del piano. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-secondary/20 rounded-full">
          <Bot className="text-secondary" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Coach</h2>
          <p className="text-sm text-gray-400">Genera una scheda personalizzata con Gemini</p>
        </div>
      </div>

      {!plan ? (
        <div className="bg-card p-6 rounded-2xl border border-gray-700 shadow-lg space-y-6">
          {/* Goal Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Il tuo obiettivo</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(Goal).map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`p-3 rounded-lg text-sm border transition-all ${
                    goal === g 
                    ? 'bg-secondary/20 border-secondary text-secondary font-bold' 
                    : 'bg-dark border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Level Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Livello Esperienza</label>
            <select 
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
              className="w-full bg-dark text-white p-3 rounded-lg border border-gray-700 focus:border-secondary outline-none"
            >
              {Object.values(Level).map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Days Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-300">Giorni a settimana</label>
              <span className="text-secondary font-bold">{days}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="7" 
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-secondary"
            />
          </div>

          {/* Equipment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Attrezzatura</label>
            <input 
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="Es. Manubri, Panca, Corpo libero..."
              className="w-full bg-dark text-white p-3 rounded-lg border border-gray-700 focus:border-secondary outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Elaborazione...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Genera Piano
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
          <div className="bg-secondary/10 border border-secondary/30 p-4 rounded-xl">
            <h3 className="text-xl font-bold text-secondary mb-1">{plan.planName}</h3>
            <p className="text-gray-300 text-sm">{plan.description}</p>
          </div>

          <div className="space-y-4">
            {plan.schedule.map((day, idx) => (
              <div key={idx} className="bg-card rounded-xl border border-gray-700 overflow-hidden">
                <div className="bg-gray-800/50 p-3 border-b border-gray-700 flex justify-between items-center">
                  <span className="font-bold text-white">{day.dayName}</span>
                  <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full">{day.focus}</span>
                </div>
                <div className="p-4 space-y-4">
                  {day.exercises.map((ex, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 last:border-0 pb-2 last:pb-0">
                      <div>
                        <p className="text-gray-200 font-medium">{ex.name}</p>
                        {ex.notes && <p className="text-xs text-gray-500 italic">{ex.notes}</p>}
                      </div>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span><span className="text-white font-bold">{ex.sets}</span> Serie</span>
                        <span><span className="text-white font-bold">{ex.reps}</span> Reps</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setPlan(null)}
              className="flex-1 py-3 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Indietro
            </button>
            {/* Future feature: Save plan to local storage */}
            <button className="flex-1 py-3 text-dark bg-secondary hover:bg-blue-400 font-bold rounded-lg transition-colors flex justify-center items-center gap-2">
              <Save size={18} /> Salva Piano
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPlanner;