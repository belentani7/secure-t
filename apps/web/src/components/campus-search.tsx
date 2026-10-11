"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  buildIndex,
  excerptFor,
  highlight,
  knowledgeToSearchDocs,
  search,
  translator,
  type KnowledgePack,
  type Locale,
  type SearchIndex,
  type SearchHit,
  type SearchDoc
} from "@secure-t/shared";
import { asset, localePath } from "@/lib/site";

/**
 * Buscador del campus: mismo motor BM25 que usa el agente, en el navegador.
 * Sustituye al fuse.js vendoreado sin perder la promesa de funcionar sin conexión.
 */
export function CampusSearch({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const [pack, setPack] = useState<KnowledgePack | null>(null);
  const [index, setIndex] = useState<SearchIndex<SearchDoc> | null>(null);
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    fetch(asset("/content/knowledge.json"))
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("no-pack"))))
      .then((data: KnowledgePack) => {
        if (cancelled) return;
        setPack(data);
        setIndex(buildIndex(knowledgeToSearchDocs(data)));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const hits = useMemo<SearchHit<SearchDoc>[]>(() => {
    if (!index || query.trim().length < 3) return [];
    return search(index, query, { limit: 8, ...(course ? { course } : {}), minScore: 0.2 });
  }, [index, query, course]);

  const courses = useMemo(() => {
    const map = new Map<string, string>();
    for (const chunk of pack?.chunks ?? []) map.set(chunk.course, chunk.courseTitle);
    return [...map.entries()];
  }, [pack]);

  return (
    <section className="card" aria-labelledby="search-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="search-title" className="card-title">
            {t("search.title")}
          </h2>
          <p className="mono text-[0.75rem] text-[var(--aurum-muted)]">
            {pack ? `${pack.counts.chunks} fragmentos · ${pack.counts.words} palavras · offline` : t("common.loading")}
          </p>
        </div>
        <div className="field w-full sm:w-56">
          <label htmlFor="search-course">{t("campus.courses")}</label>
          <select id="search-course" value={course} onChange={(event) => setCourse(event.target.value)}>
            <option value="">{t("common.all")}</option>
            {courses.map(([slug, title]) => (
              <option key={slug} value={slug}>
                {title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field mt-4">
        <label htmlFor="search-query">{t("search.placeholder")}</label>
        <input
          id="search-query"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("search.placeholder")}
          autoComplete="off"
        />
      </div>

      {index && query.trim().length >= 3 ? (
        <p className="mono mt-2 text-[0.75rem] text-[var(--aurum-muted)]" role="status">
          {hits.length} {t("search.results")}
        </p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {hits.map((hit) => (
          <li key={hit.doc.id} className="border-t border-[var(--aurum-line)] pt-3">
            <p className="mb-1 flex flex-wrap items-center gap-2">
              <Link href={localePath(locale, hit.doc.url ?? "/programas")} className="font-semibold">
                {hit.doc.title}
              </Link>
              <span className="badge">{hit.doc.kind}</span>
              <span className="mono text-[0.7rem] text-[var(--aurum-muted)]">
                {t("search.inCourse")} {pack?.chunks.find((chunk) => chunk.id === hit.doc.id)?.courseTitle ?? hit.doc.course}
              </span>
            </p>
            <p
              className="muted m-0 text-[0.92rem]"
              dangerouslySetInnerHTML={{
                __html: highlight(
                  excerptFor(hit.doc, hit.matched)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;"),
                  hit.matched
                )
              }}
            />
          </li>
        ))}
      </ul>

      {index && query.trim().length >= 3 && hits.length === 0 ? (
        <p className="muted mt-3">{t("search.empty")}</p>
      ) : null}
    </section>
  );
}
