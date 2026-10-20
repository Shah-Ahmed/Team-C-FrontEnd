"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { errorMessage } from "@/lib/api";
import { HOME_BY_ROLE } from "@/lib/roles";

export default function LoginPage() {
  const { profile, loading, error: authError, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already logged in (or just logged in): go to the page of your role.
  useEffect(() => {
    if (!loading && profile) router.replace(HOME_BY_ROLE[profile.role]);
  }, [loading, profile, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const shownError = error || authError;

  return (
    <div className="row justify-content-center pt-4">
      <div className="col-12 col-md-6 col-lg-5">
        <div style={{ backgroundColor: '#111C31', border: '1px solid #1E293B', borderRadius: '12px', padding: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '8px' }}>Login</h1>
          <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '24px' }}>Sign in to access your organization's AI studio and drafts.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#CBD5E1' }}>Email</label>
              <input
                id="email"
                type="email"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0B1220', border: '1px solid #334155', color: '#FFF', outline: 'none' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#CBD5E1' }}>Password</label>
              <input
                id="password"
                type="password"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0B1220', border: '1px solid #334155', color: '#FFF', outline: 'none' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {shownError && (
              <div style={{ backgroundColor: '#4C0519', border: '1px solid #F43F5E', color: '#FECDD3', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
                {shownError}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting || loading}
              style={{ width: '100%', padding: '12px', backgroundColor: '#3B82F6', color: '#FFF', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: submitting || loading ? 'not-allowed' : 'pointer' }}
            >
              {submitting || loading ? "Please wait..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
