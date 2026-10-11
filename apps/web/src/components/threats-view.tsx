"use client";

import { useMemo, useState } from "react";
import { translator, type Locale } from "@secure-t/shared";
import type { KevEntry, NvdEntry, ThreatIntel } from "@/lib/content";

type Row = {
  id: string;
  vendor: string;
  product: string;
  name: string;
  date: string;
  ransomware: boolean;
  detail: string;
  score?: number;
  extra?: string;
};

/**
 * Panel de amenazas: lee el catálogo que descargan los scripts del repositorio
 * (KEV de la CISA + críticos recientes del NVD) y lo hace navegable sin
 * conexión. No hay llamadas en vivo: el archivo viaja con el sitio, así que
 * también funciona en la versión estática y en el móvil sin datos.
 */
export function ThreatsView({ locale, intel }: { locale: Locale; intel: ThreatIntel }) {
  const t = translator(locale);
  const [tab, setTab] = useState<"exploited" | "recent">("exploited");
  const [query, setQuery] = useState("");
  const [onlyRansomware, setOnlyRansomware] = useState(false);

  const exploited = useMemo<Row[]>(
    () =>
      (intel.kev?.recent ?? []).map((entry: KevEntry) => ({
        id: entry.cve_id,
        vendor: entry.vendor,
        product: entry.product,
        name: entry.name,
        date: entry.date_added,
        ransomware: /known/i.test(String(entry.ransomware)),
        detail: entry.short_description
      })),
    [intel]
  );

  const recent = useMemo<Row[]>(
    () =>
      (intel.nvd_critical_recent ?? []).map((entry: NvdEntry) => ({
        id: entry.cve_id,
        vendor: entry.attack_vector ?? "—",
        product: entry.refs?.[0]?.tags?.join(", ") ?? "NVD",
        name: entry.description.slice(0, 120),
        date: entry.published,
        ransomware: false,
        detail: entry.description,
        score: entry.score
      })),
    [intel]
  );

  const source = tab === "exploited" ? exploited : recent;
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return source
      .filter((row) =>
        needle
          ? [row.id, row.vendor, row.product, row.name, row.detail].filter(Boolean).join(" ").toLowerCase().includes(needle)
          : true
      )
      .filter((row) => (onlyRansomware ? row.ransomware : true));
  }, [source, query, onlyRansomware]);

  const stats = intel.stats;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0">{t("threats.title")}</h1>
          <p className="lead">{t("threats.lead")}</p>
          <p className="mono text-[0.75rem] text-[var(--aurum-muted)]">
            {t("threats.updated")}: {(intel.generated_utc ?? "").slice(0, 10)} · KEV {intel.kev?.catalog_version ?? "—"} ·{" "}
            {intel.kev?.total_count?.toLocaleString(locale) ?? "—"} {t("search.results")}
          </p>
        </div>
        <div className="field max-w-xs">
          <label htmlFor="threat-query">{t("threats.search")}</label>
          <input id="threat-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>

      {stats ? (
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="card">
            <dt className="mono text-[0.68rem] uppercase tracking-[0.1em] text-[var(--aurum-muted)]">KEV</dt>
            <dd className="m-0 text-xl text-[var(--color-gold-bright)]">{stats.total_kev?.toLocaleString(locale)}</dd>
          </div>
          <div className="card">
            <dt className="mono text-[0.68rem] uppercase tracking-[0.1em] text-[var(--aurum-muted)]">ransomware</dt>
            <dd className="m-0 text-xl text-[var(--color-coral)]">{stats.ransomware_pct?.toFixed(1)} %</dd>
          </div>
          <div className="card">
            <dt className="mono text-[0.68rem] uppercase tracking-[0.1em] text-[var(--aurum-muted)]">
              {t("threats.exploited")}
            </dt>
            <dd className="m-0 text-xl text-[var(--color-gold-bright)]">{exploited.length}</dd>
          </div>
          <div className="card">
            <dt className="mono text-[0.68rem] uppercase tracking-[0.1em] text-[var(--aurum-muted)]">NVD ≥ 9.0</dt>
            <dd className="m-0 text-xl text-[var(--color-azure)]">{recent.length}</dd>
          </div>
        </dl>
      ) : null}

      {stats?.top_vendors?.length ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {stats.top_vendors.slice(0, 8).map((vendor) => (
            <li key={vendor.vendor} className="badge">
              {vendor.vendor} · {vendor.count}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div role="tablist" aria-label={t("threats.title")} className="flex gap-1">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "exploited"}
            className={`btn btn-sm ${tab === "exploited" ? "" : "btn-ghost"}`}
            onClick={() => setTab("exploited")}
          >
            {t("threats.exploited")} ({exploited.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "recent"}
            className={`btn btn-sm ${tab === "recent" ? "" : "btn-ghost"}`}
            onClick={() => setTab("recent")}
          >
            {t("threats.recent")} ({recent.length})
          </button>
        </div>
        <label className="mono ml-auto flex items-center gap-2 text-[0.75rem] text-[var(--aurum-muted)]">
          <input type="checkbox" checked={onlyRansomware} onChange={(event) => setOnlyRansomware(event.target.checked)} />
          ransomware
        </label>
      </div>

      <div className="table-wrap mt-4 max-h-[70vh]">
        <table>
          <caption className="sr-only">{tab === "exploited" ? t("threats.exploited") : t("threats.recent")}</caption>
          <thead>
            <tr>
              <th scope="col">CVE</th>
              <th scope="col">{t("campus.project")}</th>
              <th scope="col">{t("threats.lead")}</th>
              <th scope="col">{t("calendar.start")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 300).map((row) => (
              <tr key={`${row.id}-${row.date}`}>
                <td className="mono">
                  <a href={`https://nvd.nist.gov/vuln/detail/${row.id}`} rel="noopener noreferrer" target="_blank">
                    {row.id}
                  </a>
                </td>
                <td>
                  {row.vendor}
                  {row.product && row.product !== "—" ? <span className="muted"> · {row.product}</span> : null}
                </td>
                <td>
                  {row.name}
                  {row.ransomware ? <span className="badge ml-2">ransomware</span> : null}
                  {row.score ? <span className="badge badge-azure ml-2">CVSS {row.score}</span> : null}
                </td>
                <td className="mono text-[0.78rem]">{(row.date ?? "").slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? <p className="muted mt-4">{t("search.empty")}</p> : null}
      <p className="mono mt-4 text-[0.72rem] text-[var(--aurum-muted)]">
        CISA KEV (dominio público) · NVD/NIST · {t("campus.offline")}
      </p>
    </div>
  );
}
