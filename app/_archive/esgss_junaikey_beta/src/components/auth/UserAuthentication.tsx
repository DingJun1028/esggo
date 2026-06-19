/**
 * 🔐 User Authentication & Passport System
 * --------------------------------------------------
 * [Function] User Auth, Passport Management, Basic Info
 * [Language] Traditional Chinese / English Dual Support
 */

import React, { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { User as _User, Lock, Mail, Phone, Building, MapPin } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export interface UserPassport {
  id: string;
  email: string;
  name: string;
  phone: string;
  company: string;
  title: string;
  address: string;
  avatar: string;
  esgProfile: {
    knowledgeLevel: number;
    interests: string[];
    learningPrefs: string[];
  };
  createdAt: number;
  lastLogin: number;
}

interface AuthContextType {
  user: UserPassport | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePassport: (data: Partial<UserPassport>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPassport | null>(null);
  const { login: loginToStore, logout: logoutFromStore } = useAppStore();

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login verification
    if (email && password) {
      const mockUser: UserPassport = {
        id: 'USER-001',
        email,
        name: 'Chang Yung-Hsu',
        phone: '+886-912-345-678',
        company: 'Green Energy Tech Co.',
        title: 'ESG Manager',
        address: 'Xinyi Dist., Taipei City',
        avatar: '',
        esgProfile: {
          knowledgeLevel: 85,
          interests: ['Environment', 'Carbon Neutral', 'Circular Economy'],
          learningPrefs: ['Reading', 'Visual'],
        },
        createdAt: Date.now() - 86400000 * 30,
        lastLogin: Date.now(),
      };
      setUser(mockUser);
      // Synchronize with Zustand store
      loginToStore({
        name: mockUser.name,
        role: mockUser.title,
        organization: mockUser.company,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    // Synchronize with Zustand store
    logoutFromStore();
  };

  const updatePassport = (data: Partial<UserPassport>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      // Also update the store if relevant fields change
      loginToStore({
        name: updatedUser.name,
        role: updatedUser.title,
        organization: updatedUser.company,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        updatePassport,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const LoginPage: React.FC<{ onLoginSuccess?: (user: UserPassport) => void }> = ({
  onLoginSuccess,
}) => {
  const { login, user: authUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [_error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(
        formData.email || 'demo@esgss.com',
        formData.password || 'demo1234'
      );
      if (success && authUser && onLoginSuccess) {
        onLoginSuccess(authUser);
      } else if (!success) {
        setError('登入失敗，請檢查帳號密碼');
      }
    } catch (_err) {
      setError('登入失敗，請檢查帳號密碼');
    } finally {
      setLoading(false);
    }
  };

  const quickAccess = async () => {
    setLoading(true);
    // Simulate delay for ritual effect
    await new Promise(resolve => setTimeout(resolve, 800));
    await login('demo@esgss.com', 'demo1234');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background FX - Cyber Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px] animate-pulse-slow" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse-slow"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Frosted Panel */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
          {/* Top Neon Border */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] relative group"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-white text-3xl font-bold tracking-tighter">JAK</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              ESG <span className="text-cyan-400">Sunshine</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium tracking-[0.2em] uppercase">
              SYSTEM ACCESS // v5.2
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-widest">
                Identity
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                  placeholder="agent@esgss.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-widest">
                Passphrase
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-cyan-50 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)] group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? 'AUTHENTICATING...' : 'JACK IN'}
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={quickAccess}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 font-bold rounded-2xl hover:from-cyan-600/30 hover:to-blue-600/30 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="text-sm tracking-widest">⚡ Quick Access (DEMO)</span>
            </button>
            <p className="text-slate-600 text-[10px] text-center mt-3 font-mono tracking-widest uppercase">
              Direct access for inspection purposes
            </p>
          </div>
        </div>

        {/* Footer Credits */}
        <div className="mt-10 flex flex-col items-center gap-4 text-slate-500">
          <p className="text-[10px] tracking-[0.4em] font-light uppercase">
            © 2026 ESGss JunAiKey System · All Rights Reserved
          </p>
        </div>
      </motion.div>

      <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
            `}</style>
    </div>
  );
};

export const UserPassportPage: React.FC = () => {
  const { user, updatePassport } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  if (!user) return null;

  const saveChanges = () => {
    if (formData) {
      updatePassport(formData);
      setIsEditing(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-8">User Passport</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                <p className="text-slate-600">{user.title}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => (isEditing ? saveChanges() : setIsEditing(true))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataField
              icon={<Mail />}
              label="Email"
              content={user.email}
              isEditing={isEditing}
              onChange={value => setFormData(prev => (prev ? { ...prev, email: value } : null))}
            />
            <DataField
              icon={<Phone />}
              label="Phone"
              content={user.phone}
              isEditing={isEditing}
              onChange={value => setFormData(prev => (prev ? { ...prev, phone: value } : null))}
            />
            <DataField
              icon={<Building />}
              label="Company"
              content={user.company}
              isEditing={isEditing}
              onChange={value => setFormData(prev => (prev ? { ...prev, company: value } : null))}
            />
            <DataField
              icon={<MapPin />}
              label="Address"
              content={user.address}
              isEditing={isEditing}
              onChange={value => setFormData(prev => (prev ? { ...prev, address: value } : null))}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">ESG Profile</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-700">Knowledge Level</span>
                <span className="text-2xl font-bold text-blue-600">
                  {user.esgProfile.knowledgeLevel}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="h-3 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"
                  style={{ width: `${user.esgProfile.knowledgeLevel}%` }}
                />
              </div>
            </div>
            <div>
              <span className="text-slate-700 block mb-2">Interest Tags</span>
              <div className="flex flex-wrap gap-2">
                {user.esgProfile.interests.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DataField: React.FC<{
  icon: React.ReactNode;
  label: string;
  content: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}> = ({ icon, label, content, isEditing, onChange }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">{icon}</div>
    <div className="flex-1">
      <div className="text-sm text-slate-600 mb-1">{label}</div>
      {isEditing ? (
        <input
          type="text"
          value={content}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
        />
      ) : (
        <div className="text-slate-800 font-medium">{content}</div>
      )}
    </div>
  </div>
);
