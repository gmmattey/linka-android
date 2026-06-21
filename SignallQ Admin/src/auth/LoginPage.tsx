import React, { useState } from "react";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_ADMIN_API_BASE_URL ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${baseUrl}/health`, {
        headers: { Authorization: `Bearer ${password.trim()}` },
      });

      if (res.ok) {
        onLogin(password.trim());
      } else {
        setError("Senha incorreta.");
      }
    } catch {
      setError("Não foi possível conectar ao servidor. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6C2BFF]/20 border border-[#6C2BFF]/30 mb-4">
            <svg className="w-7 h-7 text-[#6C2BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="text-white text-xl font-semibold tracking-tight">SignallQ Admin</h1>
          <p className="text-[#6B7280] text-sm mt-1">Painel de administração</p>
        </div>

        {/* Card */}
        <div className="bg-[#111127] border border-white/8 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-2">
                Senha de acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoFocus
                className="w-full bg-[#0D0D1A] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-[#374151] focus:outline-none focus:border-[#6C2BFF]/60 focus:ring-1 focus:ring-[#6C2BFF]/30 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full bg-[#6C2BFF] hover:bg-[#5B22E0] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl py-3 transition-colors"
            >
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
