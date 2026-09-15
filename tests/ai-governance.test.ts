import { describe, expect, it } from "vitest";
import { authorize, routeAgent } from "../ai/governance";
import { openVoiceProvider } from "../voice/openvoice";

describe("AI governance", () => {
  it("routes lab requests to lab agent", () => expect(routeAgent("quiero abrir el laboratorio SOC")).toBe("lab"));
  it("routes a standalone 'lab' word to lab agent", () => expect(routeAgent("abrir el lab ahora")).toBe("lab"));
  it("prioritizes security agent for incident analysis", () => expect(routeAgent("investiga este incidente de seguridad")).toBe("security"));
  it("does NOT misroute 'elaborar' to lab", () => expect(routeAgent("ayúdame a elaborar un plan")).toBe("tutor"));
  it("does NOT misroute 'colaborar' to lab", () => expect(routeAgent("quiero colaborar con el equipo")).toBe("tutor"));
  it("does NOT misroute 'ruta de archivo' to academic", () => expect(routeAgent("la ruta de archivo /tmp/x no existe")).toBe("tutor"));
  it("routes study-path requests to academic", () => expect(routeAgent("¿qué debo estudiar esta semana?")).toBe("academic"));
  it("denies credential issuance globally", () => expect(authorize("academic", "issue_credential").allowed).toBe(false));
  it("restricts sensitive operations in exam mode", () => expect(authorize("assessment", "propose_assessment", true).allowed).toBe(false));
  it("allows tutor to read own progress", () => expect(authorize("tutor", "read_own_progress").allowed).toBe(true));
});

describe("OpenVoice provider hardening", () => {
  it("requires explicit consent", async () => {
    await expect(
      openVoiceProvider("http://127.0.0.1:9999").synthesize({ text: "hola", language: "es", consent: false }),
    ).rejects.toThrow("voice_consent_required");
  });
  it("rejects when not configured", async () => {
    await expect(
      openVoiceProvider("").synthesize({ text: "hola", language: "es", consent: true }),
    ).rejects.toThrow("openvoice_provider_not_configured");
  });
  it("rejects oversized text before any fetch", async () => {
    await expect(
      openVoiceProvider("http://127.0.0.1:9999").synthesize({ text: "a".repeat(2001), language: "es", consent: true }),
    ).rejects.toThrow("openvoice_text_too_long");
  });
});
