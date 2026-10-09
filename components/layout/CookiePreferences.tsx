"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { readConsent, saveConsent, type PrivacyConsent } from "@/lib/privacy-consent";
import { SiteAnalytics } from "./SiteAnalytics";
export function CookieSettingsButton() {
  return <button type="button" className="cookie-settings-link" onClick={()=>window.dispatchEvent(new Event("pc:privacy-open"))}>Configurar cookies</button>;
}
export function CookiePreferences() {
  const [loaded,setLoaded]=useState(false);
  const [consent,setConsent]=useState<PrivacyConsent|null>(null);
  const [open,setOpen]=useState(false);
  const [analytics,setAnalytics]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    queueMicrotask(()=>{const c=readConsent();setConsent(c);setAnalytics(c?.analytics??false);setLoaded(true)});
    const show=()=>{setAnalytics(readConsent()?.analytics??false);setOpen(true)};
    window.addEventListener("pc:privacy-open",show);
    return ()=>window.removeEventListener("pc:privacy-open",show);
  },[]);
  useEffect(()=>{if(open)dialog.current?.showModal();else dialog.current?.close()},[open]);
  function choose(value:boolean) {
    const wasEnabled=readConsent()?.analytics===true;
    saveConsent(value);
    // Reload removes the already-loaded analytics runtime after withdrawing permission.
    if(wasEnabled&&!value){location.reload();return}
    setConsent(readConsent());setOpen(false);
  }
  return <>
    {loaded&&!consent&&!open&&<section className="cookie-banner" aria-label="Cookies y privacidad"><div><h2>Tu privacidad, tú decides</h2><p>Usamos cookies necesarias para las encuestas y el acceso seguro. Solo activaremos la medición opcional de visitas si la aceptas. Puedes seguir navegando y descargar la app sin aceptarla. <Link href="/cookies">Política de cookies</Link> · <Link href="/privacidad">Privacidad</Link></p></div><div className="cookie-actions"><button onClick={()=>choose(false)}>Rechazar opcionales</button><button onClick={()=>setOpen(true)}>Configurar</button><button onClick={()=>choose(true)}>Aceptar opcionales</button></div></section>}
    <dialog ref={dialog} className="cookie-dialog" aria-labelledby="cookie-title" onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)}><h2 id="cookie-title">Cookies y preferencias</h2><p>Las opciones no necesarias están desactivadas inicialmente. Puedes cambiar tu elección cuando quieras desde el pie de página.</p><label className="cookie-category"><input type="checkbox" checked disabled/><span><strong>Necesarias · Siempre activas</strong><small>Seguridad, participación en encuestas y guardado de esta elección. No son cookies publicitarias.</small></span></label><label className="cookie-category"><input type="checkbox" checked={analytics} onChange={e=>setAnalytics(e.target.checked)}/><span><strong>Medición de visitas · Opcional</strong><small>Vercel Web Analytics: páginas públicas, país, navegador y dispositivo. No utiliza cookies publicitarias ni se cruza con tus respuestas. No se carga sin tu autorización.</small></span></label><p><Link href="/cookies">Ver el detalle</Link> · <Link href="/privacidad">Cómo usamos tus datos</Link></p><div className="cookie-actions"><button onClick={()=>choose(false)}>Rechazar opcionales</button><button onClick={()=>choose(analytics)}>Guardar preferencias</button><button onClick={()=>setOpen(false)}>Cerrar</button></div></dialog>
    {loaded&&consent?.analytics&&<SiteAnalytics/>}
  </>;
}
