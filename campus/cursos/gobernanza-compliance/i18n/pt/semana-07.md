# Semana 7: Risco de terceiros e cadeia de suprimentos

Curso: [Governança e Conformidade Digital](../syllabus.md) · Semana 7 de 20

## Objetivos de aprendizagem

- Medir o risco herdado ao integrar um fornecedor ou uma dependência
- Pedir evidência em vez de certificados emoldurados
- Escrever cláusulas de segurança que possam ser verificadas

## O risco herdado não aparece no seu painel

O seu nível de segurança inclui o dos seus fornecedores, bibliotecas e serviços. Três perguntas organizam o trabalho:

1. **O que acessa o quê.** Um fornecedor com acesso a dados pessoais não é o mesmo que um que só cobra por transferência.
2. **Que evidência existe.** SOC 2, ISO 27001 ou um questionário próprio: serve o que se pode revisar, com data e escopo.
3. **O que acontece se falhar.** Plano de saída, quais dados podem ser recuperados e em que prazo.

Duas regras práticas que quase ninguém aplica: **criticidade antes de popularidade** (um pacote minúsculo mantido por uma pessoa pode estar no caminho crítico dos seus pagamentos) e **dependências transitivas contam** (o que o seu fornecedor usa também é risco seu).

**Referências:**
- NIST SP 800-161 Rev.1 — C-SCRM
- ISO/IEC 27036 — Supplier relationships
- CISA — Software Bill of Materials (SBOM)

## Caso real: a atualização assinada que trazia intrusão

Na brecha de cadeia de suprimentos mais citada da década, a atualização de um produto de monitoramento amplamente implantado chegou com código malicioso dentro; milhares de organizações a instalaram **porque confiavam no fornecedor**. A lição de governança: a confiança não se compra com um certificado; mantém-se com verificação contínua (build reproduzível, SBOM, duplo controle de release) e com contratos que exigem notificar e compensar. Se o seu único controle é «é um fornecedor conhecido», você não tem controle.

## Exercício guiado: emita o passaporte de um fornecedor

1. Escolha um fornecedor real ou um pacote que você use em produção
2. Classifique a sua criticidade: a que dados ou processos ele acessa
3. Peça a evidência disponível: relatórios, SBOM, data do último teste
4. Revise quanto dessa evidência é verificável por você e quanto é declaratório
5. Escreva 5 cláusulas exigíveis: notificação de incidentes, prazo de correção, auditoria, saída de dados, subcontratados
6. Defina o plano de saída: como substituí-lo e em que prazo
7. Fixe uma revisão periódica com responsável e data

## Recursos abertos

- [NIST SP 800-161 Rev.1](https://csrc.nist.gov/pubs/sp/800/161/r1/final)
- [CISA SBOM](https://www.cisa.gov/sbom)
- [OpenSSF Scorecard](https://github.com/ossf/scorecard)

---
[Voltar ao programa](../syllabus.md)
