# Guia exato — GitHub + Render para o Barber Lounge Rio

## Antes de começar

O projeto atual é full-stack: React/Vite no frontend, Node.js/Express/tRPC no servidor, Drizzle ORM, banco MySQL/TiDB, login administrativo e armazenamento de mídia. Por isso, o Render precisa ser configurado como **Web Service**, e não como Static Site.

Atenção: o deploy abaixo é inicialmente um **ambiente de teste**. O código atual usa autenticação OAuth e armazenamento do Manus (`BUILT_IN_FORGE_API_URL`/`BUILT_IN_FORGE_API_KEY`). Para uma migração totalmente independente, será necessário trocar essas integrações por autenticação e storage externos. Não altere o DNS do Registro.br antes de o novo endereço funcionar e o painel `/admin` ser testado.

## Parte 1 — Baixar o código do projeto

1. Abra o projeto no Manus.
2. Entre na área **Code**.
3. Escolha **Download all files**.
4. Extraia o arquivo no computador, em uma pasta chamada `barber-lounge-rio`.
5. Não publique o arquivo compactado; o Render precisa receber um repositório Git.

## Parte 2 — Criar o repositório privado no GitHub

1. Acesse https://github.com/new.
2. Em **Repository name**, digite `barber-lounge-rio`.
3. Selecione **Private**.
4. Não marque README, `.gitignore` ou licença nesta etapa; o projeto já possui esses arquivos.
5. Clique em **Create repository**.
6. Copie a URL HTTPS exibida pelo GitHub. Ela será parecida com:

```text
https://github.com/SEU_USUARIO/barber-lounge-rio.git
```

## Parte 3 — Enviar o código para o GitHub

Abra o Terminal ou PowerShell dentro da pasta extraída do projeto. Execute os comandos abaixo, substituindo apenas `SEU_USUARIO` pela sua conta do GitHub:

```bash
cd caminho/para/barber-lounge-rio

git init -b main
git add .
git commit -m "Versao inicial Barber Lounge Rio"
git remote add origin https://github.com/SEU_USUARIO/barber-lounge-rio.git
git remote -v
git push -u origin main
```

Se o Git pedir autenticação, faça login pelo navegador ou use o GitHub Desktop. Não coloque senha ou token diretamente nos comandos.

Depois, atualize a página do repositório no GitHub e confirme que aparecem arquivos como `package.json`, `client/`, `server/`, `drizzle/` e `pnpm-lock.yaml`.

## Parte 4 — Conferir a segurança antes do push

Antes de enviar o código, verifique se não existe um arquivo `.env` ou outro arquivo com segredos:

```bash
git status --short
git ls-files | grep -E '(^|/)(\.env|\.env\.|.*secret.*|.*credential.*)$'
```

O comando final não deve listar `.env` nem arquivos de credenciais. Se listar, pare, remova o arquivo do controle do Git e troque imediatamente qualquer senha ou token que tenha sido exposto.

O GitHub recomenda não adicionar senhas, chaves de API ou strings de banco ao repositório. Esses valores serão cadastrados no painel do Render como variáveis protegidas.

## Parte 5 — Criar o serviço no Render

1. Acesse https://dashboard.render.com.
2. Faça login e abra o Dashboard.
3. Clique em **New → Web Service**.
4. Conecte a conta do GitHub, autorize o Render e selecione o repositório `barber-lounge-rio`.
5. Configure:

| Campo | Valor |
|---|---|
| Name | `barber-lounge-rio` |
| Branch | `main` |
| Language | `Node` |
| Root Directory | deixe vazio, salvo se o projeto estiver dentro de uma subpasta |
| Build Command | `pnpm install --frozen-lockfile && pnpm build` |
| Start Command | `pnpm start` |
| Instance Type | `Free` |
| Auto-Deploy | `On Commit` |

6. Clique em **Create Web Service**.
7. Aguarde o build e abra a URL `onrender.com` apresentada pelo Render.

Se o Render informar que `pnpm` não foi encontrado, tente o Build Command abaixo:

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm build
```

## Parte 6 — Criar o banco MySQL no Aiven

1. Acesse https://aiven.io/free-mysql-database.
2. Crie a instância MySQL gratuita.
3. Aguarde o serviço ficar com status **Running**.
4. Abra as informações de conexão.
5. Copie a string de conexão fornecida pelo Aiven ou monte-a somente conforme a documentação do próprio Aiven.
6. Não publique essa string no GitHub.

O banco atual não deve ser apagado. Primeiro faça uma exportação/backup e depois importe os dados no novo MySQL. A migração de dados precisa ser feita antes de alterar o DNS.

## Parte 7 — Configurar variáveis no Render

No serviço do Render:

1. Abra **Environment**.
2. Clique em **Add Environment Variable**.
3. Cadastre os valores necessários.
4. Escolha **Save, rebuild, and deploy**.

Variáveis essenciais para a primeira tentativa:

| Chave | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | string MySQL do Aiven |
| `JWT_SECRET` | segredo longo e aleatório, criado para esta instalação |
| `OWNER_NAME` | nome do responsável pelo projeto |
| `OWNER_OPEN_ID` | identificador do proprietário, se a autenticação atual for mantida |

O código atual também referencia estas integrações do Manus e elas não podem ser inventadas:

```text
VITE_APP_ID
OAUTH_SERVER_URL
VITE_OAUTH_PORTAL_URL
BUILT_IN_FORGE_API_URL
BUILT_IN_FORGE_API_KEY
VITE_FRONTEND_FORGE_API_URL
VITE_FRONTEND_FORGE_API_KEY
VITE_APP_TITLE
VITE_APP_LOGO
```

Se o objetivo for deixar o site totalmente independente do Manus, não copie esses valores automaticamente. A autenticação OAuth e o armazenamento em `/manus-storage/` deverão ser substituídos por serviços externos compatíveis. Sem essa substituição, a vitrine pode abrir, mas o login do `/admin`, uploads e algumas funções de storage podem falhar.

## Parte 8 — Testar o Render antes do DNS

Use a URL `onrender.com` do serviço e confira:

```text
/
/admin
```

Verifique se:

- o site público abre;
- o servidor não apresenta erro nos logs;
- o login administrativo funciona;
- o banco grava e lê conteúdo;
- o botão do WhatsApp funciona;
- os vídeos e imagens carregam;
- o painel `/admin` salva uma alteração de teste.

Não faça essa alteração de teste em produção sem confirmar primeiro qual banco está conectado. O objetivo é evitar gravar dados no banco errado.

## Parte 9 — Só depois configurar o domínio

Quando o serviço Render estiver estável:

1. No Render, abra **Settings → Custom Domains**.
2. Adicione `barberloungerio.com.br` e, se desejado, `www.barberloungerio.com.br`.
3. Copie os registros DNS exibidos pelo Render.
4. No Registro.br, abra **Domínios → barberloungerio.com.br → DNS → Editar zona**.
5. Cadastre os registros exatamente como o Render mostrar.
6. Preserve `MX`, `SPF`, `DKIM` e `DMARC` do e-mail.
7. Volte ao Render e clique em **Verify**.
8. Aguarde o certificado HTTPS.

Não use o endereço `barbearia-zidkva3f.manus.space` como destino se você estiver migrando para o Render. Esse endereço pertence à hospedagem atual do Manus.

## Referências oficiais

- GitHub — [Adding locally hosted code to GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)
- GitHub — [Pushing commits to a remote repository](https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository)
- Render — [Deploy a Node Express App](https://render.com/docs/deploy-node-express-app)
- Render — [Environment Variables and Secrets](https://render.com/docs/configure-environment-variables)
- Registro.br — [Gerenciar DNS](https://registro.br/ajuda/procedimentos/gerenciar-dns/)

## Resumo

O caminho correto é: **baixar o projeto → criar repositório privado → enviar código sem segredos → conectar ao Render → criar/configurar o banco → substituir integrações específicas do Manus → testar → configurar o DNS por último**.
