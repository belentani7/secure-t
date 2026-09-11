# Ciberseguridad Fundamentals

## Módulo 1: Introducción a la Ciberseguridad

### Conceptos Básicos
- Confidencialidad, Integridad y Disponibilidad (CIA)
- Amenazas y vulnerabilidades comunes
- Principio de menor privilegio
- Defensa en profundidad

### Laboratorio Práctico 1.1
**Configuración básica de firewall con iptables**
```bash
# Bloquear todo el tráfico entrante por defecto
iptables -P INPUT DROP
# Permitir SSH solo desde redes confiables
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT
# Permitir HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

### Laboratorio Práctico 1.2
**Escaneo de puertos con Nmap**
```bash
# Escaneo rápido de puertos abiertos
nmap -F 192.168.1.1
# Escaneo completo de los 1000 puertos
nmap -p- 192.168.1.1
```