import { translator, type Locale } from "@secure-t/shared";
import { SITE } from "@/lib/site";

/**
 * Aviso de privacidad en lenguaje claro (art. 13 RGPD / Reglamento UE 2016/679).
 *
 * No hay letra pequeña porque no hay nada que esconder: el campus no recoge
 * datos personales. Se documenta también lo que ocurre **fuera** del navegador
 * —las visitas al hosting, los enlaces a GitHub, el proveedor de voz opcional—
 * porque un aviso que sólo habla de lo bonito no es un aviso, es publicidad.
 */

interface Seccion {
  titulo: string;
  cuerpo: string[];
}

const SECCIONES: Record<Locale, { updated: string; intro: string; secciones: Seccion[]; contacto: string }> = {
  es: {
    updated: "Última revisión: 11 de octubre de 2026",
    intro:
      "El campus secure T funciona sin cuentas, sin correo electrónico y sin seguimiento. Tu progreso, tus repasos y tus credenciales viven en tu dispositivo y sólo salen de él si tú los exportas. Esta página explica exactamente qué se guarda, dónde y por qué, incluido lo que ocurre fuera de tu navegador.",
    secciones: [
      {
        titulo: "1. Responsable y base jurídica",
        cuerpo: [
          "Responsable: el proyecto abierto secure T (github.com/belentani7/secure-t), mantenido por Pedro Belentani como autor original.",
          "Al no tratar datos personales, la mayor parte de este servicio queda fuera del ámbito de aplicación del RGPD (art. 2.2.a en relación con el art. 4.1). Cuando tú decides activar la voz o exportar tu expediente, el tratamiento ocurre en tu dispositivo y bajo tu control: base jurídica, tu propio consentimiento (art. 6.1.a)."
        ]
      },
      {
        titulo: "2. Qué se guarda en tu dispositivo",
        cuerpo: [
          "Progreso del campus: qué semanas has marcado, resultado del cuestionario, laboratorio, proyecto y examen, junto a un identificador aleatorio anónimo (crypto.randomUUID).",
          "Mazo de repaso espaciado (SM-2): qué tarjetas te tocan y con qué facilidad las recuerdas.",
          "Registro xAPI local: tus acciones en el vocabulario estándar, sin enviarlas a ningún servidor.",
          "Clave de firma de credenciales: un par RSA generado en tu navegador para firmar tus propias insignias. Nunca se transmite."
        ]
      },
      {
        titulo: "3. Qué NO se guarda ni se envía",
        cuerpo: [
          "No hay cuentas, ni correo, ni nombre, ni teléfono, ni identificadores de publicidad.",
          "No hay cookies de terceros, ni analítica, ni píxeles de seguimiento, ni perfilado. Puedes comprobarlo en el código: no hay ninguna dependencia de analítica en DEPENDENCIAS.md.",
          "El agente de IA funciona en tu navegador. Si un despliegue activa un proveedor externo, se avisa en la interfaz y en CONTRATO_API.md, y sólo se permite contra hosts declarados (allowlist)."
        ]
      },
      {
        titulo: "4. Lo que ocurre fuera de tu navegador",
        cuerpo: [
          "Al visitar el sitio, el proveedor de alojamiento (GitHub Pages) registra la dirección IP y el agente de usuario en sus registros, como cualquier servidor web. Eso es ajeno al proyecto y no tenemos acceso a esos registros.",
          "Los enlaces a GitHub y a fuentes oficiales (NIST, CISA, BOE) te llevan a servicios de terceros con sus propias políticas.",
          "Si despliegas el campus en tu propio servidor con el proveedor de LLM opcional, la pregunta viajaría a ese proveedor: la responsabilidad y la configuración son tuyas."
        ]
      },
      {
        titulo: "5. Tus derechos",
        cuerpo: [
          "Acceso, rectificación, supresión, portabilidad, limitación y oposición: todos se ejercen **directamente y sin pedir permiso a nadie**, porque los datos están en tu dispositivo.",
          "Exporta tu expediente firmado desde /progreso, impórtalo donde quieras y bórralo con el botón de reinicio o limpiando los datos del sitio en tu navegador.",
          "Si algo no cuadra, escribe a security@secure-t.dev y se corrige en el repositorio."
        ]
      },
      {
        titulo: "6. Menores y contexto educativo",
        cuerpo: [
          "El campus está pensado para personas adultas y para estudiantes de formación superior. No hay registro, así que no se trata ningún dato de menores.",
          "Los laboratorios de seguridad ofensiva se realizan sobre máquinas propias o entornos aislados y con autorización expresa: la ética y el permiso son parte de la evaluación."
        ]
      },
      {
        titulo: "7. Seguridad",
        cuerpo: [
          "Cifrado en tránsito por HTTPS, sin secretos en el cliente, sin claves de API en el repositorio (gitleaks lo comprueba en cada cambio).",
          "Cabeceras de seguridad y política de contenido en el despliegue con servidor; en el sitio estático, donde el alojamiento no permite cabeceras, se aplica la política mediante metadatos y se documenta la limitación.",
          "Vulnerabilidades: informa según .well-known/security.txt (RFC 9116)."
        ]
      },
      {
        titulo: "8. Cambios",
        cuerpo: [
          "Cualquier cambio de este aviso se registra en CHANGELOG.md y en los ADR. Si algún día se añadiera algo que trate datos personales, tendría que pasar por un ADR, por este aviso y por el consentimiento explícito — y no por la puerta de atrás."
        ]
      }
    ],
    contacto: "Contacto: security@secure-t.dev · Repositorio: github.com/belentani7/secure-t"
  },
  pt: {
    updated: "Última revisão: 11 de outubro de 2026",
    intro:
      "O campus secure T funciona sem contas, sem e-mail e sem rastreamento. O seu progresso, as suas revisões e as suas credenciais ficam no seu dispositivo e só saem dele se você os exportar. Esta página explica exatamente o que é salvo, onde e por quê, incluindo o que acontece fora do seu navegador.",
    secciones: [
      {
        titulo: "1. Responsável e base jurídica",
        cuerpo: [
          "Responsável: o projeto aberto secure T (github.com/belentani7/secure-t), mantido por Pedro Belentani como autor original.",
          "Como não tratamos dados pessoais, a maior parte deste serviço fica fora do escopo da LGPD brasileira e do RGPD europeu. Quando você decide ativar a voz ou exportar o seu histórico, o tratamento acontece no seu dispositivo e sob o seu controle: base jurídica, o seu próprio consentimento (art. 6.1.a do RGPD)."
        ]
      },
      {
        titulo: "2. O que é salvo no seu dispositivo",
        cuerpo: [
          "Progresso: semanas marcadas, resultado do questionário, laboratório, projeto e exame, com um identificador aleatório anônimo (crypto.randomUUID).",
          "Baralho de revisão espaçada (SM-2): quais cartões estão pendentes e com que facilidade você se lembra deles.",
          "Registro xAPI local: as suas ações no vocabulário padrão, sem enviá-las a nenhum servidor.",
          "Chave de assinatura de credenciais: um par RSA gerado no seu navegador para assinar as suas próprias credenciais. Nunca é transmitida."
        ]
      },
      {
        titulo: "3. O que NÃO é salvo nem enviado",
        cuerpo: [
          "Não há contas, e-mail, nome, telefone nem identificadores de publicidade.",
          "Não há cookies de terceiros, analytics, pixels de rastreamento nem perfilamento. Você pode conferir no código: não existe nenhuma dependência de analytics em DEPENDENCIAS.md.",
          "O agente de IA funciona no seu navegador. Se alguma implantação ativar um provedor externo, isso é avisado na interface e em CONTRATO_API.md, e só é permitido contra hosts declarados."
        ]
      },
      {
        titulo: "4. O que acontece fora do seu navegador",
        cuerpo: [
          "Ao visitar o site, o provedor de hospedagem (GitHub Pages) registra o endereço IP e o user agent nos seus logs, como qualquer servidor web. Isso é alheio ao projeto e não temos acesso a esses registros.",
          "Os links para o GitHub e para fontes oficiais (NIST, CISA) levam você a serviços de terceiros com políticas próprias.",
          "Se você instalar o campus no seu próprio servidor com o provedor de LLM opcional, a pergunta viajaria para esse fornecedor: a responsabilidade é sua."
        ]
      },
      {
        titulo: "5. Os seus direitos",
        cuerpo: [
          "Acesso, retificação, exclusão, portabilidade, limitação e oposição: todos se exercem diretamente e sem pedir permissão a ninguém, porque os dados estão no seu dispositivo.",
          "Exporte o seu histórico assinado em /progreso, importe-o onde quiser e apague-o com o botão de reinício ou limpando os dados do site.",
          "Se algo não estiver certo, escreva para security@secure-t.dev e corrigimos no repositório."
        ]
      },
      {
        titulo: "6. Menores e contexto educativo",
        cuerpo: [
          "O campus destina-se a pessoas adultas e a estudantes do ensino superior. Como não há cadastro, não se trata nenhum dado de menores.",
          "Os laboratórios de segurança ofensiva são feitos em máquinas próprias ou ambientes isolados e com autorização expressa: a ética e a permissão fazem parte da avaliação."
        ]
      },
      {
        titulo: "7. Segurança",
        cuerpo: [
          "Criptografia em trânsito por HTTPS, sem segredos no cliente, sem chaves de API no repositório (o gitleaks verifica em cada alteração).",
          "Cabeçalhos de segurança e política de conteúdo na implantação com servidor; no site estático, onde a hospedagem não permite cabeçalhos, a política é aplicada por metadados e a limitação fica documentada.",
          "Vulnerabilidades: informe conforme o .well-known/security.txt (RFC 9116)."
        ]
      },
      {
        titulo: "8. Alterações",
        cuerpo: [
          "Qualquer alteração neste aviso é registrada em CHANGELOG.md e nos ADR. Se algum dia se acrescentasse algo que trate dados pessoais, teria de passar por um ADR, por este aviso e pelo consentimento explícito — e nunca pela porta dos fundos."
        ]
      }
    ],
    contacto: "Contato: security@secure-t.dev · Repositório: github.com/belentani7/secure-t"
  },
  en: {
    updated: "Last reviewed: 11 October 2026",
    intro:
      "The secure T campus runs without accounts, without email and without tracking. Your progress, your reviews and your credentials live on your device and only leave it if you export them. This page explains exactly what is stored, where and why, including what happens outside your browser.",
    secciones: [
      {
        titulo: "1. Controller and legal basis",
        cuerpo: [
          "Controller: the open secure T project (github.com/belentani7/secure-t), maintained by Pedro Belentani as the original author.",
          "Because we do not process personal data, most of this service falls outside the GDPR. When you choose to enable speech or export your record, processing happens on your device under your control: legal basis, your own consent (Art. 6(1)(a))."
        ]
      },
      {
        titulo: "2. What is stored on your device",
        cuerpo: [
          "Course progress: weeks marked, quiz result, lab, project and exam, together with an anonymous random identifier (crypto.randomUUID).",
          "Spaced-review deck (SM-2): which cards are due and how easily you recall them.",
          "Local xAPI log: your actions in the standard vocabulary, never sent to any server.",
          "Credential signing key: an RSA key pair generated in your browser to sign your own badges. It is never transmitted."
        ]
      },
      {
        titulo: "3. What is never stored or sent",
        cuerpo: [
          "No accounts, no email, no name, no phone, no advertising identifiers.",
          "No third-party cookies, no analytics, no tracking pixels, no profiling. You can check it in the code: there is no analytics dependency in DEPENDENCIAS.md.",
          "The AI agent runs in your browser. If a deployment enables an external provider, the interface and CONTRATO_API.md say so, and only allowlisted hosts are permitted."
        ]
      },
      {
        titulo: "4. What happens outside your browser",
        cuerpo: [
          "When you visit the site, the hosting provider (GitHub Pages) records the IP address and user agent in its logs, like any web server. That is outside the project and we have no access to those logs.",
          "Links to GitHub and to official sources (NIST, CISA) take you to third-party services with their own policies.",
          "If you self-host the campus with the optional LLM provider, your question would travel to that provider: that configuration is yours."
        ]
      },
      {
        titulo: "5. Your rights",
        cuerpo: [
          "Access, rectification, erasure, portability, restriction and objection: all exercised directly, without asking anyone, because the data is on your device.",
          "Export your signed record from /progreso, import it wherever you like, and delete it with the reset button or by clearing site data.",
          "If something does not add up, write to security@secure-t.dev and it gets fixed in the repository."
        ]
      },
      {
        titulo: "6. Minors and educational context",
        cuerpo: [
          "The campus is designed for adults and for higher-education students. With no registration, no minors' data is processed.",
          "Offensive security labs are performed on your own machines or isolated environments with explicit authorisation: ethics and permission are part of the assessment."
        ]
      },
      {
        titulo: "7. Security",
        cuerpo: [
          "HTTPS in transit, no client-side secrets, no API keys in the repository (gitleaks checks every change).",
          "Security headers and content policy in server deployments; on the static site, where hosting does not allow headers, the policy is applied through metadata and the limitation is documented.",
          "Vulnerabilities: report per .well-known/security.txt (RFC 9116)."
        ]
      },
      {
        titulo: "8. Changes",
        cuerpo: [
          "Any change to this notice is recorded in CHANGELOG.md and in the ADRs. If personal data processing were ever added, it would have to go through an ADR, this notice and explicit consent — never through the back door."
        ]
      }
    ],
    contacto: "Contact: security@secure-t.dev · Repository: github.com/belentani7/secure-t"
  },
  ca: {
    updated: "Última revisió: 11 d'octubre de 2026",
    intro:
      "El campus secure T funciona sense comptes, sense correu i sense seguiment. El teu progrés, els teus repassos i les teves credencials viuen al teu dispositiu i només en surten si els exportes. Aquesta pàgina explica exactament què es guarda, on i per què, incloent-hi què passa fora del teu navegador.",
    secciones: [
      {
        titulo: "1. Responsable i base jurídica",
        cuerpo: [
          "Responsable: el projecte obert secure T (github.com/belentani7/secure-t), mantingut per Pedro Belentani com a autor original.",
          "Com que no tractem dades personals, la major part d'aquest servei queda fora de l'àmbit del RGPD. Quan decideixes activar la veu o exportar el teu expedient, el tractament passa al teu dispositiu i sota el teu control: base jurídica, el teu propi consentiment (art. 6.1.a)."
        ]
      },
      {
        titulo: "2. Què es guarda al teu dispositiu",
        cuerpo: [
          "Progrés: setmanes marcades, resultat del qüestionari, laboratori, projecte i examen, amb un identificador aleatori anònim (crypto.randomUUID).",
          "Baralla de repàs espaiat (SM-2): quines targetes et toquen i amb quina facilitat les recordes.",
          "Registre xAPI local: les teves accions en el vocabulari estàndard, sense enviar-les a cap servidor.",
          "Clau de signatura de credencials: una parella RSA generada al teu navegador per signar les teves insígnies. No es transmet mai."
        ]
      },
      {
        titulo: "3. Què NO es guarda ni s'envia",
        cuerpo: [
          "No hi ha comptes, correu, nom, telèfon ni identificadors de publicitat.",
          "No hi ha galetes de tercers, analítica, píxels de seguiment ni perfilatge. Ho pots comprovar al codi: no hi ha cap dependència d'analítica a DEPENDENCIAS.md.",
          "L'agent d'IA funciona al teu navegador. Si un desplegament activa un proveïdor extern, s'avisa a la interfície i a CONTRATO_API.md, i només es permet contra hosts declarats."
        ]
      },
      {
        titulo: "4. Què passa fora del teu navegador",
        cuerpo: [
          "En visitar el lloc, el proveïdor d'allotjament (GitHub Pages) enregistra l'adreça IP i l'agent d'usuari als seus registres, com qualsevol servidor web. Això és aliè al projecte i no hi tenim accés.",
          "Els enllaços a GitHub i a fonts oficials (NIST, CISA) et porten a serveis de tercers amb les seves pròpies polítiques.",
          "Si instal·les el campus al teu servidor amb el proveïdor d'LLM opcional, la pregunta viatjaria a aquell proveïdor: la responsabilitat és teva."
        ]
      },
      {
        titulo: "5. Els teus drets",
        cuerpo: [
          "Accés, rectificació, supressió, portabilitat, limitació i oposició: tots s'exerceixen directament i sense demanar permís a ningú, perquè les dades són al teu dispositiu.",
          "Exporta el teu expedient signat des de /progreso, importa'l on vulguis i esborra'l amb el botó de reinici o netejant les dades del lloc.",
          "Si alguna cosa no quadra, escriu a security@secure-t.dev i es corregeix al repositori."
        ]
      },
      {
        titulo: "6. Menors i context educatiu",
        cuerpo: [
          "El campus està pensat per a persones adultes i per a estudiants d'educació superior. Sense registre, no es tracta cap dada de menors.",
          "Els laboratoris de seguretat ofensiva es fan en màquines pròpies o entorns aïllats i amb autorització expressa: l'ètica i el permís formen part de l'avaluació."
        ]
      },
      {
        titulo: "7. Seguretat",
        cuerpo: [
          "Xifratge en trànsit per HTTPS, sense secrets al client, sense claus d'API al repositori (gitleaks ho comprova a cada canvi).",
          "Capçaleres de seguretat i política de contingut al desplegament amb servidor; al lloc estàtic, on l'allotjament no permet capçaleres, la política s'aplica per metadades i es documenta la limitació.",
          "Vulnerabilitats: informa segons .well-known/security.txt (RFC 9116)."
        ]
      },
      {
        titulo: "8. Canvis",
        cuerpo: [
          "Qualsevol canvi d'aquest avís es registra a CHANGELOG.md i als ADR. Si algun dia s'afegís alguna cosa que tracti dades personals, hauria de passar per un ADR, per aquest avís i pel consentiment explícit — mai per la porta del darrere."
        ]
      }
    ],
    contacto: "Contacte: security@secure-t.dev · Repositori: github.com/belentani7/secure-t"
  }
};

export function PrivacyView({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const contenido = SECCIONES[locale];

  return (
    <div className="wrap section">
      <p className="eyebrow">{t("nav.privacy")}</p>
      <h1>{t("privacy.title")}</h1>
      <p className="lead">{contenido.intro}</p>
      <p className="mono text-[0.75rem] text-[var(--aurum-muted)]">{contenido.updated}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {contenido.secciones.map((seccion) => (
          <section key={seccion.titulo} className="card" aria-labelledby={slug(seccion.titulo)}>
            <h2 id={slug(seccion.titulo)} className="card-title">
              {seccion.titulo}
            </h2>
            {seccion.cuerpo.map((parrafo) => (
              <p key={parrafo} className="muted m-0 mb-2 text-[0.95rem]">
                {parrafo}
              </p>
            ))}
          </section>
        ))}
      </div>

      <div className="maintenance-note mt-8">
        <p className="m-0">{contenido.contacto}</p>
        <p className="mono m-0 mt-2 text-[0.75rem] text-[var(--aurum-muted)]">
          <a href={`${SITE.basePath}/.well-known/security.txt`}>.well-known/security.txt</a> · RFC 9116 ·{" "}
          <a href={`${SITE.basePath}/app/es/repaso`}>{t("nav.review")}</a>
        </p>
      </div>
    </div>
  );
}

function slug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
