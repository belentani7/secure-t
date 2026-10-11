# Semana 5: Detecção e monitoramento

Curso: [Cibersegurança Defensiva: Operar como SOC](../syllabus.md) · Semana 5 de 20

## 🎯 Objetivo da semana

Passar de acumular registros a detectar o que importa, com regras testadas e não com listas de desejos.

- Distinguir registro, monitoramento e detecção: três coisas diferentes
- Montar um laboratório de detecção com regras próprias e dados reais
- Escrever uma regra de detecção com o seu caso de teste e a sua taxa de falsos positivos

## 📖 Leitura principal

### A cadeia da detecção

**Registrar** é guardar fatos; **monitorar** é vigiá-los; **detectar** é decidir que um fato importa. Sem a primeira, as outras duas são impossíveis: ninguém detecta o que não é registrado. O erro clássico é comprar uma ferramenta de detecção antes de ter fontes de dados organizadas.

O desenho mínimo de um laboratório de detecção: caso de uso a cobrir, fonte de dados, regra e **teste**. O teste é a parte que quase sempre falta e a que dá valor: se você não consegue provocar o evento à vontade, não pode saber se a sua regra funciona.

```bash
# Fonte barata e realista: processos e conexões da própria máquina
ps aux --sort=-%cpu | head -20
ss -tunap | head -30
# Com Auditd ou Sysmon (Windows) registra-se o que de fato importa
sudo auditctl -a always,exit -F arch=b64 -S execve -F key=processos
```

**Referências:**
- MITRE ATT&CK — Data Sources
- Sigma — github.com/SigmaHQ/sigma
- NIST SP 800-92 — Guide to Computer Security Log Management

### Da alerta à decisão

Uma alerta só é útil se alguém souber o que fazer com ela. Cada regra deveria trazer escrito: **o que significa**, **que decisão dispara** (escalar, investigar, fechar) e **o que a torna inútil** (falsos positivos conhecidos). Começar por duas ou três regras bem testadas rende mais do que duzentas importadas sem revisão.

## 🛠️ Prática guiada: a sua primeira regra de detecção

1. Escolha um caso de uso: por exemplo, um processo que abre conexões de saída estranhas
2. Registre a evidência com Auditd ou Sysmon durante uma hora de trabalho normal
3. Desenhe a regra: quais campos, qual limiar, qual janela de tempo
4. Escreva o seu teste: como você provocará o evento de forma controlada
5. Execute o teste, meça acertos e falsos positivos
6. Documente a regra como uma ficha: nome, fonte, lógica, resposta, limites

## Recursos abertos

- [Sigma](https://github.com/SigmaHQ/sigma)
- [ATT&CK Data Sources](https://attack.mitre.org/datasources/)
- [NIST SP 800-92](https://csrc.nist.gov/pubs/sp/800/92/final)

---
[Voltar ao programa](../syllabus.md)
