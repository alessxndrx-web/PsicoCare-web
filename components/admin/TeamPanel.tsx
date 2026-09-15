"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export interface TeamUserView { id: string; email: string; name: string; disabled: boolean; mustChangePassword: boolean; createdAt: string; lastLoginAt: string | null }

const when = (value: string | null) => value
  ? new Date(value).toLocaleDateString("es-NI", { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" })
  : "Nunca";

export function TeamPanel({ initialUsers, currentUserId, mustChangePassword }: { initialUsers: TeamUserView[]; currentUserId: string; mustChangePassword: boolean }) {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [changing, setChanging] = useState(mustChangePassword);

  async function send(method: string, body: unknown, onDone?: (data: { users?: TeamUserView[] }) => void) {
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/users", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (data.users) setUsers(data.users);
      onDone?.(data);
    } catch (error) { setError(error instanceof Error ? error.message : "No pudimos completar la acción."); }
    finally { setBusy(false); }
  }

  return <section className="team-panel">
    <div className="team-head">
      <div><h2>Equipo</h2><p className="muted">Cada persona entra con su propia cuenta. Todas las cuentas tienen los mismos permisos, incluida la gestión del equipo.</p></div>
      <button className="button button-primary button-small" onClick={() => { setOpen(o => !o); setError(""); setNotice(""); }} aria-expanded={open}>
        {open ? "Cancelar" : "Añadir cuenta"}<Icon name={open ? "back" : "arrow"} size={16}/>
      </button>
    </div>

    {mustChangePassword && changing && <p className="team-warning" role="status"><Icon name="lock" size={18}/>Estás usando una contraseña asignada por otra persona. Cámbiala antes de seguir.</p>}

    {open && <form className="team-form" onSubmit={async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const el = event.currentTarget;
      await send("POST", { name: form.get("name"), email: form.get("email"), password: form.get("password") }, () => {
        el.reset(); setOpen(false); setNotice("Cuenta creada. Comparte la contraseña por un canal seguro; se le pedirá cambiarla al entrar.");
      });
    }}>
      <div className="form-row"><label>Nombre<input name="name" required minLength={2} maxLength={120} autoComplete="off"/></label><label>Correo<input name="email" type="email" required maxLength={200} autoComplete="off"/></label></div>
      <label>Contraseña inicial<input name="password" type="text" required minLength={12} maxLength={200} autoComplete="off" placeholder="Mínimo 12 caracteres, con letras y números"/></label>
      <p className="team-hint">Se muestra en claro para que puedas copiarla y entregarla. La persona deberá cambiarla en su primer acceso.</p>
      <button className="button button-primary" disabled={busy}>{busy ? "Creando…" : "Crear cuenta"}<Icon name="arrow" size={16}/></button>
    </form>}

    {error && <p className="form-error" role="alert">{error}</p>}
    {notice && <p className="team-notice" role="status">{notice}</p>}

    <ul className="team-list">{users.map(user => <li key={user.id} className={user.disabled ? "is-disabled" : ""}>
      <div className="team-person">
        <span className="team-avatar" aria-hidden="true">{user.name.trim().charAt(0).toUpperCase()}</span>
        <div><strong>{user.name}{user.id === currentUserId && <span className="team-you">Tú</span>}</strong><span className="team-email">{user.email}</span></div>
      </div>
      <div className="team-meta"><span>Último acceso: {when(user.lastLoginAt)}</span><span>Alta: {when(user.createdAt)}</span></div>
      <div className="team-actions">
        {user.disabled ? <span className="team-state is-off">Desactivada</span> : <span className="team-state is-on">Activa</span>}
        {user.id !== currentUserId && <button className="button button-ghost button-small" disabled={busy}
          onClick={() => send("PATCH", { id: user.id, disabled: !user.disabled })}>
          {user.disabled ? "Reactivar" : "Desactivar"}
        </button>}
      </div>
    </li>)}</ul>

    <div className="team-password">
      {!changing ? <button className="text-action" onClick={() => setChanging(true)}>Cambiar mi contraseña<Icon name="arrow" size={16}/></button> :
      <form onSubmit={async event => {
        event.preventDefault();
        const password = new FormData(event.currentTarget).get("password");
        const el = event.currentTarget;
        await send("PUT", { password }, () => { el.reset(); setChanging(false); setNotice("Tu contraseña se actualizó."); });
      }}>
        <label>Nueva contraseña<input name="password" type="password" required minLength={12} maxLength={200} autoComplete="new-password"/></label>
        <div className="button-row">
          <button className="button button-primary button-small" disabled={busy}>{busy ? "Guardando…" : "Guardar contraseña"}</button>
          {!mustChangePassword && <button type="button" className="button button-ghost button-small" onClick={() => setChanging(false)}>Cancelar</button>}
        </div>
      </form>}
    </div>
  </section>;
}
