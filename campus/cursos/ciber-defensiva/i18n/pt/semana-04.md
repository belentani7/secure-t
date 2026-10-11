# Semana 4: Hardening e continuidade

Curso: [Cibersegurança Defensiva: Operar como SOC](../syllabus.md) · Semana 4 de 20

## Objetivos de aprendizagem

- Aplicar os CIS Benchmarks nível 1 para endurecer um servidor Linux
- Verificar o hardening com checklist de evidência antes/depois
- Implementar a estratégia de backup 3-2-1 com teste de restauração
- Desenhar um plano básico de continuidade de negócio

## Hardening: reduzir a superfície de ataque

Hardening é eliminar tudo que o sistema não precisa para cumprir a sua função. Cada serviço, porta ou conta desnecessária é uma porta que um atacante pode tentar abrir.

**CIS Benchmarks — Level 1 (aplicável a qualquer servidor Linux):**

```bash
# 1. Atualizar tudo
sudo apt update && sudo apt upgrade -y

# 2. Remover serviços desnecessários
sudo systemctl list-unit-files --state=enabled
sudo systemctl disable --now cups avahi-daemon  # exemplo

# 3. Configurar firewall (UFW)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw enable

# 4. Hardening do SSH (/etc/ssh/sshd_config)
PermitRootLogin no
PasswordAuthentication no        # somente chaves
MaxAuthTries 3
AllowUsers seu_usuario

# 5. Permissões de arquivos críticos
sudo chmod 600 /etc/shadow /etc/gshadow
sudo chmod 644 /etc/passwd /etc/group

# 6. Auditoria: configurar auditd
sudo apt install auditd
sudo auditctl -w /etc/passwd -p wa -k identity
```

**Verificação com evidência:** cada mudança é documentada com captura ANTES e DEPOIS:

```
CONTROLE:    login root por SSH desabilitado
ANTES:       PermitRootLogin yes (captura)
DEPOIS:      PermitRootLogin no  (captura)
VERIFICADO:  ssh root@servidor → 'Permission denied' (captura)
CIS REF:     5.2.10
```

**Referências:**
- CIS Benchmarks — cisecurity.org/cis-benchmarks
- NIST SP 800-123 — Server Security Guide
- T1078 — Valid Accounts (hardening contra o uso de contas legítimas)

## Backup 3-2-1 e continuidade de negócio

**Regra 3-2-1:**
- **3** cópias de cada dado (original + 2 cópias)
- **2** mídias diferentes (disco local + nuvem, ou disco + fita)
- **1** cópia fora do local (offsite ou nuvem em outra região)

**Extensão 3-2-1-1-0:**
- **1** cópia offline/imutável (não acessível a partir da rede)
- **0** erros verificados na restauração

**O teste de restauração é obrigatório:**

```bash
# Backup com restic (open source, com cifra e deduplicação)
restic -r /backup init
restic -r /backup backup /dados
# Verificação periódica:
restic -r /backup check
# Teste de restauração (em diretório temporário):
restic -r /backup restore latest --target /tmp/teste-restauracao
diff -r /dados /tmp/teste-restauracao/dados
```

Um backup que nunca foi testado na restauração não é um backup — é uma esperança.

**Plano de continuidade de negócio (BCP) mínimo:**
1. **RTO (Recovery Time Objective):** quanto tempo sem serviço é aceitável?
2. **RPO (Recovery Point Objective):** quantos dados você pode perder? (se RPO = 1 h, backup a cada hora)
3. **Procedimento de failover:** para onde e como?
4. **Comunicação:** quem avisa quem?
5. **Teste periódico:** simulação trimestral no mínimo

**Referências:**
- NIST SP 800-34 — Contingency Planning
- Restic — restic.net
- ISO 22301 — Business Continuity

## Caso real: Maersk 2017 (NotPetya) — o backup que salvou a empresa

O NotPetya destruiu a infraestrutura inteira da Maersk: 49.000 endpoints, 4.000 servidores, o Active Directory completo. A reconstrução foi possível SOMENTE porque um controlador de domínio em Acra (Gana) estava desligado durante o ataque por causa de uma queda de energia. Sem essa cópia acidental, a Maersk levaria meses para reconstruir o seu AD. Custo: US$ 300 milhões. Lição: a regra 3-2-1-1-0 exige uma cópia offline/imutável exatamente para este cenário. A Maersk teve sorte; você precisa de projeto.

## Exercício guiado: auditoria de hardening CIS Level 1 em uma VM

1. Crie uma VM Ubuntu Server 22.04 nova (sem tocar em nada)
2. Documente o estado ANTES: serviços ativos, portas abertas, configuração do SSH
3. Aplique os 6 controles CIS do material (atualizar, serviços, UFW, SSH, permissões, auditd)
4. Documente DEPOIS com o mesmo formato
5. Verifique: tente `ssh root@vm` → deve falhar
6. Verifique: `nmap` na VM → somente as portas que você autorizou
7. Configure um backup com restic e teste a restauração
8. Calcule RTO e RPO para o seu laboratório (quanto tempo você levaria para restaurar tudo?)

## Recursos abertos

- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
- [Restic Backup](https://restic.net/)
- [NIST SP 800-34](https://csrc.nist.gov/publications/detail/sp/800-34/rev-1/final)

---
[Voltar ao programa](../syllabus.md)
