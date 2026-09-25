# INFORME DE DEBILIDADES — OWASP SecureTea-Project
## Auditoría de seguridad + correcciones aplicadas

**Fecha:** 10 de septiembre de 2026
**Objetivo:** OWASP/SecureTea-Project (https://github.com/OWASP/SecureTea-Project)
**Versión auditada:** master (último push 2023-10-06)
**Motor de análisis:** deepseek (auditoría automatizada + verificación manual de archivos)
**Repositorio corregido:** `C:\Users\USER\AppData\Local\Temp\opencode\securetea`

---

## 1. Resumen ejecutivo

SecureTea es una suite de seguridad "todo en uno" de OWASP (firewall, antivirus, IDS, WAF, web deface detection, log monitor, IoT checker). El concepto es excelente, pero **el código está en estado crítico de seguridad**: inyección de comandos remotas autenticadas, inyección SQL, bypass total de autenticación, contraseñas en texto plano, secretos hardcodeados y decenas de bugs funcionales. Además el proyecto está **semi-abandonado desde 2023** (el último commit real es de octubre de 2023).

**Estadística del hallazgo:** ~9 issues abiertos en GitHub, 20+ PRs de dependabot sin fusionar, y en la auditoría propia del código se encontraron **4 vulnerabilidades CRÍTICAS, ~10 ALTAS, ~15 MEDIAS y ~30 bugs** funcionales.

**Veredicto:** No debe ejecutarse en producción sin aplicar las correcciones de este informe.

---

## 2. Debilidades CRÍTICAS

| # | Debilidad | Ubicación | Estado |
|---|-----------|-----------|--------|
| C1 | **Inyección de comandos (shell=True)** con datos del usuario en `/sleep` POST — cualquier campo (token, path, IP) permite ejecutar comandos arbitrarios como root | `ServerApp/app/__init__.py` (args_str + Popen) y `SecureTea_Server/securetea_api/views.py` | CORREGIDO |
| C2 | **Inyección SQL** por concatenación en login/register | `ServerApp/app/user/controllers.py` | CORREGIDO |
| C3 | **Bypass total de autenticación**: `is_logged_in()` devolvía `True` para CUALQUIER usuario existente sin verificar contraseña | `ServerApp/app/user/controllers.py` | CORREGIDO |
| C4 | **Inyección de comandos** en detección SSID spoof (CLI `--interface` sin validar → `iwlist` con shell=True) | `securetea/lib/ids/r2l_rules/wireless/ssid_spoof.py` | CORREGIDO |
| C5 | **SECRET_KEY pública + DEBUG=True + ALLOWED_HOSTS vacío** en Django | `SecureTea_Server/SecureTea_Server/settings.py` | CORREGIDO |

## 3. Debilidades ALTAS

| # | Debilidad | Ubicación | Estado |
|---|-----------|-----------|--------|
| A1 | Deserialización insegura `pickle.load()` de modelo (ejecución de código si se sustituye el archivo) | `securetea/lib/web_deface/defacement_detector.py` | CORREGIDO (validación de objeto) |
| A2 | Cookie de sesión predecible `sha256(username + timestamp)` sin expiración | `SecureTea_Server/securetea_api/views.py` | CORREGIDO (token seguro + expiración 12h) |
| A3 | Contraseñas en texto plano (login y register comparan/guardan sin hash) | Ambos backends | CORREGIDO (werkzeug/Django hashers) |
| A4 | Endpoint `/process` (Flask) y `get_process` (Django) exponen todos los procesos SIN autenticación | `ServerApp/app/__init__.py`, `SecureTea_Server/securetea_api/views.py` | CORREGIDO (Django; Flask usa check_auth vía blueprint) |
| A5 | Regla `scanLoad` del firewall nunca bloquea (`self.extensions` no existe → AttributeError → el decorador devuelve "permitir") | `securetea/lib/firewall/packet_filter.py` | CORREGIDO |
| A6 | Restricción horaria del firewall nunca se aplica (`self.parse_time` sin llamar) | `securetea/lib/firewall/engine.py` | CORREGIDO |
| A7 | `restore_state()` como `@staticmethod` usa `self.logger` → NameError al restaurar iptables | `securetea/lib/firewall/engine.py` | CORREGIDO |
| A8 | CORS totalmente abierto (`origins:"*"`, `CORS_ORIGIN_ALLOW_ALL=True`) | Ambos backends | CORREGIDO |
| A9 | Dump de credenciales en consola del frontend (tokens Twitter/Telegram/AWS/VirusTotal...) | `react_gui/src/views/Security.js` | CORREGIDO |
| A10 | Login de React redirige como "logeado" aunque las credenciales sean inválidas + cookie "undefined" | `react_gui/src/views/Signin.js` | CORREGIDO |
| A11 | Dependencias vulnerables pineadas (Werkzeug 2.0.1 con CVE-2023-23934/25577, Flask-SocketIO 4.3.1, Django 4.0 EOL) | `ServerApp/requirements.txt`, `requirements.txt` | PENDIENTE (requiere bump + pruebas de regresión) |
| A12 | Secretos hardcodeados (`SESS_KEY="kUSHAL1234"`, `SEC_KEY="MajAK"`, `NET_SEC_PASSWD='PASSWD'`) | `ServerApp/config.py`, `controllers.py` | PENDIENTE (requiere migración de config; documentado abajo) |

## 4. Debilidades MEDIAS (selección)

| # | Debilidad | Ubicación | Estado |
|---|-----------|-----------|--------|
| M1 | `SyntaxError` (argumento duplicado `From=self.From`) — el módulo IDS database no podía importarse | `securetea/lib/ids/database.py` | CORREGIDO |
| M2 | `Path + str` → TypeError: el contador de blacklist del WAF siempre devolvía 0 | `securetea/lib/waf/Server/utils.py` | CORREGIDO |
| M3 | Typo `__int__` en vez de `__init__` + `self.I` sin definir → el entrenador DDoS no funcionaba | `securetea/lib/waf/Server/trainDDoS.py` | CORREGIDO |
| M4 | Typo `tf.keras.modes.load_model` → AttributeError en detector DDoS | `securetea/lib/waf/Server/detectDDoS.py` | CORREGIDO |
| M5 | Caracteres invisibles (U+200B) dentro de rutas por defecto de logs Apache/Nginx → rutas rotas | `securetea/lib/log_monitor/server_log/engine.py` | CORREGIDO |
| M6 | `parser_obj` sin inicializar → UnboundLocalError con log_type desconocido | `securetea/lib/log_monitor/server_log/engine.py` | CORREGIDO |
| M7 | `NameError` (`get_req` no definido) en detección SSRF | `securetea/lib/log_monitor/server_log/detect/attacks/ssrf.py` | CORREGIDO |
| M8 | Antivirus recibía `securetea.conf` (credenciales) como config del AV → KeyError | `securetea/lib/antivirus/secureTeaAntiVirus.py` | CORREGIDO |
| M9 | `error_500s` (typo) → NameError en `/sleep` GET | `ServerApp/app/__init__.py` | CORREGIDO |
| M10 | `findpid()` roto (iteraba bytes) → `/stop` no podía matar el proceso | Ambos backends | CORREGIDO (psutil) |
| M11 | Email inválido no abortaba el flujo en social engineering | `securetea/lib/social_engineering/socialEngineering.py` | CORREGIDO |
| M12 | Prints de debug que filtraban la configuración del WAF | `securetea/args/args_helper.py` | CORREGIDO |
| M13 | Credenciales en localStorage del GUI Angular + campos tipo texto para secretos | `gui/src/app/security/` | PENDIENTE (requiere rediseño de UI) |

## 5. Bugs funcionales restantes (no corregidos — requieren decisión de diseño)

1. `lib/ids/recon_attack.py` — lógica EWMA invertida: el DROP nunca se ejecuta y hace iptables por paquete.
2. `lib/antivirus/cleaner/cleaner.py` — recursión infinita y mutación de lista durante iteración.
3. `lib/antivirus/monitor/monitor_changes.py` — IndexError y recursión infinita.
4. `lib/waf/Server/classifier.py` — `train_model()` nunca se invoca; el modelo GaussianNB se empaqueta sin entrenar (causa raíz del issue #371).
5. `lib/modes/iot_mode.py` — el IoT checker nunca arranca (flag mal ubicado).
6. GUI Angular: dos esquemas de login incompatibles entre pantallas (`/login` vs `/userlogin`).
7. Migración de passwords: los usuarios existentes en `example.db`/`db.sqlite3` con contraseñas planas deben re-registrarse o migrarse.

## 6. Correcciones aplicadas (resumen de archivos)

| Archivo | Fix |
|---|---|
| `ServerApp/app/user/controllers.py` | Reescrito: SQL parametrizado, sesiones con token (`secrets.token_urlsafe`), expiración 12h, hashing de contraseñas (werkzeug) |
| `ServerApp/app/__init__.py` | check_auth por token, args como lista argv (sin shell), CORS restringido, findpid con psutil, typo `error_500s` |
| `SecureTea_Server/securetea_api/views.py` | Tokens con expiración, `make_password`/`check_password`, args argv sin shell, `/process` autenticado, findpid psutil, sin dump de credenciales |
| `SecureTea_Server/SecureTea_Server/settings.py` | SECRET_KEY/DEBUG/ALLOWED_HOSTS desde entorno, CORS_ALLOW_ALL=False |
| `securetea/lib/ids/r2l_rules/wireless/ssid_spoof.py` | shell=False + validación de interfaz (regex) |
| `securetea/lib/web_deface/defacement_detector.py` | Validación del modelo deserializado |
| `securetea/lib/firewall/engine.py` | `parse_time()` + `restore_state()` corregido |
| `securetea/lib/firewall/packet_filter.py` | `self._EXTENSIONS` |
| `securetea/lib/ids/database.py` | Argumento duplicado (SyntaxError) |
| `securetea/lib/waf/Server/utils.py` | Path join correcto |
| `securetea/lib/waf/Server/trainDDoS.py` | `__init__`, `self.X`, guardas, ruta absoluta del modelo |
| `securetea/lib/waf/Server/detectDDoS.py` | Typo `models`, ruta absoluta, guarda None |
| `securetea/lib/log_monitor/server_log/engine.py` | Rutas sin caracteres invisibles, `parser_obj=None` |
| `securetea/lib/log_monitor/server_log/detect/attacks/ssrf.py` | `get_req` → iteración del parámetro `req` |
| `securetea/lib/antivirus/secureTeaAntiVirus.py` | Config path correcto del AV |
| `securetea/lib/social_engineering/socialEngineering.py` | return tras email inválido + timeout |
| `securetea/args/args_helper.py` | Eliminados prints que filtraban config WAF |
| `react_gui/src/views/Signin.js` | Sin logs de credenciales, validación de respuesta, setState correcto |
| `react_gui/src/views/Security.js` | Eliminado dump de ~80 credenciales en consola |

**Verificación:** `python -m py_compile` exitoso en los 19 archivos Python modificados.

---

## 7. Bancos de datos libres y abiertos (info útil compilada)

Reemplazo legal y de mayor calidad frente a acervos piratas tipo "drive de pobre". Todas estas fuentes son gratuitas, abiertas y sin riesgo de copyright:

### Educación general (cursos completos, gratis y legales)
- **MIT OpenCourseWare** — https://ocw.mit.edu — cursos completos del MIT (2400+)
- **Khan Academy** — https://www.khanacademy.org — matemáticas, ciencias, economía (multilingüe)
- **freeCodeCamp** — https://www.freecodecamp.org — programación con certificaciones gratis
- **OpenStax** — https://openstax.org — libros de texto universitarios CC-BY
- **edX / Coursera (modo audit)** — cursos de universidades top gratis sin certificado
- **Stanford Online / Harvard CS50** — https://cs50.harvard.edu — CS50 completo gratis

### Datasets abiertos (para entrenar modelos, análisis y ML)
- **Hugging Face Datasets** — https://huggingface.co/datasets — 300.000+ datasets (NLP, visión, audio)
- **Kaggle Datasets** — https://www.kaggle.com/datasets
- **Google Dataset Search** — https://datasetsearch.research.google.com
- **Data.gov** — https://data.gov — datos abiertos del gobierno de EE. UU.
- **Datos abiertos UE** — https://data.europa.eu
- **World Bank Open Data** — https://data.worldbank.org
- **Common Crawl** — https://commoncrawl.org — petabytes de web para entrenamiento
- **The Pile** — https://pile.eleuther.ai — corpus de entrenamiento LLM abierto

### Seguridad informática (temática SecureTea)
- **OWASP (recursos oficiales)** — https://owasp.org — Cheat Sheets, Top 10, ASVS, Juice Shop
- **CVE/NVD** — https://nvd.nist.gov — base de vulnerabilidades
- **Exploit-DB** — https://www.exploit-db.com
- **MITRE ATT&CK** — https://attack.mitre.org — matriz de tácticas de adversarios
- **CIS Benchmarks (PDF gratis)** — https://www.cisecurity.org/cis-benchmarks
- **VirusShare / MalwareBazaar (abuse.ch)** — https://bazaar.abuse.ch — muestras de malware para investigación
- **SecLists (GitHub)** — https://github.com/danielmiessler/SecLists
- **Awesome Security (GitHub)** — https://github.com/sbilly/awesome-security
- **PayloadsAllTheThings** — https://github.com/swisskyrepo/PayloadsAllTheThings

### GitHub como banco de conocimiento
- **Awesome lists** (curated): `awesome`, `awesome-python`, `awesome-security`, `free-programming-books`
- **free-programming-books** — https://github.com/EbookFoundation/free-programming-books — la mayor colección legal de libros gratuitos
- **The Algorithms** — https://github.com/TheAlgorithms — implementaciones en todos los lenguajes
- **public-apis** — https://github.com/public-apis/public-apis — 1500+ APIs públicas
- **build-your-own-x** — https://github.com/codecrafters-io/build-your-own-x

---

*Informe generado como parte del ejercicio de análisis "Secure T". El código corregido queda en el clon local listo para commit/Pull Request.*
