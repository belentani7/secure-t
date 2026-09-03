/**
 * Welcome tutor messages.
 * Personalized on-entry greetings for learners.
 * Designed to create connection without pretense.
 */

export const welcomeMessages = {
  es: {
    firstTime: `Bienvenido a secure T.

Somos una comunidad de gente que aprende ciberseguridad e IA porque cree que el conocimiento merece ser compartido sin pretensiones.

No prometemos títulos falsos. Sí prometemos:
- Rigor en lo que enseñamos
- Honestidad en lo que no sabemos
- Seguridad en cada línea de código
- Comunidad que se cuida

El nombre "secure T" viene de un principio: **la seguridad es un acto de amor**. Proteges lo que importa. Aprendes para proteger mejor.

Si estás aquí es porque alguien vio en ti el potencial. O porque viste algo que te resonó.

Empecemos.

---
*"Quien enseña, sigue aprendiendo. Quien aprende, pronto enseña."*`,

    returning: `Bienvenido de vuelta.

Vemos que has avanzado en tu camino. Cada evidencia que dejas, cada laboratorio que completas, cada pregunta que haces—eso es aprendizaje real.

¿En qué podemos ayudarte hoy?`,

    special: `No sé quién te compartió este link. Pero sí sé que quien lo hizo cree en ti.

secure T existe porque creyeron en nosotros. Y ahora nosotros creemos en ti.

Adelante.`,
  },

  pt: {
    firstTime: `Bem-vindo ao secure T.

Somos uma comunidade de pessoas que aprendem cibersegurança e IA porque acredita que o conhecimento deve ser compartilhado sem pretensões.

Não prometemos diplomas falsos. Prometemos:
- Rigor no que ensinamos
- Honestidade no que não sabemos
- Segurança em cada linha de código
- Comunidade que se cuida

O nome "secure T" vem de um princípio: **a segurança é um ato de amor**. Você protege o que importa. Aprende para proteger melhor.

Se está aqui é porque alguém viu em você o potencial. Ou porque viu algo que ressoou.

Começamos.

---
*"Quem ensina, continua aprendendo. Quem aprende, logo ensina."*`,

    returning: `Bem-vindo de volta.

Vemos que você avançou em seu caminho. Cada evidência que deixa, cada laboratório que completa, cada pergunta que faz—isso é aprendizado real.

Como podemos ajudá-lo hoje?`,

    special: `Não sei quem compartilhou este link com você. Mas sei que quem fez isso acredita em você.

secure T existe porque acreditaram em nós. E agora nós acreditamos em você.

Adiante.`,
  },

  en: {
    firstTime: `Welcome to secure T.

We're a community of people learning cybersecurity and AI because we believe knowledge deserves to be shared without pretense.

We don't promise fake degrees. We do promise:
- Rigor in what we teach
- Honesty in what we don't know
- Security in every line of code
- A community that cares

The name "secure T" comes from a principle: **security is an act of love**. You protect what matters. You learn to protect better.

If you're here, it's because someone saw potential in you. Or because you saw something that resonated.

Let's begin.

---
*"Those who teach keep learning. Those who learn soon teach."*`,

    returning: `Welcome back.

We see you've made progress on your journey. Every piece of evidence you submit, every lab you complete, every question you ask—that's real learning.

What can we help you with today?`,

    special: `I don't know who shared this link with you. But I know they believe in you.

secure T exists because people believed in us. And now we believe in you.

Forward.`,
  },
};

export async function getWelcomeMessage(
  locale: "es" | "pt" | "en",
  isFirstTime: boolean,
  isSpecial?: boolean
): Promise<string> {
  if (isSpecial) {
    return welcomeMessages[locale].special;
  }
  return isFirstTime
    ? welcomeMessages[locale].firstTime
    : welcomeMessages[locale].returning;
}
