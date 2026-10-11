# Semana 8: Hardening de sistemas

Curso: [Cibersegurança Defensiva: Construir e Defender](../syllabus.md) · Semana 8 de 20

## Objetivos de aprendizagem

- Reduzir superfície de ataque com critério: menos serviços, menos permissões, menos rotas
- Aplicar uma linha de base verificável em vez de uma lista de desejos
- Medir o antes e o depois com uma verificação automática

## Menos é mais: as quatro reduções

1. **Serviços**: o que não se usa, desliga-se e desinstala-se.
2. **Permissões**: privilégio mínimo por usuário, serviço e processo; `sudo` com lista branca.
3. **Rotas**: feche o que não precisa estar exposto; o acesso interno passa por um ponto controlado.
4. **Credenciais**: sem senhas compartilhadas, sem chaves no código, rotação com registro.

O hardening se sustenta com **linha de base**: um documento executável que diz como o sistema deve estar, e uma verificação que o comprova. Sem verificação, em três meses o sistema volta ao estado original.

```bash
# Linha de base mínima em um servidor Linux
sudo ss -tulpn                                    # o que escuta e quem
sudo systemctl list-unit-files --state=enabled    # o que sobe sozinho
sudo grep -rE '^\s*PermitRootLogin|^\s*PasswordAuthentication' /etc/ssh/sshd_config
# Verificação automática do estado esperado (falha se algo mudou)
sudo test "$(ss -tulpnH | wc -l)" -le 8 && echo 'OK: superfície sob controle'
```

**Referências:**
- CIS Benchmarks — cisecurity.org/cis-benchmarks
- NIST SP 800-123 — Guide to General Server Security
- ANSSI — Recomendações de configuração

## Medir o antes e o depois

Um painel de hardening que ninguém executa não protege nada. A prova de que esta semana valeu é simples: guarde a saída das verificações antes e depois, e compare. O que não se pode medir, não se pode manter.

## Exercício guiado: endureça um servidor e demonstre

1. Parta de uma máquina virtual recém-instalada (ou um contêiner com SSH)
2. Levante o inventário: portas em escuta, serviços habilitados, usuários com shell
3. Aplique as quatro reduções e documente cada mudança com o seu motivo
4. Escreva um script de verificação que devolva OK ou FALHA por cada regra
5. Execute-o antes e depois e guarde as duas saídas
6. Acrescente o script a uma tarefa agendada e defina quem revisa as falhas
7. Feche com uma tabela: mudança, risco que reduz, como se verifica

## Recursos abertos

- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
- [NIST SP 800-123](https://csrc.nist.gov/pubs/sp/800/123/final)
- [OpenSCAP](https://www.open-scap.org/)

---
[Voltar ao programa](../syllabus.md)
