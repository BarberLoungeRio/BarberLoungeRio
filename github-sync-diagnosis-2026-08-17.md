# Diagnóstico de sincronização GitHub/Render

O repositório público `BarberLoungeRio/barberloungerio` está acessível, mas a sessão atual do navegador não está autenticada e o CLI `gh auth status` confirmou que não há login disponível.

O arquivo publicado em `client/src/pages/Home.tsx` ainda contém:

- `heroVideoUrl = .../ZBzopxXcFFpkkqyR.mp4`
- `heroPosterUrl = .../lKrbDjDOgozFykzN.jpg`

Esses são os URLs antigos. O projeto local corrigido usa:

- `heroVideoUrl = .../zUJLBvHNrfTIaAHK.mp4`
- `heroPosterUrl = .../zpxjhSjWfCeXTgze.jpg`

O GitHub mostra o último commit do Home.tsx como `df2dcba` em 16 de agosto de 2026, portanto o Render ainda constrói a versão antiga. A publicação das mudanças exige autenticação do proprietário no GitHub ou upload manual dos arquivos pelo usuário.
