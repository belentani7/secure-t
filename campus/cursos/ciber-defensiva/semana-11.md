# Semana 11: Analisis basico de malware

Curso: [Ciberseguridad Defensiva: Operar como SOC](../syllabus.md) · Semana 11 de 20

## Objetivo de la semana
Comprender los fundamentos del análisis de malware desde una perspectiva defensiva, diferenciando entre análisis estático, dinámico e híbrido. El estudiante aprenderá a identificar indicadores de compromiso (IoC), aplicar técnicas de triage seguro en un entorno controlado y mapear comportamientos maliciosos con MITRE ATT&CK para enriquecer la respuesta a incidentes en un SOC.

## LECTURA
El análisis básico de malware es una disciplina central en las operaciones de un Centro de Operaciones de Seguridad (SOC) y en la respuesta a incidentes. Su propósito no es desarrollar exploits ni crear variantes, sino **entender el comportamiento de una muestra** para detectar, contener y erradicar amenazas. Según el NIST SP 800-83 (Guide to Malware Incident Prevention and Handling), el análisis de malware debe integrarse en un ciclo de vida que abarca preparación, detección, contención, erradicación y recuperación, alineado con NIST SP 800-61 (Computer Security Incident Handling Guide).

Existen tres enfoques principales:

1. **Análisis estático**: examina el binario sin ejecutarlo. Se usan herramientas como `strings`, `PEStudio`, `Detect It Easy (DIE)`, `pefile` o `YARA`. Se extraen hashes (MD5, SHA-1, SHA-256), imports, secciones PE, entropía y firmas. El estándar de facto para reglas de detección es **YARA**, ampliamente usado por VirusTotal y equipos de threat hunting.

2. **Análisis dinámico**: ejecuta la muestra en un entorno aislado (sandbox) como Cuckoo, CAPE, ANY.RUN o REMnux con INetSim. Se observa tráfico de red, llamadas a API, persistencia en registro, creación de procesos hijos, inyección en procesos legítimos (T1055) y comunicación C2.

3. **Análisis híbrido**: combina ambos, comúnmente con herramientas como `Speakeasy`, `Qiling` o sandboxes que emulan APIs.

El marco **MITRE ATT&CK** permite mapear cada hallazgo a tácticas y técnicas concretas: por ejemplo, `T1547.001` (Registry Run Keys) para persistencia, `T1059.001` (PowerShell) para ejecución, o `T1071.001` (Web Protocols) para C2. Esto alimenta directamente detecciones en SIEM (Splunk, Elastic, Sentinel) y reglas Sigma.

Desde el punto de vista normativo, **ISO/IEC 27001:2022** en sus controles 8.7 (protección contra malware) y 5.7 (inteligencia de amenazas) exige procesos documentados de análisis y gestión. Los **CIS Controls v8** abordan el tema en el Control 10 (Malware Defenses) y Control 13 (Network Monitoring and Defense). **OWASP** complementa con su guía sobre análisis de archivos maliciosos en aplicaciones web (Malicious File Upload).

Buenas prácticas operativas:
- Nunca analizar muestras fuera de un entorno aislado (air-gapped o VM sin red).
- Documentar cadena de custodia y hashes para trazabilidad forense.
- Extraer IoCs en formato STIX/TAXII para compartir vía MISP.
- Correlacionar con feeds de threat intelligence (VirusTotal, AlienVault OTX, abuse.ch).

El triage básico responde a: ¿qué es?, ¿qué hace?, ¿a quién afecta?, ¿cómo se propaga?, ¿cómo se detecta?

## EJERCICIO
**Objetivo**: Realizar un triage estático y dinámico de una muestra inofensiva (EICAR o muestra educativa de MalwareBazaar etiquetada como benigna) en un entorno seguro, y generar un reporte con IoCs mapeados a MITRE ATT&CK.

**Requisitos previos**:
- VM aislada (REMnux o Ubuntu con red host-only).
- Snapshot previo de la VM.
- Herramientas: `file`, `strings`, `sha256sum`, `pefile`, `YARA`, `PEStudio` (Windows) o `Detect It Easy`, y opcionalmente `CAPE` o `ANY.RUN` (sandbox público).

**Pasos**:

1. **Preparación segura**: Configura la VM sin acceso a internet real (host-only) y desactiva carpetas compartidas. Verifica con `ip a` y `ping 8.8.8.8` (debe fallar).

2. **Cálculo de hashes**:
   ```bash
   sha256sum muestra.bin
   md5sum muestra.bin
   ```
   Registra los hashes como identificadores únicos.

3. **Identificación de tipo**:
   ```bash
   file muestra.bin
   ```
   Anota la arquitectura (PE32, ELF, script).

4. **Extracción de strings**:
   ```bash
   strings -n 6 muestra.bin | less
   ```
   Busca URLs, IPs, dominios, rutas de registro (`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`), nombres de procesos.

5. **Análisis de cabeceras PE** (si aplica):
   ```bash
   python3 -c "import pefile; pe=pefile.PE('muestra.bin'); print(pe.dump_info())"
   ```
   Revisa imports sospechosos: `VirtualAlloc`, `CreateRemoteThread`, `WriteProcessMemory`.

6. **Regla YARA personalizada**: Crea `regla_eicar.yar`:
   ```
   rule EICAR_Test {
     meta: description = "Detección EICAR"
     strings: $a = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR"
     condition: $a
   }
   ```
   Ejecuta: `yara regla_eicar.yar muestra.bin`

7. **Análisis dinámico**: Sube la muestra a `any.run` o ejecútala en CAPE. Captura:
   - Procesos creados (árbol de procesos).
   - Conexiones de red (IP, dominio, puerto).
   - Claves de registro modificadas.
   - Archivos creados en `%TEMP%` o `%APPDATA%`.

8. **Mapeo MITRE ATT&CK**: Con los hallazgos, completa una tabla:
   | Comportamiento | Táctica | Técnica | ID |
   |---|---|---|---|
   | Escritura en Run key | Persistence | Registry Run Keys | T1547.001 |
   | Conexión HTTP a IP externa | C2 | Web Protocols | T1071.001 |

9. **Reporte final**: Genera un documento con hashes, IoCs (formato CSV con columnas `tipo,valor,contexto`), capturas del sandbox y conclusiones. Exporta los IoCs a un archivo STIX o CSV para importar en MISP.

**Entregable**: Reporte PDF/Markdown + archivo `iocs.csv` + regla YARA.

## CASO
**Caso: NotPetya (2017) — análisis de un wiper disfrazado de ransomware**

En junio de 2017, una variante de Petya apodada NotPetya afectó a Maersk, Merck, FedEx y otras multinacionales, causando pérdidas superiores a 10.000 millones de USD. Aunque se presentaba como ransomware (pedía rescate en Bitcoin), el análisis reveló que **no había mecanismo funcional de descifrado**: era un wiper destructivo.

**Análisis estático reveló**:
- Firma de compilación vinculada a la herramienta `EternalBlue` (exploit SMB, CVE-2017-0144) y `EternalRomance`.
- Uso de `PsExec` y WMI para movimiento lateral (T1021.002, T1047).
- Persistencia mediante tarea programada `perfc.dat` y reinicio forzado (T1053.005).
- Mecanismo de propagación: escaneo SMB interno y robo de credenciales con Mimikatz embebido (T1003.001).

**Análisis dinámico**:
- El binario sobrescribía el MBR (Master Boot Record) con código personalizado que cifraba la tabla de particiones.
- Exfiltración previa de credenciales al servidor C2 vía HTTP POST antes del cifrado.
- Borrado de logs de eventos (T1070.001).

**Lecciones para el SOC**:
1. Los IoCs (hashes de `perfc.dat`, IPs C2, nombres de tareas) se compartieron rápidamente vía MISP y US-CERT.
2. La detección temprana dependió de reglas Sigma para `wevtutil cl` y creación de tareas anómalas.
3. CIS Control 10 (Malware Defenses) y el parcheo de SMB (MS17-010) habrían mitigado la propagación.
4. MITRE ATT&CK documenta NotPetya como caso de estudio oficial en su técnica T1485 (Data Destruction).

El caso demuestra que el análisis básico de malware no es solo técnico: **el contexto, la atribución y la velocidad de intercambio de inteligencia** determinan el impacto real en una organización.

## Recursos abiertos
- https://attack.mitre.org/ — Base de conocimiento MITRE ATT&CK con tácticas y técnicas.
- https://bazaar.abuse.ch/ — Repositorio de muestras de malware para análisis educativo.
- https://github.com/VirusTotal/yara — Herramienta YARA oficial para reglas de detección.
- https://github.com/REMnux/remnux-distro — Distribución Linux especializada en análisis de malware.
- https://www.cisa.gov/news-events/alerts — Alertas oficiales de CISA con IoCs de incidentes reales.

--- [Volver al syllabus](../syllabus.md)
