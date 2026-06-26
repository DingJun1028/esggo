'use client';

import { useState } from 'react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } from '@/lib/auth';
import type { User } from 'firebase/auth';

export default function LoginButton({ user }: { user: User | null }) {
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">
          {user.displayName || user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600"
        >
          登出
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => signInWithGoogle().catch(e => setError(e.message))}
        className="rounded bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-500"
      >
        Google 登入
      </button>
      <button
        onClick={() => setShowEmail(!showEmail)}
        className="rounded bg-gray-700 px-3 py-1.5 text-sm text-white hover:bg-gray-600"
      >
        Email
      </button>
      {showEmail && (
        <div className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="rounded border border-gray-600 bg-gray-800 px-2 py-1 text-sm text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="rounded border border-gray-600 bg-gray-800 px-2 py-1 text-sm text-white"
          />
          <button
            onClick={() => {
              const action = isSignUp ? signUpWithEmail(email, password) : signInWithEmail(email, password);
              action.catch(e => setError(e.message));
            }}
            className="rounded bg-teal-600 px-3 py-1 text-sm text-white hover:bg-teal-500"
          >
            {isSignUp ? '註冊' : '登入'}
          </button>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-gray-400 underline"
          >
            {isSignUp ? '已有帳號？' : '新用戶註冊'}
          </button>
        </div>
      )}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
