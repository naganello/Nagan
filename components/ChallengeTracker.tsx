import React, { useState } from 'react';
import { Trophy, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { Challenge } from '../types';

// Helper ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

interface ChallengeTrackerProps {
  challenges: Challenge[];
  onAddChallenge: (challenge: Challenge) => void;
  onUpdateChallenge: (id: string, progress: number) => void;
  onDeleteChallenge: (id: string) => void;
}

const PRESET_CHALLENGES: Omit<Challenge, 'id' | 'current' | 'completed'>[] = [
  { title: "Runner 5k", description: "Corri 5km in una singola sessione o totale", target: 5, unit: "km", type: "distance" },
  { title: "Forza Mensile", description: "Completa 10 allenamenti di forza", target: 10, unit: "sessioni", type: "frequency" },
  { title: "Volume King", description: "Solleva un totale di 10.000 kg", target: 10000, unit: "kg", type: "volume" },
  { title: "Maratona Settimanale", description: "Corri 42km in totale questo mese", target: 42, unit: "km", type: "distance" }
];

const ChallengeTracker: React.FC<ChallengeTrackerProps> = ({ challenges, onAddChallenge, onUpdateChallenge, onDeleteChallenge }) => {
  const [showPresets, setShowPresets] = useState(false);

  const handleAddPreset = (preset: typeof PRESET_CHALLENGES[0]) => {
    onAddChallenge({
      ...preset,
      id: generateId(),
      current: 0,
      completed: false
    });
    setShowPresets(false);
  };

  const incrementProgress = (challenge: Challenge) => {
    if (challenge.completed) return;
    // Simple increment logic for demo purposes. Ideally linked to workouts.
    const increment = challenge.type === 'volume' ? 500 : 1; 
    const newCurrent = Math.min(challenge.current + increment, challenge.target);
    onUpdateChallenge(challenge.id, newCurrent);
  };

  return (
    <div className="pb-24 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-purple-500/20 rounded-full">
          <Trophy className="text-purple-500" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Le tue Sfide</h2>
          <p className="text-sm text-gray-400">Supera i tuoi limiti</p>
        </div>
      </div>

      <button 
        onClick={() => setShowPresets(!showPresets)}
        className="w-full py-3 border-2 border-dashed border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-500 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Nuova Sfida
      </button>

      {showPresets && (
        <div className="grid grid-cols-1 gap-3">
          {PRESET_CHALLENGES.map((preset, idx) => (
            <button 
              key={idx}
              onClick={() => handleAddPreset(preset)}
              className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-left hover:bg-gray-700 transition-colors"
            >
              <h4 className="font-bold text-white">{preset.title}</h4>
              <p className="text-sm text-gray-400">{preset.description}</p>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {challenges.length === 0 && !showPresets ? (
          <p className="text-center text-gray-500 py-8">Nessuna sfida attiva. Inizia ora!</p>
        ) : (
          challenges.map(challenge => (
            <div key={challenge.id} className={`bg-card p-5 rounded-xl border ${challenge.completed ? 'border-primary/50 bg-primary/5' : 'border-gray-700'} relative overflow-hidden transition-all`}>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {challenge.title}
                    {challenge.completed && <CheckCircle2 size={18} className="text-primary" />}
                  </h3>
                  <p className="text-xs text-gray-400">{challenge.description}</p>
                </div>
                <button 
                  onClick={() => onDeleteChallenge(challenge.id)}
                  className="text-gray-600 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span className={challenge.completed ? "text-primary" : "text-gray-300"}>
                    {challenge.completed ? "Completata!" : "In corso"}
                  </span>
                  <span className="text-white">{challenge.current} / {challenge.target} {challenge.unit}</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden cursor-pointer" onClick={() => incrementProgress(challenge)}>
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${challenge.completed ? 'bg-primary' : 'bg-purple-500'}`} 
                    style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                  />
                </div>
                {!challenge.completed && (
                  <p className="text-[10px] text-gray-500 mt-2 text-right italic">Clicca la barra per aggiornare (Simulazione)</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChallengeTracker;