# Semana 8: Engenharia de privacidade (RGPD, LGPD)

Curso: [Governança e Compliance: Liderar com Evidência](../syllabus.md) · Semana 8 de 20

## Objetivos de aprendizagem

- Aplicar minimização e limitação de finalidade como decisões de arquitetura
- Distinguir bases legais e saber quando é necessária uma avaliação de impacto
- Projetar um sistema que não possa vazar o que nunca guardou

## Privacidade se projeta, não se promete

Os dois princípios que mais reduzem o risco legal e real são entediantes e poderosos: **minimização** (coletar apenas o necessário para uma finalidade declarada) e **limitação de finalidade** (não reutilizar os dados para outra coisa sem nova base). Um sistema que não guarda o dado não pode vazá-lo, não pode vendê-lo e não precisa protegê-lo.

**Bases legais** (art. 6 RGPD; art. 7 LGPD): consentimento, contrato, obrigação legal, interesse vital, interesse público, interesse legítimo. Escolher bem a base evita o erro típico de pedir consentimento para algo que na verdade se sustenta em contrato, com o ruído de gestão que isso gera.

**Avaliação de impacto (DPIA / RIPD)** é obrigatória quando há alto risco: perfilamento, dados sensíveis em larga escala, vigilância sistemática. Escreve-se **antes** de construir, não depois da multa. E dois direitos que definem a arquitetura: **acesso** (devolver ao titular quais dados você tem sobre ele) e **supressão** (apagá-los de verdade, incluindo backups e derivados).

**Referências:**
- RGPD (UE) 2016/679 — arts. 5, 6, 25, 35
- LGPD (Brasil) Lei 13.709/2018 — arts. 6, 7, 46, 48
- AEPD — Guia de análisis de riesgos y evaluación de impacto

## Caso real: a multa por transferência internacional (2023)

Em 2023, a autoridade irlandesa sancionou uma grande plataforma em 1,2 bilhão de euros por transferir dados pessoais a outro país sem garantias suficientes, além de ordenar regularizar o tratamento em meses. O detalhe didático: não foi um incidente de segurança, foi uma decisão de arquitetura de dados mantida durante anos. Lição: onde vivem e por onde viajam os dados é uma decisão de conformidade, e escolher mal tem preço de milhões e prazo obrigatório de correção.

## Exercício guiado: engenharia de privacidade de um formulário

1. Escolha um formulário ou serviço seu (por exemplo, inscrição em um curso)
2. Liste cada campo e responda: é necessário? para qual finalidade? qual é a base legal?
3. Elimine ou transforme o que for possível (pseudonimizar, agregar, guardar apenas um hash)
4. Escreva o aviso de privacidade em uma página, em linguagem clara
5. Comprove os direitos de acesso e supressão: percorra-os de ponta a ponta e anote onde falham
6. Fixe prazos de conservação e o processo de exclusão real (incluindo backups)
7. Decida se é necessária uma DPIA e, se for, escreva as suas seções 1-3

## Recursos abertos

- [RGPD (EUR-Lex)](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [LGPD (Planalto)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [AEPD](https://www.aepd.es/)
- [ANPD (Brasil)](https://www.gov.br/anpd/pt-br)

---
[Voltar ao programa](../syllabus.md)
