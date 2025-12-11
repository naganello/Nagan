import React, { useState, useEffect } from 'react';
import { User, UserProfile } from '../types';
import { UserCircle, LogOut, Save, Ruler, Weight } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  const [profile, setProfile] = useState<UserProfile>(user.profile || {});
  const [isEditing, setIsEditing] = useState(false);

  // Sync internal state if user prop changes
  useEffect(() => {
    setProfile(user.profile || {});
  }, [user]);

  const handleSave = () => {
    const updatedUser = { ...user, profile };
    
    // Update local storage for users array
    const usersJson = localStorage.getItem('fitgenius_users');
    if (usersJson) {
      const users: User[] = JSON.parse(usersJson);
      const newUsers = users.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('fitgenius_users', JSON.stringify(newUsers));
    }
    
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="pb-24 space-y-6 animate-fade-in">
      <div className="bg-card border border-gray-700 rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-primary/20 to-secondary/20 z-0"></div>
        <div className="relative z-10">
          <div className="w-24 h-24 bg-dark border-4 border-card rounded-full mx-auto flex items-center justify-center mb-3">
            <UserCircle size={64} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-gray-400 text-sm">@{user.username}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Dati Fisici</h3>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              isEditing 
              ? 'bg-primary text-dark' 
              : 'bg-gray-800 text-primary border border-gray-700'
            }`}
          >
            {isEditing ? <><Save size={16} /> Salva</> : 'Modifica'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-xl border border-gray-700">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <Weight size={18} className="text-secondary" />
              <span className="text-sm">Peso (kg)</span>
            </div>
            {isEditing ? (
              <input 
                type="number" 
                value={profile.weight || ''}
                onChange={e => setProfile({...profile, weight: parseFloat(e.target.value)})}
                className="w-full bg-dark border border-gray-600 rounded p-2 text-white font-bold text-lg text-center"
                placeholder="0"
              />
            ) : (
              <p className="text-2xl font-bold text-white">{profile.weight || '--'} <span className="text-sm font-normal text-gray-500">kg</span></p>
            )}
          </div>

          <div className="bg-card p-4 rounded-xl border border-gray-700">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <Ruler size={18} className="text-emerald-500" />
              <span className="text-sm">Altezza (cm)</span>
            </div>
            {isEditing ? (
              <input 
                type="number" 
                value={profile.height || ''}
                onChange={e => setProfile({...profile, height: parseFloat(e.target.value)})}
                className="w-full bg-dark border border-gray-600 rounded p-2 text-white font-bold text-lg text-center"
                placeholder="0"
              />
            ) : (
              <p className="text-2xl font-bold text-white">{profile.height || '--'} <span className="text-sm font-normal text-gray-500">cm</span></p>
            )}
          </div>
          
           <div className="bg-card p-4 rounded-xl border border-gray-700 col-span-2">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <span className="text-sm">Età</span>
            </div>
            {isEditing ? (
              <input 
                type="number" 
                value={profile.age || ''}
                onChange={e => setProfile({...profile, age: parseFloat(e.target.value)})}
                className="w-full bg-dark border border-gray-600 rounded p-2 text-white font-bold text-lg text-center"
                placeholder="0"
              />
            ) : (
              <p className="text-2xl font-bold text-white">{profile.age || '--'} <span className="text-sm font-normal text-gray-500">anni</span></p>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full py-3 mt-8 border border-red-500/30 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Profile;