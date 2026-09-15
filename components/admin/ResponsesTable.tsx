"use client";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export interface TableAnswer { questionId: string; title: string; type: string; display: string[] }
export interface TableResponse { id: string; startedAt: string; completedAt: string | null; version: number; email: string | null; verified: boolean; answers: TableAnswer[] }

const stamp = (value: string) => new Date(value).toLocaleDateString("es-NI", { timeZone: "UTC", day: "2-digit", month: "short", year: "2-digit" });
const full = (value: string) => new Date(value).toLocaleString("es-NI", { timeZone: "UTC", dateStyle: "long", timeStyle: "short" });
const csvCell = (value: string) => `"${value.replaceAll('"', '""')}"`;

export function ResponsesTable({ responses, questions }: { responses: TableResponse[]; questions: { id: string; title: string }[] }) {
  const [search, setSearch] = useState("");
  const [onlyEmail, setOnlyEmail] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>(() => questions.slice(0, 4).map(q => q.id));
  const [pickerOpen, setPickerOpen] = useState(false);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return responses.filter(r => {
      if (onlyEmail && !r.email) return false;
      if (!term) return true;
      return (r.email ?? "").toLowerCase().includes(term)
        || r.answers.some(a => a.display.join(" ").toLowerCase().includes(term));
    });
  }, [responses, search, onlyEmail]);

  function exportCsv() {
    const header = ["Respuesta", "Completada", "Correo", "Verificado", ...questions.map(q => q.title)];
    const lines = visible.map((r, i) => [
      String(visible.length - i), r.completedAt ? full(r.completedAt) : "", r.email ?? "", r.email ? (r.verified ? "sí" : "no") : "",
      ...questions.map(q => (r.answers.find(a => a.questionId === q.id)?.display ?? []).join(" | ")),
    ]);
    const csv = "﻿" + [header, ...lines].map(row => row.map(c => csvCell(String(c))).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `psicocare-respuestas-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link); link.click(); link.remove();
    URL.revokeObjectURL(url);
  }

  if (!responses.length) return <div className="admin-empty"><p>Cuando alguien termine la encuesta, podrás leerla aquí.</p></div>;

  const shown = questions.filter(q => columns.includes(q.id));
  const current = visible.find(r => r.id === expanded) ?? null;
  return <div className="responses">
    <div className="responses-toolbar">
      <div className="responses-search">
        <Icon name="survey" size={17}/>
        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar en respuestas o correos" aria-label="Buscar en las respuestas"/>
      </div>
      <label className="responses-toggle"><input type="checkbox" checked={onlyEmail} onChange={e => setOnlyEmail(e.target.checked)}/><span>Solo con correo</span></label>
      <div className="responses-columns">
        <button className="button button-ghost button-small" onClick={() => setPickerOpen(o => !o)} aria-expanded={pickerOpen}>Columnas ({shown.length})<Icon name="arrow" size={15}/></button>
        {pickerOpen && <div className="column-picker" role="group" aria-label="Elegir columnas visibles">
          {questions.map(q => <label key={q.id}>
            <input type="checkbox" checked={columns.includes(q.id)} onChange={e => setColumns(c => e.target.checked ? [...c, q.id] : c.filter(id => id !== q.id))}/>
            <span>{q.title}</span>
          </label>)}
        </div>}
      </div>
      <button className="button button-ghost button-small" onClick={exportCsv}>Exportar CSV<Icon name="arrow" size={15}/></button>
    </div>

    <p className="responses-count" role="status">{visible.length === responses.length
      ? `${responses.length} ${responses.length === 1 ? "respuesta completa" : "respuestas completas"}`
      : `${visible.length} de ${responses.length} respuestas`}</p>

    <div className="responses-scroll">
      <table className="responses-table">
        <thead><tr>
          <th scope="col" className="col-index">#</th>
          <th scope="col" className="col-date">Completada</th>
          <th scope="col" className="col-email">Correo</th>
          {shown.map(q => <th scope="col" key={q.id}>{q.title}</th>)}
          <th scope="col" className="col-detail"><span className="sr-only">Detalle</span></th>
        </tr></thead>
        <tbody>{visible.map((response, i) => {
          const isOpen = expanded === response.id;
          return <tr key={response.id} className={isOpen ? "is-open" : ""}>
            <td className="col-index">{visible.length - i}</td>
            <td className="col-date">{response.completedAt ? stamp(response.completedAt) : "—"}</td>
            <td className="col-email">{response.email
              ? <span className={"response-email" + (response.verified ? " is-verified" : "")} title={response.email}>{response.email}</span>
              : <span className="response-email is-anon">Sin correo</span>}</td>
            {shown.map(q => {
              const answer = response.answers.find(a => a.questionId === q.id);
              const text = answer?.display.join(", ") ?? "";
              return <td key={q.id} title={text || undefined}>{text || <span className="cell-empty">—</span>}</td>;
            })}
            <td className="col-detail">
              <button className="row-toggle" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : response.id)}>
                {isOpen ? "Ocultar" : "Ver todo"}
              </button>
            </td>
          </tr>;
        })}</tbody>
      </table>
    </div>

    {current && <section className="detail-panel" aria-label="Detalle de la respuesta">
      <div className="detail-head">
        <p>Completada el {current.completedAt ? full(current.completedAt) : "—"} · Versión {current.version}{current.email && ` · ${current.email}${current.verified ? " (verificado)" : ""}`}</p>
        <button className="row-toggle" onClick={() => setExpanded(null)}>Cerrar detalle</button>
      </div>
      <dl className="detail-answers">{current.answers.map(answer => <div key={answer.questionId}>
        <dt>{answer.title}</dt>
        <dd>{answer.display.length ? answer.display.join(", ") : <em>Sin respuesta</em>}</dd>
      </div>)}</dl>
    </section>}
    {!visible.length && <div className="admin-empty"><p>Ninguna respuesta coincide con ese filtro.</p></div>}
  </div>;
}
