"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Loader2, LogIn } from "lucide-react";

const SAVED_CREDENTIALS_KEY = "erc_saved_credentials";

type SavedCredentials = { username: string; password: string };

function loadSavedCredentials(): SavedCredentials | null {
  try {
    const raw = window.localStorage.getItem(SAVED_CREDENTIALS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.username === "string" &&
      typeof parsed.password === "string"
    ) {
      return { username: parsed.username, password: parsed.password };
    }
    return null;
  } catch {
    return null;
  }
}

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [saved, setSaved] = useState<SavedCredentials | null>(() =>
    loadSavedCredentials()
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function persistCredentials() {
    if (rememberMe) {
      window.localStorage.setItem(
        SAVED_CREDENTIALS_KEY,
        JSON.stringify({ username: username.trim(), password })
      );
      setSaved({ username: username.trim(), password });
    } else {
      window.localStorage.removeItem(SAVED_CREDENTIALS_KEY);
      setSaved(null);
    }
  }

  function useSaved() {
    if (!saved) return;
    setUsername(saved.username);
    setPassword(saved.password);
    setRememberMe(true);
    setSaved(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      persistCredentials();
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-semibold text-neutral-900">
          Email Read Checker
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Sign in with your username. New usernames are created on first sign
          in.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {saved && (
            <button
              type="button"
              onClick={useSaved}
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              <KeyRound className="h-4 w-4" />
              Use saved credentials
            </button>
          )}
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="your name"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pr-10 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="at least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 transition-colors hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
            />
            Remember me
          </label>
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            Sign in
          </button>
        </form>
      </div>
      <p className="mt-4 text-center text-xs text-neutral-500">
        Use a strong password. It cannot be recovered if you forget it.
      </p>
    </div>
  );
}
