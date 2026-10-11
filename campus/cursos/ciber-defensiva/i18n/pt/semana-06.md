# Semana 6: Resposta a incidentes

Curso: [Cibersegurança Defensiva: Construir e Defender](../syllabus.md) · Semana 6 de 20

## Objetivos de aprendizagem

- Percorrer o ciclo NIST de resposta: preparar, detectar, conter, erradicar, recuperar, aprender
- Escrever um runbook que sirva às 3 da manhã
- Praticar com um exercício de mesa antes de precisar dele de verdade

## O ciclo, e as decisões que não se improvisam

| Fase | Pergunta que responde | Artefato |
|---|---|---|
| Preparar | Quem decide e com o quê | Plano, contatos, acessos de emergência |
| Detectar | O que aconteceu e desde quando | Alerta triada + linha do tempo |
| Conter | Como deixa de se espalhar | Isolamento de host ou credencial |
| Erradicar | Como sai do ambiente | Causa raiz eliminada, não só o sintoma |
| Recuperar | Como volta a operar | Restauração verificada |
| Aprender | O que muda amanhã | Ações com data e responsável |

**A contenção se decide antes do incidente, não durante.** O que será isolado (rede, credencial, serviço), quem pode autorizar e o que se aceita perder. O erro habitual: conter tão tarde que o atacante já está no backup.

**Referências:**
- NIST SP 800-61r2 — Computer Security Incident Handling Guide
- ATT&CK — Táticas e técnicas para mapear o observado

## Runbook: quatro linhas que salvam o turno da noite

1. **Sinal**: como se reconhece o incidente e quem avisa.
2. **Primeiras ações**: preservar evidência (memória, disco) e isolar sem destruir dados.
3. **Escalonamento**: quem se chama, com que relógio correndo.
4. **Critério de encerramento**: quando é considerado contido e quem assina.

## Exercício guiado: simulação de mesa

1. Situação: um notebook cifra arquivos do compartilhamento de rede (ransomware)
2. Escreva as três primeiras ações sem olhar o runbook
3. Compare com o ciclo NIST: que fase você pulou e a que custo
4. Redija o runbook dessa situação em uma página
5. Faça um exercício de mesa de 30 minutos com alguém fazendo o papel de «chefe de negócio»
6. Anote as perguntas que você não soube responder e transforme-as em pendências

## Recursos abertos

- [NIST SP 800-61r2](https://csrc.nist.gov/pubs/sp/800/61/r2/final)
- [CISA — Incident Response Playbooks](https://www.cisa.gov/resources-tools/resources/incident-and-vulnerability-response-playbooks)
- [SANS — Incident Handler's Handbook](https://www.sans.org/white-papers/33901/)

---
[Voltar ao programa](../syllabus.md)
