import { describe, expect, it } from "vitest";
import {
  canonicalize,
  completionOf,
  credentialText,
  emptyProgress,
  markWeek,
  parseProgress,
  recordQuiz,
  sealProgress,
  setFlag,
  setProject,
  verifyProgress
} from "../src/index";

describe("expediente anónimo (promesa P6)", () => {
  it("empieza vacío, sin datos personales y con token del dispositivo", () => {
    const record = emptyProgress("3f2504e0-4f89-11d3-9a0c-0305e82c3301", "es");
    expect(record.courses).toEqual({});
    expect(record.version).toBe(1);
    expect(JSON.stringify(record)).not.toMatch(/@/);
    expect(Object.keys(record)).not.toContain("email");
  });

  it("marca semanas, quizzes, laboratorio, proyecto y examen", () => {
    let record = emptyProgress("token-anonimo-1234");
    record = markWeek(record, "ciber-ofensiva", 1);
    record = markWeek(record, "ciber-ofensiva", 2);
    record = markWeek(record, "ciber-ofensiva", 1, false);
    expect(record.courses["ciber-ofensiva"].weeks).toEqual([2]);
    record = recordQuiz(record, "ciber-ofensiva", 6, 6);
    record = setFlag(record, "ciber-ofensiva", "lab");
    record = setProject(record, "ciber-ofensiva", "Informe de hallazgos del laboratorio autorizado.");
    record = setFlag(record, "ciber-ofensiva", "exam");
    expect(record.courses["ciber-ofensiva"].quiz?.score).toBe(6);
  });

  it("guarda la mejor nota de quiz, no la última", () => {
    let record = emptyProgress("token-anonimo-1234");
    record = recordQuiz(record, "curso", 5, 6);
    record = recordQuiz(record, "curso", 3, 6);
    expect(record.courses.curso.quiz?.score).toBe(5);
  });

  it("firma el expediente y detecta cualquier manipulación", async () => {
    let record = emptyProgress("token-anonimo-1234");
    record = markWeek(record, "ciber-defensiva", 3);
    const signed = await sealProgress(record);
    expect(signed.seal).toHaveLength(64);
    expect(await verifyProgress(signed)).toBe(true);

    const tampered = { ...signed, courses: { ...signed.courses, "ciber-defensiva": { ...signed.courses["ciber-defensiva"], weeks: [1, 2, 3, 4, 5] } } };
    expect(await verifyProgress(tampered)).toBe(false);

    const wrongSeal = { ...signed, seal: "0".repeat(64) };
    expect(await verifyProgress(wrongSeal)).toBe(false);
  });

  it("canonicaliza en JSON determinista (claves ordenadas)", () => {
    expect(canonicalize({ b: 1, a: { d: 2, c: [3, { z: 1, y: 2 }] } })).toBe('{"a":{"c":[3,{"y":2,"z":1}],"d":2},"b":1}');
    expect(canonicalize({ a: 1, b: undefined })).toBe('{"a":1}');
  });

  it("rechaza ficheros importados que no cumplen el esquema", () => {
    expect(parseProgress("no es json")).toBeNull();
    expect(parseProgress('{"version":2,"token":"x"}')).toBeNull();
    expect(parseProgress('{"version":1,"token":"corto"}')).toBeNull();
    const valid = JSON.stringify(emptyProgress("token-anonimo-1234"));
    expect(parseProgress(valid)?.token).toBe("token-anonimo-1234");
  });

  it("calcula el grado de avance con los pesos 60/15/10/10/5", async () => {
    let record = emptyProgress("token-anonimo-1234");
    for (let week = 1; week <= 20; week += 1) record = markWeek(record, "curso", week);
    expect(completionOf(record, "curso").percent).toBe(60);
    record = recordQuiz(record, "curso", 6, 6);
    record = setFlag(record, "curso", "lab");
    record = setProject(record, "curso", "Evidencia del proyecto final entregada.");
    record = setFlag(record, "curso", "exam");
    const report = completionOf(record, "curso");
    expect(report.percent).toBe(100);
    expect(report.ready).toBe(true);
    expect(report.missing).toEqual([]);
  });

  it("no marca como completo lo que no lo está", () => {
    const record = emptyProgress("token-anonimo-1234");
    const report = completionOf(record, "curso");
    expect(report.ready).toBe(false);
    expect(report.missing).toContain("quiz");
    expect(report.missing).toContain("lab");
    expect(report.percent).toBe(0);
    // Un proyecto de dos letras no es evidencia.
    let short = setProject(record, "curso", "ok");
    expect(completionOf(short, "curso").projectDone).toBe(false);
    short = recordQuiz(short, "curso", 1, 6);
    expect(completionOf(short, "curso").quizDone).toBe(false);
  });

  it("declara en el texto de la credencial lo que sigue pendiente", () => {
    const text = credentialText({
      token: "anon-1234",
      slug: "ciber-defensiva",
      courseTitle: "Operar como SOC",
      weeksTotal: 20,
      issuedAt: "2026-10-11T00:00:00.000Z",
      locale: "es"
    });
    expect(text).toContain("SHA-256");
    expect(text).toContain("PLANIFICADO");
    expect(text).toContain("20");
    expect(text).not.toMatch(/blockchain/i);
  });
});
