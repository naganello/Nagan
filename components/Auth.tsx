import React, { useState } from 'react';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Dumbbell, UserPlus, LogIn, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Fetch existing users from local storage
    const usersJson = localStorage.getItem('fitgenius_users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    if (isLogin) {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Credenziali non valide');
      }
    } else {
      // Register
      if (users.find(u => u.username === username)) {
        setError('Nome utente già esistente');
        return;
      }
      if (!username || !password || !name) {
        setError('Compila tutti i campi');
        return;
      }

      const newUser: User = {
        id: generateId(),
        username,
        password,
        name,
        profile: {}
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('fitgenius_users', JSON.stringify(updatedUsers));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <div className="w-full max-w-md bg-card border border-gray-700 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FitGenius AI</h1>
          <p className="text-gray-400">Il tuo personal trainer intelligente</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-dark border border-gray-600 rounded-lg p-3 text-white focus:border-primary outline-none"
                placeholder="Mario Rossi"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-dark border border-gray-600 rounded-lg p-3 text-white focus:border-primary outline-none"
              placeholder="mariorossi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-dark border border-gray-600 rounded-lg p-3 text-white focus:border-primary outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            className="w-full py-3 bg-primary hover:bg-emerald-400 text-dark font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLogin ? (
               <>Accedi <LogIn size={20} /></>
            ) : (
               <>Registrati <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            {isLogin ? (
              <>Non hai un account? <span className="text-primary font-bold">Registrati</span></>
            ) : (
              <>Hai già un account? <span className="text-primary font-bold">Accedi</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;