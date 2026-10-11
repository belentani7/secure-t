# Semana 5: Pipeline MLOps seguro

Curso: [Inteligência Artificial Aplicada e Segura](../syllabus.md) · Semana 5 de 20

## 🎯 Objetivo da semana

Treinar um pipeline em que a segurança é requisito do ciclo de vida, não um remendo final.

- Versionar dados, código e modelo de ponta a ponta
- Definir gates de promoção que um modelo precisa atravessar
- Registrar o que serviu cada predição, para poder auditar e reverter

## 📖 Leitura principal

### A tríade versionada

Um pipeline de ML seguro versiona três coisas que os pipelines ingênuos perdem: **dados** (com linhagem: de onde veio cada dataset e quem o tocou — o DVC torna isso acessível), **código** e **modelo** (com assinatura: um `.pbin` sem hash é um binário qualquer que pode ter sido substituído).

Os checkpoints são validados **antes** de promover:

- Testes de dados: esquema, faixas, nulos, proporções entre treino e produção
- Testes de modelo: desempenho mínimo **por segmento**, não só global — um modelo com 95 % de acerto que falha sempre em um coletivo não promove
- Testes de segurança: carregar apenas de fontes em lista branca, sem desserialização arbitrária

E o deployment registra **qual** modelo, com **quais** dados e **qual** configuração serviu cada predição: sem isso não existe auditoria possível nem rollback responsável. A regra de ouro herdada do DevSecOps vale igual: se pode ser reconstruído a partir do repositório com um comando, pode ser auditado; se depende do notebook de alguém, é dívida.

**Referências:**
- DVC (Data Version Control) — dvc.org
- MLflow — mlflow.org
- OWASP Machine Learning Security Top 10
- NIST AI 100-1: AI Risk Management Framework

### Caso real: o modelo que ninguém sabia explicar

Sistemas de crédito e triagem automatizados foram reprovados em auditorias não por baixa precisão, mas por **impossibilidade de reconstruir** como uma decisão foi tomada: dados de treino sem versão, experimentos sem semente, modelo servido sem registro. Sem linhagem, a pergunta «por que este modelo decidiu isso?» não tem resposta — e a resposta é obrigatória em boa parte das regulações (LGPD art. 20, RGPD art. 22, quando há decisão automatizada).

## 🛠️ Prática guiada: esboce o seu pipeline

1. Desenhe o pipeline de um classificador de spam (papel ou draw.io)
2. Marque onde vive o versionamento de dados (linhagem) e de código
3. Defina **3 gates** de promoção com critério numérico explícito
4. Comece pelo gate que hoje ninguém cumpre e proponha como medir
5. Marque em vermelho os 2 pontos onde um atacante interno poderia introduzir um modelo adulterado
6. Para cada ponto vermelho, escreva o controle que o fecha e como o testaria
7. Escreva o registro de serving: 5 campos mínimos por predição
8. Verifique a regra de ouro: o pipeline se reconstrói do repositório com um comando?

## Recursos abertos

- [DVC](https://dvc.org/)
- [MLflow](https://mlflow.org/)
- [OWASP ML Security Top 10](https://owasp.org/www-project-machine-learning-security-top-10/)
- [NIST AI 100-1 (AI RMF)](https://www.nist.gov/itl/ai-risk-management-framework)

---
[Voltar ao programa](../syllabus.md)
