'use client';
import { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Chrome } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--berkeley-blue)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-160px', right: '-160px',
        width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(253,181,21,0.08)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-120px', left: '-120px',
        width: 340, height: 340, borderRadius: '50%',
        background: 'rgba(59,126,161,0.12)', pointerEvents: 'none',
      }} />

      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 460, padding: '48px 40px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: 'var(--berkeley-blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: 'var(--shadow-brand)',
          }}>
            <ShieldCheck size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>ESG GO</h1>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 4 }}>
            Omni_Terminal Auth
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">企業電子郵件 Corporate Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="name@company.com"
                className="form-input"
                style={{ paddingLeft: 36 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">安全密碼 Secure Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: 36 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="btn btn-primary btn-lg w-full" style={{ marginTop: 4 }}>
            登入系統 Sign In
            <ArrowRight size={15} />
          </button>

          <div className="divider-label">或使用其他方式</div>

          <button className="btn btn-secondary w-full">
            <Chrome size={16} style={{ color: '#4285F4' }} />
            使用 Google 帳號登入
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          Enterprise Grade · 5T Integrity Protocol Active
        </p>
      </div>
    </div>
  );
}
