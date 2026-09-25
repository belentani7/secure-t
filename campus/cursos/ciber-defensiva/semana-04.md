# Semana 4: Hardening y continuidad

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 4 de 20

## Objetivos de aprendizaje

- Aplicar CIS Benchmarks nivel 1 para endurecer un servidor Linux
- Verificar hardening con checklist de evidencia antes/después
- Implementar estrategia de backup 3-2-1 con prueba de restauración
- Diseñar un plan básico de continuidad de negocio

## Hardening: reducir la superficie de ataque

Hardening es eliminar todo lo que el sistema no necesita para cumplir su función. Cada servicio, puerto o cuenta innecesaria es una puerta que un atacante puede intentar abrir.

**CIS Benchmarks — Level 1 (aplicable a cualquier servidor Linux):**
```bash
# 1. Actualizar todo
sudo apt update && sudo apt upgrade -y

# 2. Eliminar servicios innecesarios
sudo systemctl list-unit-files --state=enabled
sudo systemctl disable --now cups avahi-daemon  # ejemplo

# 3. Configurar firewall (UFW)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw enable

# 4. SSH hardening (/etc/ssh/sshd_config)
PermitRootLogin no
PasswordAuthentication no        # solo claves
MaxAuthTries 3
AllowUsers tu_usuario

# 5. Permisos de archivos críticos
sudo chmod 600 /etc/shadow /etc/gshadow
sudo chmod 644 /etc/passwd /etc/group

# 6. Auditoría: configurar auditd
sudo apt install auditd
sudo auditctl -w /etc/passwd -p wa -k identity
```

**Verificación con evidencia:**
Cada cambio se documenta con captura ANTES y DESPUÉS:
```
CONTROL:    SSH root login deshabilitado
ANTES:      PermitRootLogin yes (captura)
DESPUÉS:    PermitRootLogin no  (captura)
VERIFICADO: ssh root@servidor → 'Permission denied' (captura)
CIS REF:    5.2.10
```

**Referencias:**
- CIS Benchmarks — cisecurity.org/cis-benchmarks
- NIST SP 800-123 — Server Security Guide
- T1078 — Valid Accounts (hardening contra uso de cuentas legítimas)

## Backup 3-2-1 y continuidad de negocio

**Regla 3-2-1:**
- **3** copias de cada dato (original + 2 copias)
- **2** medios diferentes (disco local + cloud, o disco + cinta)
- **1** copia fuera del sitio (offsite o cloud en otra región)

**Extensión 3-2-1-1-0:**
- **1** copia offline/inmutable (no accesible desde la red)
- **0** errores verificados en la restauración

**El test de restauración es obligatorio:**
```bash
# Backup con restic (open source, cifrado, deduplicación)
restic -r /backup init
restic -r /backup backup /datos
# Verificación periódica:
restic -r /backup check
# Test de restauración (en directorio temporal):
restic -r /backup restore latest --target /tmp/test-restore
diff -r /datos /tmp/test-restore/datos
```
Un backup que nunca se ha probado restaurar no es un backup — es una esperanza.

**Plan de continuidad de negocio (BCP) mínimo:**
1. **RTO (Recovery Time Objective):** ¿cuánto tiempo sin servicio es aceptable?
2. **RPO (Recovery Point Objective):** ¿cuántos datos puedes perder? (si RPO=1h, backup cada hora)
3. **Procedimiento de failover:** ¿a dónde y cómo?
4. **Comunicación:** ¿quién avisa a quién?
5. **Test periódico:** simulacro trimestral mínimo

**Referencias:**
- NIST SP 800-34 — Contingency Planning
- Restic — restic.net
- ISO 22301 — Business Continuity

## Caso real: Maersk 2017 (NotPetya): el backup que salvó a la empresa

NotPetya destruyó la infraestructura completa de Maersk: 49.000 endpoints, 4.000 servidores, Active Directory completo. La reconstrucción fue posible SOLO porque un controlador de dominio en Accra (Ghana) estaba apagado durante el ataque por un corte de luz. Sin esa copia accidental, Maersk habría tardado meses en reconstruir su AD. Coste: $300M. Lección: la regla 3-2-1-1-0 exige una copia offline/inmutable precisamente para este escenario. Maersk tuvo suerte; tú necesitas diseño.

## Ejercicio guiado: Auditoría de hardening CIS Level 1 sobre una VM

1. Crea una VM Ubuntu Server 22.04 fresca (sin tocar nada)
2. Documenta estado ANTES: servicios activos, puertos abiertos, config SSH
3. Aplica los 6 controles CIS del material (actualizar, servicios, UFW, SSH, permisos, auditd)
4. Documenta DESPUÉS con el mismo formato
5. Verifica: intenta ssh root@vm → debe fallar
6. Verifica: nmap de la VM → solo los puertos que autorizaste
7. Configura un backup con restic y prueba la restauración
8. Calcula RTO y RPO para tu lab (¿cuánto tardarías en restaurar todo?)

## Recursos abiertos

- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
- [Restic Backup](https://restic.net/)
- [NIST SP 800-34](https://csrc.nist.gov/publications/detail/sp/800-34/rev-1/final)

---
[Volver al syllabus](../syllabus.md)
