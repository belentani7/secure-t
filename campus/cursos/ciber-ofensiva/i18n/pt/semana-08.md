# Semana 8: Ataques a aplicações web (OWASP Top 10)

Curso: [Cibersegurança Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 8 de 20

## Objetivos de aprendizagem

- Explicar e testar as categorias do OWASP Top 10 2021 em ambiente próprio
- Diferenciar controle de acesso quebrado de injeção: falha distinta, defesa distinta
- Usar ferramentas de interceptação (proxy) com critério, não como botão mágico
- Escrever um achado web com reprodução, impacto no negócio e remediação

## As dez famílias, com o olhar de quem ataca

O Top 10 2021 não é um catálogo de vulnerabilidades soltas, mas de **famílias** que se repetem. Para o pentester, saber qual família está à frente muda o experimento:

- **A01 Controle de acesso quebrado.** A falha rainha na prática. Teste: trocar um identificador, remover um parâmetro, usar o papel errado. CWE-639, CWE-284.
- **A02 Falhas criptográficas.** Dados sensíveis sem cifra ou com cifra mal aplicada. Teste: olhar tráfego e respostas, revisar cookies e tokens. CWE-319, CWE-327.
- **A03 Injeção.** SQL, NoSQL, comandos, templates. Teste: aspas e metacaracteres em um ponto de entrada controlado, medindo o eco. CWE-89, CWE-78.
- **A04 Design inseguro.** Regras de negócio que permitem abusos que nenhum scanner vê (por exemplo, pedir 10.000 unidades quando há 3 em estoque).
- **A05 Configuração incorreta.** Cabeçalhos ausentes, diretórios listados, painéis de administração expostos, credenciais padrão.
- **A06 Componentes desatualizados.** `nuclei -t cves` ordena candidatos; a versão exata decide.
- **A07 Falhas de identificação e autenticação.** Sem limite de tentativas, sessões que não expiram, MFA contornável.
- **A08 Integridade de software e dados.** Desserialização insegura, atualizações sem assinatura.
- **A09 Registro e monitoramento insuficientes.** Teste: quanto tempo a equipe leva para detectar a sua tentativa autorizada?
- **A10 SSRF.** O servidor como ponte para a própria rede interna. Teste: uma URL controlada por você que aponta para um endereço interno.

**Referências:**
- OWASP Top 10 2021 — owasp.org/Top10/
- OWASP WSTG — owasp.org/www-project-web-security-testing-guide
- CWE Top 25 — cwe.mitre.org/top25

## Ferramentas: o proxy como caderno de laboratório

A ferramenta central desta semana não varre: **intercepta**. Com um proxy (ZAP ou Burp Community) você vê e modifica a requisição real, que é onde vivem essas dez famílias.

```bash
# Proxy local, verificação rápida com curl (sem repetir a request à mão)
curl -sv -x http://127.0.0.1:8080 https://lab.exemplo.test/orders/1042 -H 'Cookie: sid=...'
# Teste de IDOR: a mesma requisição com o identificador de outro usuário
curl -s -b 'sid=...' https://lab.exemplo.test/orders/1043 | head -c 400
# Fuzzing controlado de parâmetros com ffuf (0,3 req/s, dentro do RoE)
ffuf -u 'https://lab.exemplo.test/item?id=FUZZ' -w ids.txt -rate 1 -mc all -fc 404
```

Duas regras: a primeira requisição estranha é olhada à mão antes de automatizar; e **tudo que você descobre é demonstrado com o dano mínimo** (ler um registro seu, não despejar a tabela).

**Referências:**
- OWASP ZAP — zaproxy.org
- ffuf — github.com/ffuf/ffuf

## Caso real: Capital One 2019, a SSRF que cruzou a fronteira

Uma funcionária de uma empresa terceira aproveitou uma regra de firewall mal configurada e, a partir do servidor de aplicações, consultou o serviço de metadados da nuvem para obter credenciais temporárias (SSRF, T1552.005). Com essas credenciais listou e copiou dados de 100 milhões de clientes. O detalhe didático: a vulnerabilidade não estava em «um endpoint antigo» isolado, mas na combinação de uma fronteira de confiança mal fechada (servidor → metadados) com permissões excessivas. No relatório, esse achado é **A10 + A05 + identidade**: escreve-se junto, não em três seções separadas.

## Exercício guiado: cace as dez famílias no Juice Shop

1. Levante o OWASP Juice Shop no seu laboratório: `docker run --rm -p 3000:3000 bkimminich/juice-shop`
2. Abra o ZAP ou o Burp, aponte o navegador para o proxy e navegue na loja com certificado de laboratório
3. Encontre um **A01**: acesse a cesta de outro usuário trocando o identificador
4. Encontre um **A03**: teste uma aspa no buscador e observe o erro; documente o eco
5. Encontre um **A05**: procure `robots.txt`, `/.git/` e cabeçalhos de segurança ausentes
6. Encontre um **A07**: peça um token com senha incorreta 20 vezes e meça a resposta
7. Para cada um: requisição, resposta, captura e severidade CVSS 3.1 proposta
8. Redija **um** achado completo (título, descrição, reprodução, impacto, remediação, referências) como se fosse o cliente quem deve corrigir amanhã

## Recursos abertos

- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP ZAP](https://www.zaproxy.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---
[Voltar ao programa](../syllabus.md)
