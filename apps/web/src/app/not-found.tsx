import Link from "next/link";
import "./globals.css";

/**
 * 404 real. Con dos layouts raíz (portugués y rutas por idioma) la página de
 * error declara su propio documento, así que funciona igual en la exportación
 * estática y en el servidor.
 */
export default function NotFound() {
  return (
    <html lang="pt" data-contrast="normal">
      <head>
        <title>404 · secure T — página não encontrada</title>
        <meta
          name="description"
          content="Esta página não existe. O campus secure T continua disponível: quatro programas de vinte semanas, materiais e agente, também offline."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Saltar para o conteúdo
        </a>
        <main className="wrap section" id="main">
          <p className="eyebrow">404</p>
          <h1>Esta página não existe (ou mudou de sítio)</h1>
          <p className="lead">
            O campus continua inteiro: quatro programas de vinte semanas, materiais e agente, todos disponíveis offline.
          </p>
          <p className="mono muted">
            Esta página no existe (o cambió de sitio) · This page does not exist (or moved) · Aquesta pàgina no existeix.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn" href="/">
              secure T
            </Link>
            <Link className="btn btn-ghost" href="/programas">
              Campus
            </Link>
            <Link className="btn btn-ghost" href="/agente">
              AURUM · agente
            </Link>
            <a className="btn btn-ghost" href="/campus/">
              Campus clássico
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
