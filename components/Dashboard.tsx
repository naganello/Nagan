import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Workout } from '../types';
import { TrendingUp, Activity, Calendar, Zap, Music, Link } from 'lucide-react';

interface DashboardProps {
  workouts: Workout[];
}

const Dashboard: React.FC<DashboardProps> = ({ workouts }) => {
  const [googleFitConnected, setGoogleFitConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const toggleGoogleFit = () => {
    setIsSyncing(true);
    // Simulation of API handshake
    setTimeout(() => {
      setGoogleFitConnected(!googleFitConnected);
      setIsSyncing(false);
    }, 1500);
  };
  
  const volumeData = useMemo(() => {
    const sorted = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.map(w => ({
      date: new Date(w.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
      volume: w.totalVolume,
      name: w.name
    }));
  }, [workouts]);

  const totalVolumeAllTime = workouts.reduce((acc, curr) => acc + curr.totalVolume, 0);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      
      {/* Google Fit Integration Banner */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className={`p-2 rounded-full ${googleFitConnected ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-400'}`}>
             <Zap size={20} fill={googleFitConnected ? "currentColor" : "none"} />
           </div>
           <div>
             <h3 className="font-bold text-white text-sm">Google Fit</h3>
             <p className="text-xs text-gray-400">{googleFitConnected ? 'Sincronizzato' : 'Disconnesso'}</p>
           </div>
        </div>
        <button 
          onClick={toggleGoogleFit}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            googleFitConnected 
            ? 'bg-red-500/10 text-red-500 border border-red-500/30' 
            : 'bg-white text-dark hover:bg-gray-200'
          }`}
        >
          {isSyncing ? '...' : (googleFitConnected ? 'Disconnetti' : 'Connetti')}
        </button>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Panoramica Fitness</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Activity size={18} className="text-primary" />
            <span className="text-sm">Allenamenti</span>
          </div>
          <p className="text-2xl font-bold text-white">{workouts.length}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp size={18} className="text-secondary" />
            <span className="text-sm">Volume Totale</span>
          </div>
          <p className="text-2xl font-bold text-white">{(totalVolumeAllTime / 1000).toFixed(1)}k <span className="text-xs font-normal text-gray-500">kg</span></p>
        </div>
      </div>

      {/* Volume Chart */}
      {workouts.length > 0 ? (
        <div className="bg-card p-4 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" /> Volume di Carico
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-700 rounded-xl">
          <p className="text-gray-400">Nessun dato grafico disponibile.</p>
        </div>
      )}

      {/* Spotify Widget */}
      <div className="bg-gradient-to-r from-green-900/40 to-black border border-green-800/50 rounded-xl p-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-2 opacity-20">
          <Music size={100} className="text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2 relative z-10">
          <Music size={20} className="text-green-500" /> Vibe da Allenamento
        </h3>
        <p className="text-sm text-gray-300 mb-4 relative z-10">Playlist consigliate per la tua sessione.</p>
        
        <div className="flex gap-3 overflow-x-auto pb-2 relative z-10">
          {[
            { name: "Beast Mode", url: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP" },
            { name: "Hype Rap", url: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd" },
            { name: "Rock Workout", url: "https://open.spotify.com/playlist/37i9dQZF1DWZryfp6NSvtz" }
          ].map((pl, i) => (
             <a 
               key={i} 
               href={pl.url} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex-shrink-0 bg-black/60 hover:bg-green-600/20 border border-white/10 hover:border-green-500 text-white p-3 rounded-lg flex items-center gap-2 text-sm transition-all"
             >
               <span>{pl.name}</span>
               <Link size={12} className="text-gray-400" />
             </a>
          ))}
        </div>
      </div>
      
      {/* Recent History Preview */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-secondary" /> Storico Recente
        </h3>
        {workouts.length === 0 ? (
          <p className="text-gray-500 text-sm">Nessun allenamento registrato.</p>
        ) : (
          <div className="space-y-3">
            {workouts.slice(0).reverse().slice(0, 5).map(workout => (
              <div key={workout.id} className="bg-card p-4 rounded-lg border border-gray-700 flex justify-between items-center hover:bg-gray-750 transition-colors">
                <div>
                  <p className="font-medium text-white">{workout.name}</p>
                  <p className="text-sm text-gray-400">{new Date(workout.date).toLocaleDateString('it-IT')}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold">{workout.totalVolume} kg</p>
                  <p className="text-xs text-gray-500">{workout.exercises.length} Esercizi</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;