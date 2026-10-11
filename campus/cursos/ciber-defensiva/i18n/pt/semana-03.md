# Semana 3: Resposta a incidentes (NIST 800-61)

Curso: [Cibersegurança Defensiva: Operar como SOC](../syllabus.md) · Semana 3 de 20

## Objetivos de aprendizagem

- Executar as 6 fases do ciclo de resposta a incidentes do NIST 800-61
- Desenvolver playbooks para ransomware, phishing e conta comprometida
- Classificar indicadores de compromisso (IoC) por tipo e fonte
- Documentar um incidente com cronologia e lições aprendidas

## NIST 800-61: o ciclo completo de resposta

O NIST SP 800-61 Rev.3 define 6 fases. Cada fase tem entregáveis concretos — um incidente não está encerrado enquanto as lições aprendidas não forem documentadas.

**1. Preparação:**
- Equipe de resposta (CSIRT) com papéis e contatos
- Kit de ferramentas: imagem forense, logs centralizados, canal seguro
- Playbooks escritos e ensaiados para os 3-5 cenários mais prováveis
- Contatos jurídicos, comunicação, seguros cibernéticos

**2. Detecção e análise:**
- Fontes: alertas de SIEM, relatos de usuários, feeds de inteligência
- Triagem: é um incidente real? Classificar a severidade (P1-P4)
- IoC (Indicators of Compromise): IPs, hashes, domínios, e-mails, TTPs

**3. Contenção:**
- **Curto prazo:** isolar a máquina (desconectar da rede, NÃO desligar)
- **Longo prazo:** corrigir a vulnerabilidade explorada, revogar credenciais
- Decisão crítica: conter imediatamente ou monitorar para entender o alcance?

**4. Erradicação:**
- Eliminar o malware, fechar backdoors, remover contas criadas pelo atacante
- Verificar que a causa raiz foi eliminada, não apenas os sintomas

**5. Recuperação:**
- Restaurar de um backup limpo, verificar a integridade
- Monitoramento intensivo pós-recuperação (o atacante pode voltar)
- Retorno gradual à produção com validação

**6. Lições aprendidas (Post-Incident Activity):**
- Reunião pós-incidente (sem culpados): o que aconteceu, cronologia, o que funcionou, o que não
- Atualizar playbooks, regras de detecção, controles
- Relatório formal com recomendações e responsáveis por cada ação

**Referências:**
- NIST SP 800-61 Rev.3 — Incident Handling Guide
- MITRE ATT&CK — TA0040 Impact
- SANS Incident Handler's Handbook

## Playbooks: resposta guiada por cenário

Um playbook é a receita passo a passo para um tipo de incidente. Sem playbook, cada incidente é improvisado — e a improvisação sob pressão produz erros.

**Playbook: Ransomware**

```
DETECÇÃO:  Alerta de cifragem massiva / extensões alteradas / nota de resgate
TRIAGEM:   Quantos sistemas afetados? Está se propagando ativamente?
CONTENÇÃO:
  1. Isolar as máquinas afetadas da rede (cabo, não desligar o Wi-Fi)
  2. NÃO desligar — a RAM pode conter chaves de decifragem
  3. Bloquear o hash do ransomware no EDR/antivírus
  4. Desabilitar as contas comprometidas no AD
ERRADICAÇÃO:
  1. Identificar o vetor de entrada (phishing? RDP exposto? VPN?)
  2. Corrigir/fechar o vetor
  3. Verificar que não há persistência (tarefas agendadas, serviços)
RECUPERAÇÃO:
  1. Restaurar do backup (verificar que o backup não está cifrado)
  2. Validar a integridade dos dados restaurados
DECISÃO DE PAGAMENTO: NÃO se recomenda pagar — não garante a decifragem,
  financia o atacante e pode se repetir. ATT&CK: T1486 (Data Encrypted)
```

**Playbook: Phishing com credenciais roubadas**

```
DETECÇÃO: Usuário relata e-mail suspeito / alerta de login incomum
CONTENÇÃO:
  1. Redefinir a senha da conta afetada IMEDIATAMENTE
  2. Revogar sessões ativas (incluindo tokens OAuth)
  3. Verificar regras de encaminhamento de e-mail (T1114.003)
  4. Bloquear o domínio/URL de phishing no proxy/DNS
ANÁLISE:
  1. Quantos usuários receberam o e-mail?
  2. Quantos clicaram? (logs do proxy)
  3. Quantos digitaram as credenciais?
ERRADICAÇÃO: Purgar o e-mail de todas as caixas
LIÇÕES: Simulação de phishing + formação direcionada
```

**Referências:**
- T1486 — Data Encrypted for Impact
- T1114.003 — Email Forwarding Rule
- T1566 — Phishing
- CISA Ransomware Guide

## Caso real: WannaCry 2017 — NHS sem playbook, sem backup, sem patch

O WannaCry (EternalBlue, MS17-010) cifrou 200.000 sistemas em 150 países. O NHS britânico cancelou 19.000 consultas médicas. Faltava: o patch disponível desde março (dois meses), playbook de ransomware e backups offline verificados. Um pesquisador (MalwareTech) encontrou o kill switch por acaso, registrando um domínio embutido no código. Lição: as três defesas que teriam evitado o impacto são as mais básicas — aplicar patch, ter backup testado, ter um playbook ensaiado.

## Exercício guiado: simulação de incidente — ransomware na ONG

1. Cenário: segunda-feira, 08:00, 3 de 10 PCs mostram nota de resgate na área de trabalho
2. Atribua papéis: analista (você), coordenador, comunicação
3. Fase 1 — Contenção: liste as 5 primeiras ações em ordem de prioridade
4. Fase 2 — Análise: por onde entrou? Liste 3 hipóteses e como verificá-las
5. Fase 3 — Erradicação: o que você faz se o backup de sexta-feira está cifrado?
6. Fase 4 — Recuperação: plano B de restauração sem backup recente
7. Fase 5 — Lições: escreva 5 melhorias concretas para que não se repita
8. Cronologia: construa a linha do tempo do incidente em uma tabela

## Recursos abertos

- [NIST 800-61 Rev.3](https://csrc.nist.gov/publications/detail/sp/800-61/rev-3/final)
- [CISA Ransomware Guide](https://www.cisa.gov/stopransomware)
- [SANS IR Handbook](https://www.sans.org/white-papers/33901/)

---
[Voltar ao programa](../syllabus.md)
