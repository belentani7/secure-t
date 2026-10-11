# Semana 5: Reconhecimento avançado e OSINT

Curso: [Cibersegurança Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 5 de 20

## 🎯 Objetivo da semana

Transformar informação pública dispersa em um mapa acionável do alvo, sem deixar pegada que o cliente não conheça.

- Transformar informação pública dispersa em um mapa acionável do alvo
- Enumerar subdomínios com certificados, DNS e força bruta ética
- Ler metadados de documentos e perfilar pessoas sem assediá-las
- Cuidar da própria pegada: o reconhecimento do pentester também deixa rastro

## 📖 Leitura principal

### Do dado solto ao mapa: as três perguntas

Um reconhecimento passivo bem feito responde três perguntas **antes** de tocar em qualquer coisa: **qual** superfície existe, **quem** a administra e **quanto** ela vale para o escopo assinado. O resto é colecionismo.

O trabalho começa pelo domínio. Os certificados (crt.sh) revelam subdomínios históricos que às vezes continuam vivos; os registros DNS contam uma história: os MX entregam o provedor de e-mail, os TXT mostram SPF e DMARC (e, com eles, se falsificar o domínio é fácil), os NS dizem quem hospeda a zona e, às vezes, com que outras empresas ela se relaciona. A Wayback Machine guarda versões que alguém quis apagar: portais antigos, endpoints removidos, notas de imprensa com contatos. E os documentos públicos carregam metadados: autor, modelo, caminhos internos do sistema que os gerou.

**Referências:**
- MITRE ATT&CK — T1593 Search Open Websites/Domains
- MITRE ATT&CK — T1596 Search Open Technical Databases
- RFC 7208 (SPF) e RFC 7489 (DMARC)

### Ferramentas e automação razoável

A enumeração manual não escala; a automação sem critério gera ruído que ninguém lê.

```bash
# Subdomínios: certificados + DNS + permutações (amass, modo passivo)
amass enum -passive -d exemplo.com -o subdominios.txt
# E-mails e hosts públicos (theHarvester)
theHarvester -d exemplo.com -b bing,duckduckgo -f relatorio.html
# Metadados de um documento público
exiftool documento-publico.pdf | grep -Ei 'author|creator|producer'
```

Regra de escolha: uma ferramenta por pergunta. `amass` para superfície, `theHarvester` para identidade e e-mails, `exiftool` para documentos, `curl` e `jq` para APIs públicas. Se você não sabe qual pergunta a ferramenta responde, não a dispare: adiciona ruído e, em modo ativo, tráfego que o cliente terá de explicar.

**O perfilamento de pessoas é feito para o relatório, não para a intrusão.** Saber que a responsável pelos sistemas aparece em palestras e publicações serve para escrever qual simulação de engenharia social seria realista em um exercício autorizado. Esse é o limite: o que não se justifica no escopo não se coleta. E a minimização também vale para o OSINT: guarda-se o necessário, com data e fonte, e apaga-se o que sobra ao fechar o projeto.

**Higiene do próprio pentester:** o reconhecimento deixa pegada (consultas ao crt.sh com o seu IP corporativo, visitas ao site do cliente). Use uma saída de rede declarada ao cliente, evite entrar em serviços com contas pessoais e documente o que fez e quando: se o cliente vir tráfego estranho, o seu registro é a resposta.

**Referências:**
- OWASP Amass — github.com/owasp-amass/amass
- theHarvester — github.com/laramies/theHarvester
- ExifTool — exiftool.org

### Caso real: Scattered Spider e o reconhecimento que abriu um cassino (2023)

Em 2023, o grupo conhecido como Scattered Spider (atribuído à ALPHV/BlackCat) entrou no MGM Resorts e na Caesars Entertainment sem explorar uma única vulnerabilidade de software. O reconhecimento foi social: perfilaram funcionários em redes profissionais, ligaram para o service desk se passando por eles (vishing, T1566) e conseguiram redefinir o MFA. Com uma conta válida (T1078), o resto foi movimento lateral e cifragem de sistemas. Lição para esta semana: o reconhecimento avançado não termina nos certificados. Quando o relatório diz «existe um procedimento de redefinição de MFA por telefone», isso é um achado de segurança, mesmo sem CVE.

## 🛠️ Prática guiada: perfil avançado de um domínio autorizado

1. Escolha um domínio próprio ou com programa público de bug bounty (e cite o programa)
2. Enumere subdomínios com `amass enum -passive` e compare com o `crt.sh`
3. Revise o DNS: MX, NS, TXT. Anote SPF e DMARC e explique se permitem falsificação
4. Procure na Wayback Machine versões de 2-3 anos atrás e anote 3 diferenças
5. Baixe um PDF público e leia os metadados com `exiftool`: quem o gerou?
6. Documente cada dado com fonte, data e a pergunta que ele responde
7. Escreva uma ficha de uma página: superfície, responsáveis e valor para o escopo
8. Acrescente uma seção de «pegada própria»: por onde você saiu, o que consultou e quando

## Recursos abertos

- [OWASP Amass](https://github.com/owasp-amass/amass)
- [crt.sh](https://crt.sh/)
- [theHarvester](https://github.com/laramies/theHarvester)
- [ExifTool](https://exiftool.org/)
- [ATT&CK Reconnaissance (TA0043)](https://attack.mitre.org/tactics/TA0043/)

---
[Voltar ao programa](../syllabus.md)
