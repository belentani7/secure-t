# Semana 6: Modelagem de ameaças e árvores de ataque

Curso: [Cibersegurança Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 6 de 20

## Objetivos de aprendizagem

- Desenhar o sistema (fluxo de dados e fronteiras de confiança) antes de atacá-lo
- Aplicar STRIDE a cada fronteira e obter ameaças concretas, não slogans
- Construir uma árvore de ataque e podá-la com o impacto no negócio
- Converter as ameaças em testes concretos do escopo assinado

## O mapa antes do ataque

Um pentest sem modelagem de ameaças é uma lista de varreduras. A modelagem começa com um **diagrama de fluxo de dados**: processos, armazenamentos, atores externos e os fluxos entre eles. E com a linha mais útil do desenho: as **fronteiras de confiança** — onde um dado passa de um contexto controlado para outro que não está (navegador → API, API → banco de dados, a sua rede → o provedor).

**STRIDE** é a forma mais rápida de percorrer essas fronteiras com critério:

| Letra | Ameaça | Pergunta na fronteira |
|---|---|---|
| S | Falsificação de identidade | Alguém pode se passar por outro aqui? |
| T | Adulteração | O dado pode ser alterado em trânsito ou em repouso? |
| R | Repúdio | Alguém pode negar um ato, sem registro? |
| I | Divulgação | O que vaza se esta fronteira falhar? |
| D | Negação de serviço | O que cai com um pico ou um abuso barato? |
| E | Elevação de privilégio | O que ganha quem cruza esta fronteira para dentro? |

Uma **árvore de ataque** organiza essas ameaças em caminhos: a raiz é o objetivo do atacante («ler dados de clientes»), os ramos são as formas de chegar lá e as folhas, as ações concretas. Poda-se com duas perguntas: **é possível dentro do escopo assinado?** e **quanto dói no negócio?**. O que não dói sai do relatório, mesmo que seja tecnicamente bonito.

**Referências:**
- Microsoft — Threat Modeling (STRIDE)
- OWASP Threat Dragon — owasp.org/www-project-threat-dragon/
- NIST SP 800-154 — Guide to Data-Centric System Threat Modeling

## Da modelagem ao teste

A modelagem vira teste quando cada ameaça tem um **experimento** associado: o que se observa, como se sabe que a ameaça existe e qual evidência o demonstra. Exemplo trabalhado:

- Fronteira: navegador → API de pedidos
- Ameaça (S): passar-se por outro usuário trocando o identificador
- Teste: autenticar como A e pedir o pedido de B (`GET /orders/1042`)
- Evidência: resposta 200 com os dados de B e o número do pedido
- Mapeamento: CWE-639 (IDOR), ATT&CK T1190

Documentar assim tem uma vantagem prática: se a modelagem não inclui uma fronteira, o teste não existe; e se o cliente a vê no relatório, a discussão deixa de ser «que ferramentas você usou» e passa a ser «o que o sistema protege».

**Referências:**
- CWE-639 — Authorization Bypass Through User-Controlled Key
- ATT&CK — T1190 Exploit Public-Facing Application

## Caso real: Target 2013, a fronteira que ninguém desenhou

A equipe de segurança da Target tinha detecção na própria rede… mas o fornecedor de refrigeração tinha acesso VPN ao mesmo segmento. Os atacantes entraram pelas credenciais de um provedor externo de climatização (T1199, Trusted Relationship), moveram-se lateralmente até os servidores de ponto de venda e exfiltraram 40 milhões de cartões (T1078, T1021). A falha de fundo não foi técnica: não existia um mapa dizendo que aquele fornecedor cruzava uma fronteira de confiança em direção à rede de pagamento. Lição desta semana: a fronteira mais perigosa é a que não está desenhada.

## Exercício guiado: modele um aplicativo de reservas

1. Invente um aplicativo: reservas com usuários, painel de administração e pagamentos
2. Desenhe o fluxo de dados: atores, processos, armazenamentos e ao menos 6 fluxos
3. Marque as fronteiras de confiança e escreva qual controle protege cada uma hoje
4. Percorra cada fronteira com STRIDE e anote 2 ameaças por letra
5. Construa uma árvore de ataque para «ler dados de pagamento» e «derrubar o serviço»
6. Pode: deixe apenas os ramos possíveis dentro do escopo de um teste autorizado
7. Escreva os 5 testes concretos com a evidência esperada e o mapeamento CWE/ATT&CK
8. Revise com alguém não técnico: se não entender em 5 minutos, o desenho está sobrando

## Recursos abertos

- [OWASP Threat Dragon](https://owasp.org/www-project-threat-dragon/)
- [Microsoft STRIDE](https://learn.microsoft.com/es-es/azure/architecture/guide/security/threat-modeling)
- [attack-tree (Schneier)](https://www.schneier.com/academic/archives/1999/12/attack_trees.html)
- [CWE-639](https://cwe.mitre.org/data/definitions/639.html)

---
[Voltar ao programa](../syllabus.md)
