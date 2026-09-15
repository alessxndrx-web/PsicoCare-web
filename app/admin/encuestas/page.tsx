import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/Primitives";
import { AdminLogin, AdminLogout } from "@/components/admin/AdminSession";
import { TeamPanel } from "@/components/admin/TeamPanel";
import { ResponsesTable } from "@/components/admin/ResponsesTable";
import { countUsers, currentUser, listUsers, purgeExpiredSessions } from "@/lib/server/auth";
import { databaseConfigured, enforceRetention, query } from "@/lib/database";
import { getSurvey, listResponsesForAdmin } from "@/lib/surveys/repository";
import { surveyAnalytics } from "@/lib/surveys/analytics";
import { SURVEY_SLUG } from "@/lib/surveys/types";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata: Metadata = { title: "Panel interno de investigación", robots: { index: false, follow: false } };
const format = (n: number | null, suffix = "") => n === null ? "—" : new Intl.NumberFormat("es", { maximumFractionDigits: 1 }).format(n) + suffix;

export default async function Page() {
  if (!databaseConfigured()) {
    return <section className="admin-shell"><Container><AdminLogin ready={false} hasUsers={false}/></Container></section>;
  }
  let user;
  try { user = await currentUser(); }
  catch { return <section className="admin-shell"><Container><AdminLogin ready={false} hasUsers={false}/></Container></section>; }

  if (!user) {
    let hasUsers = false;
    try { hasUsers = (await countUsers()) > 0; } catch { /* storage unreachable */ }
    return <section className="admin-shell"><Container><AdminLogin ready hasUsers={hasUsers}/></Container></section>;
  }

  let survey; let metrics; let leads; let responses; let users;
  try {
    await purgeExpiredSessions();
    await enforceRetention();
    survey = await getSurvey(SURVEY_SLUG);
    metrics = survey ? await surveyAnalytics(survey) : null;
    responses = survey ? await listResponsesForAdmin(survey) : [];
    users = await listUsers();
    leads = await query("SELECT name, email, organization, audience, message, created_at, role, community_size, interest FROM contact_leads ORDER BY created_at DESC LIMIT 100");
  } catch {
    return <section className="admin-shell"><Container><AdminLogout name={user.name}/><div className="admin-empty"><h1>No se pudo abrir el panel.</h1><p>El almacenamiento no está disponible. El equipo técnico puede comprobar la configuración y las migraciones.</p></div></Container></section>;
  }

  return <section className="admin-shell"><Container>
    <div className="admin-heading"><div><Eyebrow>Investigación de producto · Acceso interno</Eyebrow><h1>Escuchar para construir.</h1></div><AdminLogout name={user.name}/></div>
    <p className="muted">Datos reales de la encuesta. Los gráficos agregados requieren al menos cinco respuestas completas y excluyen edad y texto libre. Más abajo puedes leer cada respuesta finalizada por separado.</p>

    {metrics && <div className="metric-grid">{[
      [format(metrics.total), "Participaciones iniciadas"], [format(metrics.completed), "Respuestas completas"], [format(metrics.completionRate, " %"), "Tasa de finalización"],
      [format(metrics.willingness), "Disposición media · 1–5"], [format(metrics.recommendation), "Recomendación media · 0–10"],
    ].map(([value, label]) => <div className="metric-card" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>}

    {!metrics || metrics.completed < 5 ? <div className="admin-empty"><h2>{metrics?.total ? "La investigación está empezando." : "Todavía no hay respuestas."}</h2><p>{metrics?.total ? "Los detalles agregados estarán disponibles cuando haya al menos cinco respuestas completas." : "Las respuestas aparecerán aquí cuando las personas participen. Este panel no contiene cifras de ejemplo."}</p></div> :
    <><div className="analytics-grid"><Chart title="Respuestas completas por día (UTC)" items={metrics.trend} total={Math.max(...metrics.trend.map(d => d.count), 1)}/>{metrics.distributions.map(q => <Chart key={q.id} title={q.title} items={q.items} total={q.count}/>)}</div><p className="survey-status-note">Respuestas de texto recibidas: {metrics.openTextCount}. El texto y los rangos de edad se excluyen de estos gráficos agregados y solo se consultan en el detalle de cada respuesta.</p></>}

    <section className="admin-responses"><h2>Respuestas finalizadas</h2>
      <p className="muted">Contiene texto libre escrito por participantes: trátalo como información confidencial y no la publiques sin agregar.</p>
      <ResponsesTable responses={responses ?? []} questions={(survey?.questions ?? []).map(q => ({ id: q.id, title: q.title }))}/>
    </section>

    <section className="admin-leads"><h2>Buzón de contacto</h2><p className="muted">Últimos 100 mensajes. Estos contactos son independientes de las encuestas y solo deben usarse para responder a su consulta.</p>
      {!leads?.length ? <div className="admin-empty"><p>Aún no hay mensajes de contacto.</p></div> : leads.map((lead, i) => <article className="lead-card" key={i}><h3>{String(lead.name)} · {String(lead.audience)}</h3><p>{[lead.organization, lead.role, lead.community_size, lead.interest && "Interés: " + lead.interest].filter(Boolean).map(String).join(" · ")} · {new Date(String(lead.created_at)).toLocaleDateString("es-NI", { timeZone: "UTC" })}</p><a href={"mailto:" + String(lead.email)}>{String(lead.email)}</a><p>{String(lead.message)}</p></article>)}
    </section>

    <TeamPanel initialUsers={users ?? []} currentUserId={user.id} mustChangePassword={user.mustChangePassword}/>
  </Container></section>;
}

function Chart({ title, items, total }: { title: string; items: { label: string; count: number }[]; total: number }) {
  return <section className="analytics-card"><h2>{title}</h2><ul>{items.map(item => <li className="analytics-row" key={item.label}><div><span>{item.label}</span><strong>{item.count}</strong></div><div className="analytics-bar" aria-hidden="true"><span style={{ width: Math.min(item.count / (total || 1) * 100, 100) + "%" }}/></div></li>)}</ul></section>;
}
