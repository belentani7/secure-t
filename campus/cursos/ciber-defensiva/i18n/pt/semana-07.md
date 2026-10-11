# Semana 7: Forense digital básico

Curso: [Cibersegurança Defensiva: Operar como SOC](../syllabus.md) · Semana 7 de 20

## Objetivos de aprendizagem

- Aplicar a ordem de volatilidade ao coletar evidência
- Trabalhar com imagens e artefatos sem modificá-los (cadeia de custódia)
- Reconstruir uma linha do tempo mínima de uma máquina comprometida

## Ordem de volatilidade: o que se perde primeiro

A evidência é coletada do que desaparece antes para o que aguenta mais: **memória e processos → conexões → disco → cópias e logs remotos**. Desligar a máquina destrói a primeira camada. Se o equipamento está cifrado com a chave em memória, desligá-lo pode tornar os dados inacessíveis para sempre.

Toda captura é documentada: quem, quando, com que ferramenta, hash do resultado. Um arquivo sem hash não é evidência; é uma cópia.

```bash
# Memória e conexões (nunca escrever no disco investigado)
ss -tunap > /mnt/evidencia/conexoes.txt
# Imagem forense com hash e verificação
sudo dd if=/dev/sda of=/mnt/evidencia/disco.img bs=4M conv=noerror,sync status=progress
sha256sum /mnt/evidencia/disco.img > /mnt/evidencia/disco.img.sha256
# Linha do tempo simples a partir de metadados
find /mnt/evidencia/montagem -printf '%T@ %p\n' | sort -n | head -50
```

**Referências:**
- NIST SP 800-86 — Guide to Integrating Forensic Techniques into Incident Response
- RFC 3227 — Guidelines for Evidence Collection and Archiving

## Linha do tempo: a narrativa mínima

Uma investigação não termina com «encontrei um arquivo estranho», mas com uma sequência: primeiro isto, depois aquilo. Com marcas de tempo de arquivos, logs de autenticação e registros de processos constrói-se essa sequência. Ordenar bem já descarta explicações inocentes: às vezes o «ataque» é uma tarefa de manutenção.

## Exercício guiado: linha do tempo de um compromisso simulado

1. No seu laboratório, monte uma máquina virtual e deixe duas ou três «pegadas» controladas
2. Antes de tocar em nada, anote a ordem de volatilidade que seguirá
3. Capture conexões e processos e guarde o hash de cada saída
4. Faça uma imagem do disco com `dd` e verifique a integridade
5. Monte a imagem em somente leitura e extraia marcas de tempo de `/var/log` e `/tmp`
6. Ordene os fatos em uma linha do tempo com a sua explicação
7. Feche o relatório com três recomendações de melhoria para o próximo caso

## Recursos abertos

- [RFC 3227](https://www.rfc-editor.org/rfc/rfc3227)
- [NIST SP 800-86](https://csrc.nist.gov/pubs/sp/800/86/final)
- [The Sleuth Kit](https://www.sleuthkit.org/sleuthkit/)

---
[Voltar ao programa](../syllabus.md)
