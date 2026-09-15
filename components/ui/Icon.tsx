import type { CSSProperties, ReactNode } from "react";
const paths: Record<string, ReactNode> = {
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />, back: <path d="M19 12H5m6-6-6 6 6 6" />,
  chat: <><path d="M21 11a8 8 0 0 1-8 8H5l-4 3 2-7a8 8 0 0 1 7-12h3a8 8 0 0 1 8 8Z" /><path d="M7 10h.01M12 10h.01M17 10h.01" /></>,
  book: <path d="M12 5C8 2 4 3 2 4v15c3-1 6-1 10 1 4-2 7-2 10-1V4c-2-1-6-2-10 1Zm0 0v15" />,
  people: <><circle cx="9" cy="7" r="3"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M16 4a3 3 0 0 1 0 6m3 4a5 5 0 0 1 3 5v2"/></>,
  steps: <path d="M3 20h6v-6h6V8h6V2M3 20v-5m6-1V9m6-1V3"/>,
  wind: <path d="M3 8h12a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h6a3 3 0 1 1-3 3"/>,
  chart: <path d="M4 21V11h4v10m4 0V6h4v15m4 0V2h2v19"/>,
  survey: <><rect x="4" y="4" width="16" height="18" rx="2"/><path d="M9 4V2h6v2M8 10h1m3 0h4M8 15h1m3 0h4"/></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
  shield: <><path d="m12 2 8 3v6c0 5-4 9-8 11-4-2-8-6-8-11V5l8-3Z"/><path d="m8 12 3 3 5-6"/></>,
  lock: <><rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 6v2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  home: <><path d="m3 10 9-8 9 8v11H3V10Z"/><path d="M9 21v-8h6v8"/></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>, close: <path d="m6 6 12 12M6 18 18 6"/>,
  play: <path d="m9 4 12 8-12 8V4Z"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7L22 6"/></>,
  star: <path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>,
};
export function Icon({ name, size = 24, style }: { name: string; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name] ?? paths.heart}</svg>;
}
