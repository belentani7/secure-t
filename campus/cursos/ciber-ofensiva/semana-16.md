# Semana 16: Ataques a cloud y contenedores

Curso: [Ciberseguridad Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 16 de 20

## Objetivo de la semana
Comprender las superficies de ataque específicas de entornos cloud (AWS, Azure, GCP) y plataformas de contenedores (Docker, Kubernetes), identificando malas configuraciones, técnicas de escalada de privilegios, movimiento lateral y exfiltración. El estudiante será capaz de enumerar, explotar y documentar vulnerabilidades en clústeres y servicios cloud aplicando tácticas de MITRE ATT&CK for Containers y las guías de OWASP Kubernetes Top 10.

## LECTURA
Los entornos cloud y de contenedores han redefinido el perímetro de seguridad: ya no hay un "interior" confiable. MITRE ATT&CK mantiene matrices específicas como **ATT&CK for Containers** e **IaaS**, donde se catalogan tácticas como *Initial Access* (T1078 - Valid Accounts), *Execution* (T1610 - Deploy Container), *Privilege Escalation* (T1611 - Escape to Host), *Credential Access* (T1552.005 - Cloud Instance Metadata API) y *Impact* (T1485 - Data Destruction). Un vector clásico es el **SSRF contra el endpoint IMDS** (169.254.169.254) para robar credenciales de rol IAM; el incidente de Capital One (2019) explotó exactamente esta técnica. En Kubernetes, OWASP publica el **Kubernetes Top 10** con riesgos como K01 (Insecure Workload Configurations), K02 (Supply Chain), K03 (Over-permissive RBAC) y K04 (Lack of Centralized Policy Enforcement). Las malas configuraciones frecuentes incluyen: `privileged: true`, `hostPath` montando `/`, `hostNetwork: true`, tokens de ServiceAccount con permisos `cluster-admin`, y ausencia de NetworkPolicies. Herramientas como **kube-hunter**, **kubeaudit**, **Peirates**, **CDK**, **Trivy** y **Prowler** permiten enumeración y explotación. El **CIS Kubernetes Benchmark** y el **CIS Docker Benchmark** definen líneas base auditables, mientras que **NIST SP 800-190** (Application Container Security Guide) y **NIST SP 800-204** (Microservices) marcan el marco de referencia. ISO/IEC 27017 y 27018 complementan los controles para servicios cloud, y los CIS Controls v8 (especialmente 3, 4, 12 y 16) aplican a gestión de datos, configuraciones seguras y seguridad de aplicaciones. La superficie de ataque incluye también: container escape vía runc (CVE-2019-5736), Docker socket expuesto (`/var/run/docker.sock`), Kubernetes API server sin autenticación en puerto 6443/8080, etcd sin TLS, y buckets S3 con ACL públicas. La fase de post-explotación busca robar secrets (K8s Secrets, AWS Secrets Manager), pivotar hacia el nodo host y comprometer el control plane. La detección se apoya en **Falco**, **Sysdig**, **Aqua** y logs de CloudTrail/GuardDuty.

## EJERCICIO
**Objetivo:** Explotar un clúster Kubernetes vulnerable y escalar hasta el nodo host.

**Entorno:** Levanta un laboratorio con `kind` o `minikube` y despliega el escenario vulnerable de **Kubernetes Goat** (https://github.com/madhuakula/kubernetes-goat).

**Pasos:**
1. Instala el clúster: `kind create cluster --name k8s-lab` y despliega Kubernetes Goat con `bash setup-kubernetes-goat.sh`.
2. **Enumeración externa:** ejecuta `kube-hunter --remote <IP>` y `nmap -p 6443,10250,2379,8080 <IP>` para identificar API server, kubelet y etcd expuestos.
3. **Reconocimiento interno:** obtén un pod con `kubectl get pods -A`; accede a uno con `kubectl exec -it <pod> -- sh`. Dentro, ejecuta `env`, `cat /var/run/secrets/kubernetes.io/serviceaccount/token` y `curl -k https://kubernetes.default.svc/api`.
4. **Escalada RBAC:** identifica el ServiceAccount montado, consulta permisos con `kubectl auth can-i --list --as=system:serviceaccount:<ns>:<sa>` y busca `create pods`, `get secrets` o `impersonate`.
5. **Escape al host:** en el escenario "DIND" de Kubernetes Goat, monta el socket Docker y lanza un contenedor privilegiado: `docker run -v /:/host --privileged -it alpine chroot /host`.
6. **Robo de credenciales cloud:** simula IMDS con `curl http://169.254.169.254/latest/meta-data/iam/security-credentials/` (usa LocalStack si estás en local).
7. **Detección:** instala Falco y verifica que alerta sobre `Terminal shell in container` y `Launch Privileged Container`.
8. **Remediación:** aplica NetworkPolicies, PSA (Pod Security Admission) con nivel `restricted`, y RBAC de mínimo privilegio. Documenta en un informe con capturas, comandos y mapeo MITRE ATT&CK.

## CASO
**Caso Tesla Kubernetes (2018):** Investigadores de RedLock (hoy Palo Alto Prisma Cloud) descubrieron un clúster Kubernetes de Tesla con la consola de administración expuesta en internet sin contraseña. Dentro del clúster encontraron un pod ejecutando **kubelet** con credenciales de AWS almacenadas en variables de entorno. Los atacantes (o investigadores) pudieron acceder al bucket S3 de telemetría de Tesla y potencialmente extraer datos. El vector combinó tres fallos: (1) API server sin autenticación, (2) secrets en texto plano dentro del pod, (3) rol IAM sobredimensionado. Mapeo MITRE: T1078 (Valid Accounts), T1552.005 (Cloud Instance Metadata API), T1530 (Data from Cloud Storage). Lecciones: nunca exponer el API server, usar IRSA/Workload Identity en lugar de claves estáticas, aplicar CIS Kubernetes Benchmark y habilitar auditoría. Otro caso relevante es **Codecov (2021)**, donde un atacante modificó un script bash del CI/CD para exfiltrar variables de entorno con credenciales cloud, demostrando el riesgo de la cadena de suministro en pipelines contenerizados (MITRE T1195.002 - Compromise Software Supply Chain).

## Recursos abiertos
- https://attack.mitre.org/matrices/enterprise/containers/
- https://owasp.org/www-project-kubernetes-top-ten/
- https://github.com/madhuakula/kubernetes-goat
- https://csrc.nist.gov/publications/detail/sp/800-190/final
- https://www.cisecurity.org/benchmark/kubernetes

--- [Volver al syllabus](../syllabus.md)
