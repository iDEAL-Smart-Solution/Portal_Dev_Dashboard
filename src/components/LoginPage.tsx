import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { LoginRequest } from '../types/auth';
import { showError } from '../lib/notifications';

const LoginPage: React.FC = () => {
  const [uin, setUin] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const credentials: LoginRequest = {
      UIN: uin,
      Password: password,
    };

    const success = await login(credentials);
    if (!success) {
      console.error('Login failed');
    }
  };

  React.useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background-secondary text-text-primary">
      <div className="relative grid h-screen gap-4 lg:grid-cols-[0.98fr_1.02fr] p-4 lg:p-6">
        <section 
          className="relative hidden flex-col justify-end overflow-y-auto rounded-2xl text-slate-800 lg:flex"
          style={{
            backgroundImage: 'url(/logo.png)',
            backgroundColor: 'transparent',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            boxShadow: '8px 0 24px rgba(2,6,23,0.06)'
          }}
        >
          <div className="relative z-10 max-w-xl space-y-6 p-8 xl:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm">
              iDEAL internal operations
            </div>
            <div className="space-y-3">
              <p className="rounded-lg bg-black/40 px-4 py-3 text-4xl font-semibold tracking-tight text-white xl:text-5xl shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                The easiest way to oversee your school network
              </p>
              <p className="max-w-lg text-base leading-7 text-slate-700">
                A clean internal dashboard for managing schools, admins, and platform activity from one place.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg space-y-5">
            <div className="surface overflow-hidden p-6 shadow-medium sm:p-8">
              <div className="flex justify-center">
                <img
                  src="/logo.png"
                  alt="iDEAL Smart Solution Limited"
                  className="h-14 w-auto object-contain"
                />
              </div>

              <div className="mt-6 space-y-1 text-left">
                <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
                  Welcome back
                </h2>
               
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="uin" className="mb-2 block text-sm font-medium text-text-secondary">
                    UIN
                  </label>
                  <input
                    id="uin"
                    name="uin"
                    type="text"
                    required
                    value={uin}
                    onChange={(e) => setUin(e.target.value)}
                    className="block w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-primary shadow-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                    placeholder="Enter your UIN"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-text-secondary">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-primary shadow-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex justify-end">
                  <button type="button" className="text-sm font-medium text-primary-600 transition hover:text-primary-700">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary-500 px-4 py-3 text-sm font-medium text-white shadow-primary transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>

              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
