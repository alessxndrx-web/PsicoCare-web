"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { nav } from "@/lib/content";
export function Navbar() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    const onResize = () => { if (window.innerWidth >= 1100) setOpen(false); };
    document.addEventListener("keydown", onKey); window.addEventListener("resize", onResize);
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open]);
  return <header className="site-header"><nav className="container nav-inner" aria-label="Navegación principal">
    <Link href="/" aria-label="PsicoCare — inicio" onClick={() => setOpen(false)}><Logo /></Link>
    <div className="desktop-nav">{nav.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
    <Link className="button button-small button-primary nav-cta" href="/#app-movil">Probar la experiencia <Icon name="arrow" size={16}/></Link>
    <button className="menu-trigger icon-button" ref={trigger} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"}/></button>
    {open && <div id="mobile-menu" className="mobile-menu" ref={menu}>{[...nav, { label: "Nosotros", href: "/nosotros" }, { label: "Contacto", href: "/#contacto" }].map(item => <Link onClick={() => setOpen(false)} key={item.href} href={item.href}>{item.label}<Icon name="arrow" size={18}/></Link>)}</div>}
  </nav></header>;
}
