"use client";

import { useState } from "react";
import {
  derivarToken,
  normalizarLlave,
  semillaDeDispositivo,
  translator,
  type Locale
} from "@secure-t/shared";
import { adoptToken, tokenAleatorio, useProgress } from "@/lib/progress-store";
import { estadoDeLlave, guardarLlave, leerLlave, olvidarLlave } from "@/lib/key-store";

type Estado = "espera" | "pensando" | "aplicada" | "error";

/**
 * La llave de cuatro dígitos, contada sin trampas.
 *
 * En pantalla queda claro qué se guarda (una semilla y un token derivado), qué
 * no se guarda (los cuatro dígitos) y que cuatro dígitos no son un secreto.
 * Cuando el token cambia, el aviso se anuncia por `aria-live` porque es un
 * cambio de identidad, no una decoración.
 */
export function KeyPanel({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const record = useProgress();
  const [entrada, setEntrada] = useState("");
  const [estado, setEstado] = useState<Estado>("espera");

  async function aplicar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const cuatro = normalizarLlave(entrada);
    if (!cuatro) {
      setEstado("error");
      return;
    }
    setEstado("pensando");
    const semilla = leerLlave()?.semilla ?? semillaDeDispositivo();
    // La llave vive en esta línea y en ninguna otra: ni se guarda ni se envía.
    const token = await derivarToken(cuatro, semilla);
    guardarLlave(estadoDeLlave(semilla, token));
    adoptToken(token);
    setEntrada("");
    setEstado("aplicada");
  }

  function volverAlAzar() {
    olvidarLlave();
    adoptToken(tokenAleatorio());
    setEstado("espera");
  }

  return (
    <section className="card" aria-labelledby="llave">
      <h2 id="llave" className="card-title">
        {t("key.title")}
      </h2>
      <p className="muted">{t("key.lead")}</p>

      <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={aplicar}>
        <label className="flex flex-col gap-1 text-sm">
          <span className="mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-gold)]">
            {t("key.label")}
          </span>
          <input
            className="mono w-32 rounded border border-[var(--aurum-line-strong)] bg-transparent px-3 py-2 text-center text-lg tracking-[0.3em]"
            value={entrada}
            onChange={(evento) => {
              setEntrada(evento.target.value);
              if (estado !== "espera") setEstado("espera");
            }}
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            maxLength={8}
            placeholder={t("key.placeholder")}
            aria-describedby="llave-nota"
          />
        </label>
        <button className="btn" type="submit" disabled={estado === "pensando"}>
          {t("key.apply")}
        </button>
        <button className="btn btn-ghost" type="button" onClick={volverAlAzar}>
          {t("key.random")}
        </button>
      </form>

      <p role="status" aria-live="polite" className="mono mt-3 text-[0.8rem] text-[var(--color-gold-bright)]">
        {estado === "aplicada" ? t("key.applied") : estado === "error" ? t("key.error") : ""}
      </p>

      <p className="mono mt-2 text-[0.78rem] text-[var(--aurum-muted)]">
        {t("key.current")}: <span className="text-[var(--color-gold-bright)]">{record.token}</span>
      </p>

      <p id="llave-nota" className="mt-4 text-sm text-[var(--aurum-muted)]">
        {t("key.note")}
      </p>
      <p className="mt-2 text-sm text-[var(--aurum-muted)]">{t("key.warning")}</p>
    </section>
  );
}
