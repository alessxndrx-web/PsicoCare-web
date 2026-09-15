"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

export function AdminLogin({ ready, hasUsers }: { ready: boolean; hasUsers: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const message = !ready
    ? "El almacenamiento todavía no está configurado, así que el acceso interno no está disponible."
    : hasUsers
      ? "Entra con tu cuenta para consultar los resultados de la investigación."
      : "Todavía no hay ninguna cuenta creada. El equipo técnico debe ejecutar el comando de arranque para crear la primera.";
  return <div className="admin-login"><Icon name="lock" size={32}/><p className="eyebrow">Acceso del equipo</p><h1>Un espacio interno.</h1><p>{message}</p>
    {ready && hasUsers && <form onSubmit={async event => {
      event.preventDefault(); setBusy(true); setError("");
      const form = new FormData(event.currentTarget);
      try {
        const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
        const data = await response.json(); if (!response.ok) throw new Error(data.error);
        router.refresh();
      } catch (error) { setError(error instanceof Error ? error.message : "No se pudo abrir la sesión."); }
      finally { setBusy(false); }
    }}>
      <label htmlFor="admin-email">Correo</label>
      <input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={200}/>
      <label htmlFor="admin-password">Contraseña</label>
      <input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={200}/>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary" disabled={busy}>{busy ? "Verificando…" : "Entrar"}<Icon name="arrow" size={16}/></button>
    </form>}
  </div>;
}

export function AdminLogout({ name }: { name: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  return <div className="admin-identity">
    <span className="admin-who"><Icon name="people" size={17}/>{name}</span>
    <button className="button button-ghost button-small" onClick={async () => {
      try { const response = await fetch("/api/admin/session", { method: "DELETE" }); if (!response.ok) throw new Error(); router.refresh(); }
      catch { setError("No se pudo cerrar la sesión. Inténtalo de nuevo."); }
    }}>Cerrar sesión</button>
    {error && <p role="alert" className="form-error">{error}</p>}
  </div>;
}
