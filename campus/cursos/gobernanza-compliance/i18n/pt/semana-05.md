# Semana 5: Gestão de riscos (ISO 31000, NIST 800-39)

Curso: [Governança e Compliance: Liderar com Evidência](../syllabus.md) · Semana 5 de 20

## 🎯 Objetivo da semana

Traduzir ativos e ameaças em risco comparável, com decisões assinadas e monitoramento.

- Traduzir ativos e ameaças em risco com critério explícito e comparável
- Aplicar o ciclo do NIST 800-39: enquadrar, avaliar, responder, monitorar
- Escrever um registro de riscos que um comitê consiga decidir, não apenas ler

## 📖 Leitura principal

### Risco não é medo: é uma conta

Risco = **probabilidade × impacto**, com o escopo e o apetite escritos ao lado. Sem essas duas âncoras, qualquer número serve e nenhum decide. A ISO 31000 traz o processo e o vocabulário; o NIST 800-39 traz os quatro níveis (organização, missão, sistema, informação) e a ideia de que o risco **se aceita ou se trata em um nível concreto**, não em abstrato.

| Elemento | Pergunta | Saída |
|---|---|---|
| Ativo | O que protege e quanto vale | Inventário priorizado |
| Ameaça | Quem ou o que pode danificá-lo | Cenários plausíveis |
| Vulnerabilidade | Por onde entra | Controle que falta ou falha |
| Probabilidade | Com que frequência, com que evidência | Escala com critério |
| Impacto | Quanto dói, em negócio | Dinheiro, prazo, reputação, legal |
| Resposta | Evitar, reduzir, transferir, aceitar | Decisão com dono e data |

**O erro mais caro** é a matriz de cores sem critério: se «probabilidade alta» não está definida com dados, o resultado depende de quem pinta a casela. Define-se antes de avaliar.

**Referências:**
- ISO 31000:2018 — Risk management
- NIST SP 800-39 — Managing Information Security Risk
- ISO/IEC 27005 — Information security risk management

### Caso real: o risco aceito sem ninguém saber

Muitas brechas começam com um sistema antigo, sem patches, em uma rede plana que «ninguém mais usa». Ninguém decidiu formalmente aceitar esse risco: ele simplesmente não estava no registro, e o que não está no registro não se decide. Quando o incidente ocorre, a pergunta do comitê não é «o que falhou», mas «quem aceitou isso e quando»; sem registro não há resposta, e sem resposta paga-se duas vezes (técnica e reputacional).

## 🛠️ Prática guiada: registro de riscos com decisões

1. Escolha um sistema real ou de laboratório e liste 10 ativos de informação
2. Escreva 8 cenários de ameaça plausíveis e associe a cada um uma vulnerabilidade
3. Defina escalas de probabilidade e impacto com **critérios numéricos** antes de pontuar
4. Pontue e ordene; marque os 3 primeiros como prioritários
5. Para cada prioritário, escreva a resposta (evitar, reduzir, transferir, aceitar) com dono e data
6. Acrescente um plano de monitoramento: que indicador avisa que o risco está crescendo
7. Apresente o registro em uma página: alguém do negócio deve conseguir decidir com ele

## Recursos abertos

- [ISO 31000](https://www.iso.org/iso-31000-risk-management.html)
- [NIST SP 800-39](https://csrc.nist.gov/pubs/sp/800/39/final)
- [FAIR Institute](https://www.fairinstitute.org/)

---
[Voltar ao programa](../syllabus.md)
