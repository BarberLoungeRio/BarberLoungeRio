# Validação local de compatibilidade com GitHub — 13/08/2026

O projeto está em um repositório Git válido (`git rev-parse --is-inside-work-tree` retornou `true`) na branch `main`. Os arquivos essenciais `package.json`, `pnpm-lock.yaml`, `client/src/pages/Home.tsx`, `server/routers.ts` e `drizzle/schema.ts` estão rastreados pelo Git. A pasta `node_modules` está ignorada, evitando o envio das dependências instaladas.

O projeto mantém scripts de instalação, typecheck, testes e build no `package.json`, portanto pode ser publicado em um repositório GitHub e conectado a um serviço de deploy que execute os comandos documentados. Esta é uma validação local de compatibilidade; ela não substitui um push para uma conta GitHub do usuário, que depende de autorização e do repositório que ele escolher.
