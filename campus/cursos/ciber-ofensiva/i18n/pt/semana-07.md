# Semana 7: Varredura de vulnerabilidades e validação

Curso: [Cibersegurança Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 7 de 20

## Objetivos de aprendizagem

- Distinguir varredura autenticada de não autenticada e saber quando usar cada uma
- Configurar Nmap NSE, Nikto e Nuclei sem derrubar o serviço varrido
- Validar um achado antes de escrevê-lo: reproduzi-lo e descartar o falso positivo
- Priorizar com dados: CVSS, EPSS e o catálogo KEV da CISA

## Varrer sem causar dano

Um scanner dispara milhares de requisições; o serviço que você varre não está ali para aguentar você. Antes de disparar, três decisões:

1. **Janela e ritmo.** Respeite a janela do RoE e limite a concorrência (`-T3` no Nmap, `-rate-limit` no Nuclei). Um `-T5` em produção pode ser um incidente causado por você mesmo.
2. **Autenticada ou não.** A varredura não autenticada vê o que um estranho vê; a autenticada vê o que um usuário com conta vê. Para medir superfície real, as duas: primeiro a de fora (impacto), depois a de dentro (cobertura).
3. **O que fica de fora.** Hosts fora do escopo, serviços frágeis (impressoras, equipamentos médicos, PLC) e tudo que o cliente marcar como intocável. Exclui-se por escrito.

```bash
# Nmap: serviços e scripts NSE em portas abertas (ritmo moderado)
nmap -sV -sC --script vuln -T3 -p 22,80,443,3306 192.0.2.10 -oA varredura
# Nuclei: modelos por tecnologia, com limite de ritmo e excluindo o delicado
nuclei -u https://exemplo.com -t cves,exposures,misconfiguration -rl 40 -etags dos
```

**Referências:**
- Nmap NSE — nmap.org/book/nse.html
- Nuclei — docs.projectdiscovery.io
- NIST SP 800-115 — Technical Guide to Information Security Testing

## Validar antes de escrever

Um relatório com um falso positivo perde credibilidade para sempre. A validação tem quatro passos e é feita **sempre**:

1. **Reproduzir** o achado do zero, em ambiente limpo, e anotar as versões exatas.
2. **Isolar** a causa: é a versão, a configuração ou o código próprio? Um CVE de banner não é uma vulnerabilidade explorável.
3. **Medir o impacto real** com um experimento mínimo (ler um arquivo seu, não «extrair o banco inteiro»).
4. **Registrar evidência** utilizável por quem não estava lá: comando, saída, captura e hora.

Esse trabalho também é o que fixa a severidade. O **CVSS** pontua a gravidade técnica; ele não diz se alguém explora. Para isso existem o **EPSS** (probabilidade de exploração em 30 dias) e a lista **KEV da CISA** (sabe-se que é explorada). Priorização honesta: KEV primeiro, EPSS alto depois, CVSS alto sem exploração conhecida por último… e sempre cruzando com o impacto no negócio que a modelagem de ameaças da semana 6 definiu.

**Referências:**
- FIRST — CVSS 3.1 (first.org/cvss)
- FIRST — EPSS (first.org/epss)
- CISA — Known Exploited Vulnerabilities (cisa.gov/known-exploited-vulnerabilities-catalog)

## Caso real: Log4Shell, a varredura que não bastava

Em dezembro de 2021 apareceu a CVE-2021-44228 (Log4j 2, CVSS 10.0). Semanas depois, o KEV da CISA já listava exploração ativa massiva (T1190) e os atacantes usavam JNDI para carregar classes remotas (T1059). As organizações que apenas executaram um scanner ficaram com listas enormes de «possível afetação»; as que validaram (versão exata + `log4j-core` no classpath + chamada JNDI reproduzível) conseguiram corrigir primeiro o que era explorável. Lição: o scanner produz **candidatos**; o pentester produz **achados** validados.

## Exercício guiado: varra, valide e priorize três achados

1. No seu laboratório (Metasploitable 2 ou contêineres próprios), execute Nmap com `-sV -sC` e guarde a saída
2. Passe o Nikto no serviço web e anote os avisos, sem copiá-los para o relatório ainda
3. Escolha 3 avisos e reproduza-os à mão com `curl` ou o navegador
4. Para cada um: é explorável? Descreva o experimento mínimo e o resultado
5. Pontue com CVSS 3.1 (calculadora da FIRST) e consulte EPSS e KEV por CVE
6. Ordene os três por risco real, não por CVSS, e justifique a ordem
7. Escreva a ficha de cada achado com reprodução e evidência
8. Anote o que você decidiu **não** varrer e por quê (fica no apêndice do relatório)

## Recursos abertos

- [Nmap NSE](https://nmap.org/book/nse.html)
- [Nuclei](https://docs.projectdiscovery.io/opensource/nuclei/overview)
- [EPSS](https://www.first.org/epss/)
- [CISA KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [CVSS 3.1](https://www.first.org/cvss/calculator/3.1)

---
[Voltar ao programa](../syllabus.md)
