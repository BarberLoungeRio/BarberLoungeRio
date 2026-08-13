# Pacote de Prompts Prontos para Uso no GitHub e Copilot

Este documento reúne os prompts detalhados para orientar futuras manutenções, melhorias ou correções no código do aplicativo **Barber Lounge Rio** utilizando IA (como GitHub Copilot ou assistentes de desenvolvimento).

---

## 1. Prompt para Adicionar um Novo Grupo de Campos Editáveis no Painel Admin
**Onde usar:** No chat do GitHub Copilot ou ao pedir uma alteração em `server/db.ts` e `client/src/pages/Admin.tsx`.

```text
Por favor, adicione novos campos editáveis ao painel administrativo do Barber Lounge Rio (em server/db.ts e client/src/pages/Admin.tsx) para controlar [DESCREVER OS NOVOS CAMPOS, EX: links de redes sociais adicionais ou textos da seção de eventos]. Os campos devem ser persistidos na tabela site_content, aparecer organizados por seção no painel /admin com suporte a input de texto ou textarea, e ser consumidos de forma dinâmica na página Home.tsx com fallback seguro.
```

---

## 2. Prompt para Ajustar Estilos, Cores ou o Vídeo do Hero
**Onde usar:** Ao alterar a identidade visual ou o comportamento do vídeo principal.

```text
Atue como Engenheiro de Front-end Sênior. Preciso ajustar a seção Hero do site Barber Lounge Rio em client/src/pages/Home.tsx. [DESCREVER A MUDANÇA, EX: alterar a opacidade do overlay do vídeo de fundo, ajustar o espaçamento dos botões do WhatsApp ou refinar o alinhamento responsivo em celulares]. Garanta que o vídeo permaneça em autoplay, muted, playsInline e sem distorcer a proporção original.
```

---

## 3. Prompt para Criar ou Modificar Migrações de Banco de Dados (Drizzle ORM)
**Onde usar:** Ao adicionar uma nova tabela ou alterar colunas existentes no projeto.

```text
Preciso atualizar o schema do banco de dados MySQL em drizzle/schema.ts para o projeto Barber Lounge Rio. [DESCREVER A NOVA TABELA OU COLUNA]. Por favor, mostre os ajustes necessários no arquivo schema.ts, oriente como executar a geração da migração via drizzle-kit e como aplicar a alteração de forma segura sem perder dados existentes nas tabelas de conteúdo, serviços, vídeos e Thrift Store.
```

---

## 4. Prompt para Configurar Build, Dependências e Execução no Render
**Onde usar:** Ao solucionar falhas de compilação ou ajustar o comando de deploy no Render.

```text
Estou publicando o Barber Lounge Rio como um Web Service Node.js no Render. O comando de build configurado é 'pnpm install --frozen-lockfile && pnpm build' e o start é 'pnpm start'. Verifique se há alguma otimização necessária no package.json, vite.config.ts ou server/_core/index.ts para garantir que o build de produção seja executado com sucesso e sirva corretamente os arquivos estáticos gerados em dist/public.
```

---

## 5. Prompt para Executar e Validar Testes Automatizados (Vitest)
**Onde usar:** Antes de fazer commit de novas alterações no GitHub.

```text
Por favor, crie ou atualize os testes unitários e de integração em server/content.routes.test.ts para cobrir [DESCREVER A NOVA FUNCIONALIDADE OU CORREÇÃO]. Certifique-se de que os testes validem contratos tRPC públicos e protegidos (admin), e explique como executar a validação local com 'pnpm test -- --run'.
```
