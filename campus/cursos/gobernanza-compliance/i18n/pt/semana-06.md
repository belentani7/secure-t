# Semana 6: Análise de impacto no negócio e BCP

Curso: [Governança e Conformidade Digital](../syllabus.md) · Semana 6 de 20

## Objetivos de aprendizagem

- Distinguir BIA, plano de continuidade (BCP) e plano de recuperação (DRP)
- Fixar RTO e RPO com o negócio, não com a infraestrutura
- Testar o plano: um plano sem simulação é uma hipótese

## Três documentos, três perguntas

| Documento | Pergunta | Decide |
|---|---|---|
| BIA | O que cai se isto parar, e quanto dói por hora | Criticidade e prioridades |
| BCP | Como seguimos operando enquanto falta | Modos alternativos |
| DRP | Como voltamos à normalidade | Recuperação técnica |

**RTO** (quanto tempo se pode ficar fora do ar) e **RPO** (quanto dado se pode perder) são fixados pelo **negócio**, não pela equipe técnica: são decisões de dinheiro e de tolerância. Um RTO de 15 minutos com um sistema sem redundância é uma promessa que a próxima queda quebrará.

O teste é o que separa o plano do papel: simulações com hora marcada, critério de sucesso escrito e ata. Sem simulação, os números do plano são opinião.

**Referências:**
- ISO 22301 — Business continuity management systems
- NIST SP 800-34 Rev.1 — Contingency Planning Guide

## Caso real: a recuperação que demorou mais que a cifragem

Nos incidentes de ransomware dos últimos anos, as organizações com cópias **não testadas** descobriram duas coisas: que as suas cópias estavam dentro do mesmo domínio de ataque (cifradas junto com o resto) e que restaurar demorava dias por dependências esquecidas. As que sobreviveram melhor tinham cópias imutáveis e fora de linha, e haviam cronometrado a restauração completa ao menos uma vez. Lição: a cópia que você não restaurou não é uma cópia; é uma esperança.

## Exercício guiado: BIA e simulação para um serviço real

1. Escolha um serviço (por exemplo, uma loja virtual ou o e-mail corporativo)
2. Escreva o BIA: processo, dependências e custo por hora de indisponibilidade
3. Fixe RTO e RPO com duas pessoas do negócio e justifique o número
4. Desenhe o BCP: modo alternativo mínimo para as primeiras 72 horas
5. Desenhe o DRP: passos de restauração e verificação
6. Faça uma simulação de uma hora medindo tempos reais
7. Compare o medido com o prometido e corrija o plano onde não fechar

## Recursos abertos

- [ISO 22301](https://www.iso.org/standard/75106.html)
- [NIST SP 800-34 Rev.1](https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final)
- [Ready.gov — Business Continuity](https://www.ready.gov/business-continuity-plan)

---
[Voltar ao programa](../syllabus.md)
