import React, { useState } from 'react';
import { omniLogger, LogCategory } from '../../services/omniLogger';
import { Language } from '@/types';

interface Props {
  onLoginSuccess: (user: any) => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

export const LoginPage: React.FC<Props> = ({
  onLoginSuccess,
  language = 'zh-TW',
  onToggleLanguage,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const isZh = language === 'zh-TW';

  // Determine API Base URL
  const API_BASE = 'http://localhost:3001';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        if (isRegister) {
          alert(isZh ? '代理人註冊成功。請登入。' : 'Agent Registered. Please Login.');
          setIsRegister(false);
          setFormData(prev => ({ ...prev, password: '' }));
        } else {
          localStorage.setItem('avos_token', data.token);
          localStorage.setItem('avos_user', JSON.stringify(data.user));
          onLoginSuccess(data.user);
        }
      } else {
        alert(data.message || (isZh ? '驗證失敗' : 'Authentication Failed'));
      }
    } catch (err) {
      omniLogger.error(LogCategory.AUTH, 'System Connection Error', { error: err });
      alert(isZh ? '系統連線錯誤' : 'System Connection Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#0B0C10] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

      {/* Animated Matrix Rain Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background:
            'linear-gradient(0deg, transparent 0%, rgba(0,255,200,0.1) 50%, transparent 100%)',
          backgroundSize: '100% 3px',
        }}
      ></div>

      <div className="z-10 w-[400px] bg-black/60 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        {/* Glow Border */}
        <div className="absolute inset-0 border border-[primary] opacity-20 rounded-2xl pointer-events-none animate-pulse"></div>

        {/* Language Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onToggleLanguage}
            className="text-xs font-mono text-gray-500 hover:text-[primary] transition-colors flex items-center gap-1"
          >
            <span className={language === 'zh-TW' ? 'text-[primary]' : ''}>繁</span>
            <span className="text-gray-700">/</span>
            <span className={language === 'en-US' ? 'text-[primary]' : ''}>EN</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[primary] tracking-widest mb-2">AVOS</h1>
          <p className="text-gray-500 text-xs font-mono">
            {isZh ? '存取控制 // v6.0' : 'ACCESS CONTROL // v6.0'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <input
              type="text"
              placeholder={isZh ? '代理人代號' : 'AGENT NAME'}
              className="bg-gray-900/80 border border-gray-700 text-white p-3 rounded focus:border-[primary] outline-none font-mono text-sm transition-colors"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
              required
            />
          )}

          <input
            type="email"
            placeholder={isZh ? '身份識別 (Email)' : 'IDENTITY (EMAIL)'}
            className="bg-gray-900/80 border border-gray-700 text-white p-3 rounded focus:border-[primary] outline-none font-mono text-sm transition-colors"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder={isZh ? '通行密鑰' : 'PASSPHRASE'}
            className="bg-gray-900/80 border border-gray-700 text-white p-3 rounded focus:border-[primary] outline-none font-mono text-sm transition-colors"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-[primary] text-black font-bold py-3 rounded hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 tracking-widest text-sm"
          >
            {loading
              ? isZh
                ? '驗證中...'
                : 'AUTHENTICATING...'
              : isRegister
                ? isZh
                  ? '初始化代理人'
                  : 'INITIALIZE AGENT'
                : isZh
                  ? '連結系統'
                  : 'JACK IN'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            disabled={loading}
            className="text-gray-500 text-xs hover:text-[primary] underline underline-offset-4 transition-colors font-mono"
          >
            {isRegister
              ? isZh
                ? '存取現有身份'
                : 'ACCESS EXISTING IDENTITY'
              : isZh
                ? '鑄造新身份'
                : 'MINT NEW IDENTITY'}
          </button>
        </div>

        {/* 🔧 開發者模式快速登入 */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <button
            type="button"
            onClick={() => {
              const devUser = {
                uuid: 'dev-user-001',
                name: 'Developer',
                email: 'dev@esgss.com',
                role: 'admin',
                createdAt: new Date().toISOString(),
              };
              localStorage.setItem('avos_token', 'dev-token-' + Date.now());
              localStorage.setItem('avos_user', JSON.stringify(devUser));
              omniLogger.info(LogCategory.AUTH, '🔧 Developer mode login', {
                userId: devUser.uuid,
              });
              onLoginSuccess(devUser);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 rounded hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] text-xs tracking-wider flex items-center justify-center gap-2"
          >
            <span>🔧</span>
            <span>{isZh ? '開發者模式 (免驗證)' : 'DEV MODE (SKIP AUTH)'}</span>
          </button>
          <p className="text-gray-600 text-[10px] text-center mt-2 font-mono">
            {isZh ? 'DEV MODE: 跳過驗證' : 'DEV MODE: Skip Authentication'}
          </p>
        </div>
      </div>
    </div>
  );
};
