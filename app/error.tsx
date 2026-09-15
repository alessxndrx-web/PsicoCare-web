"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="document-page"><div className="container"><h1>No pudimos abrir este espacio.</h1><p className="document-lead">Inténtalo de nuevo en unos momentos.</p><button className="button button-primary" onClick={reset}>Volver a intentar</button></div></section>;
}
