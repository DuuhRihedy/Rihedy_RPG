"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import "./login.css";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="login-screen">
      <div className="login-bg" />
      <div className="login-vignette" />

      <div className="login-container">
        <div className="login-brand">
          <div className="login-brand-icon">⚔️</div>
          <h1>Hub RPG</h1>
          <p>Centro de Comando do Mestre</p>
        </div>

        <form className="login-form" action={formAction}>
          {state?.error && (
            <div className="login-error">{state.error}</div>
          )}

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={pending}>
            {pending ? "⏳ Entrando..." : "⚔️ Entrar"}
          </button>
        </form>

        <div className="login-footer">
          <span>Rihedy RPG — Virtual Tabletop</span>
        </div>
      </div>
    </div>
  );
}
