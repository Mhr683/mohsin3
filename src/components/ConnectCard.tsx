import React, { useState } from 'react';
import { Github, ArrowRight, Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { OAuthInstructions } from './OAuthInstructions';

interface ConnectCardProps {
  onConnect: () => void;
  onTokenConnect: (token: string) => Promise<void>;
  isConnecting: boolean;
  error?: string | null;
  hasClientId: boolean;
  hasClientSecret: boolean;
  devCallbackUrl: string;
  sharedCallbackUrl: string;
}

export const ConnectCard: React.FC<ConnectCardProps> = ({
  onConnect,
  onTokenConnect,
  isConnecting,
  error,
  hasClientId,
  hasClientSecret,
  devCallbackUrl,
  sharedCallbackUrl,
}) => {
  const [showSetupGuide, setShowSetupGuide] = useState(!hasClientId || !hasClientSecret);
  const [patToken, setPatToken] = useState('');
  const [isSubmittingPat, setIsSubmittingPat] = useState(false);
  const [connectMethod, setConnectMethod] = useState<'oauth' | 'token'>('oauth');

  const handlePatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patToken.trim()) return;
    setIsSubmittingPat(true);
    try {
      await onTokenConnect(patToken.trim());
    } finally {
      setIsSubmittingPat(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Connect Hero Section */}
      <div
        id="connect-card-main"
        className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-6 shadow-sm sm:p-10"
      >
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-md ring-8 ring-zinc-100">
            <Github className="h-9 w-9" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            Connect Your GitHub Account
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-zinc-600">
            Authenticate securely via GitHub OAuth to access your profile, inspect your repositories,
            and monitor your recent contribution activity.
          </p>

          {error && (
            <div
              id="connect-error-banner"
              className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-left text-xs text-red-800"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Authentication issue</p>
                <p className="mt-0.5 text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Method Switcher */}
          <div className="mt-6 inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-1 text-xs">
            <button
              type="button"
              onClick={() => setConnectMethod('oauth')}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                connectMethod === 'oauth'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              OAuth App Login
            </button>
            <button
              type="button"
              onClick={() => setConnectMethod('token')}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                connectMethod === 'token'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Personal Access Token (Quick)
            </button>
          </div>

          {connectMethod === 'oauth' ? (
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                id="main-connect-github-btn"
                onClick={onConnect}
                disabled={isConnecting}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white shadow transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Github className="h-4 w-4" />
                    <span>Connect with GitHub</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                id="toggle-instructions-btn"
                onClick={() => setShowSetupGuide(!showSetupGuide)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 sm:w-auto"
              >
                <span>{showSetupGuide ? 'Hide Setup Details' : 'View Setup Guide'}</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handlePatSubmit} className="mx-auto mt-6 max-w-md space-y-3">
              <div className="flex gap-2">
                <input
                  id="pat-token-input"
                  type="password"
                  placeholder="Paste GitHub Personal Access Token (ghp_...)"
                  value={patToken}
                  onChange={(e) => setPatToken(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmittingPat || !patToken.trim()}
                  className="shrink-0 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-zinc-800 disabled:opacity-50"
                >
                  {isSubmittingPat ? 'Verifying...' : 'Connect'}
                </button>
              </div>
              <p className="text-[11px] text-zinc-500">
                Generate a token at{' '}
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo,read:user,user:email"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  github.com/settings/tokens
                </a>{' '}
                with <code>read:user</code> & <code>repo</code> permissions.
              </p>
            </form>
          )}

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              Secure token & session encryption
            </span>
            <span>•</span>
            <span>Scopes: read:user, repo</span>
          </div>
        </div>
      </div>

      {/* Setup Guide Card */}
      {showSetupGuide && (
        <OAuthInstructions
          devCallbackUrl={devCallbackUrl}
          sharedCallbackUrl={sharedCallbackUrl}
          hasClientId={hasClientId}
          hasClientSecret={hasClientSecret}
        />
      )}
    </div>
  );
};
