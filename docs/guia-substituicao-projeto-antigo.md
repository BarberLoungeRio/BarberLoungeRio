# Guia de substituição do projeto antigo pelo Barber Lounge Rio

## Decisão principal

Como o repositório antigo contém arquivos, comandos e prompts de outro site, a opção mais segura é **não misturar os dois projetos na mesma pasta sem planejamento**. O Barber Lounge Rio já tem sua própria estrutura, dependências, banco, painel administrativo e configurações. Misturar `package.json`, `client/`, `server/`, `drizzle/` ou comandos de dois projetos pode quebrar o build e o banco.

A recomendação é criar primeiro um backup do projeto antigo e depois substituir o conteúdo por uma cópia limpa do Barber Lounge Rio. O repositório antigo continuará preservado em uma branch ou em um segundo repositório.

## Quatro opções possíveis

| Opção | Como funciona | Segurança | Quando usar |
|---|---|---:|---|
| **A. Novo repositório** | Criar `barber-lounge-rio` separado e deixar o projeto antigo intacto | Muito alta | Recomendação para quem quer evitar qualquer conflito |
| **B. Nova branch no repositório antigo** | Criar uma branch `barber-lounge-rio` e substituir os arquivos somente nela | Alta | Quando você quer manter tudo dentro do mesmo repositório |
| **C. Substituição da branch `main`** | Fazer backup/tag e trocar o conteúdo principal pelo novo projeto | Média | Quando o endereço do repositório antigo precisa permanecer o mesmo |
| **D. Mesclar arquivos manualmente** | Copiar arquivos do novo projeto por cima do antigo | Baixa | Evitar, salvo quando alguém técnico revisar cada conflito |

## Opção A — Novo repositório, recomendada

### 1. Fazer backup do projeto antigo

No GitHub, abra o repositório antigo e entre em **Settings → General**. Se disponível, use **Export repository** ou baixe o código como ZIP. Guarde o arquivo em uma pasta separada, por exemplo:

```text
backup-site-antigo-2026-08-13.zip
```

Se o projeto antigo tiver banco de dados, imagens ou arquivos fora do GitHub, faça backup desses itens separadamente. O download do código não substitui o backup do banco.

### 2. Criar um repositório novo

1. Acesse https://github.com/new.
2. Digite `barber-lounge-rio`.
3. Selecione **Private**.
4. Não marque README, licença ou `.gitignore` inicial.
5. Clique em **Create repository**.

### 3. Baixar o projeto atual do Manus

1. Abra o projeto Barber Lounge Rio no Manus.
2. Entre em **Code**.
3. Clique em **Download all files**.
4. Extraia o ZIP para uma pasta nova chamada `barber-lounge-rio`.
5. Não copie arquivos do projeto antigo para dentro dessa pasta, exceto documentos que você tenha decidido preservar como backup.

### 4. Publicar o novo projeto com GitHub Desktop

1. Instale o [GitHub Desktop](https://desktop.github.com/).
2. Abra o programa e faça login na sua conta GitHub.
3. Clique em **File → Add local repository**.
4. Selecione a pasta limpa `barber-lounge-rio`.
5. Se aparecer a opção **Create a repository**, confirme a criação local.
6. Confira a lista de arquivos alterados.
7. No campo de resumo, escreva `Versao inicial Barber Lounge Rio`.
8. Clique em **Commit to main**.
9. Clique em **Publish repository**.
10. Marque **Keep this code private**.
11. Confirme o nome `barber-lounge-rio` e clique em **Publish repository**.

Ao terminar, o GitHub Desktop abrirá o repositório online. O código novo estará separado do projeto antigo.

## Opção B — Nova branch no repositório antigo

Use esta opção somente se você quiser manter o mesmo repositório e souber qual repositório antigo está correto.

1. Abra o repositório antigo no GitHub Desktop.
2. Clique em **Current branch → New branch**.
3. Dê o nome `barber-lounge-rio`.
4. Selecione a origem `main` ou a branch atualmente estável.
5. Clique em **Create branch**.
6. Abra a pasta do repositório no computador.
7. Faça uma cópia externa da pasta antes de apagar qualquer arquivo.
8. Remova os arquivos antigos da pasta, preservando apenas `.git`.
9. Copie o conteúdo limpo do ZIP do Barber Lounge Rio para essa pasta.
10. Não copie `.env`, `node_modules`, `dist` ou credenciais antigas.
11. No GitHub Desktop, confira os arquivos alterados.
12. Faça o commit `Substitui projeto antigo pelo Barber Lounge Rio`.
13. Clique em **Push origin**.

O projeto antigo continuará disponível na branch `main`, enquanto o novo estará na branch `barber-lounge-rio`. No Render, selecione a branch nova somente depois de testá-la.

## Opção C — Substituir a branch `main` mantendo o mesmo endereço

Esta opção altera o projeto principal. Faça isso apenas depois de confirmar que o backup existe.

1. No GitHub Desktop, crie uma branch de backup chamada:

```text
backup-projeto-antigo-2026-08-13
```

2. Faça commit e push dessa branch.
3. Crie outra branch chamada `barber-lounge-rio`.
4. Troque os arquivos da pasta pelo projeto limpo.
5. Faça commit e push da branch nova.
6. Teste a branch nova localmente.
7. No GitHub, abra **Settings → Branches** e defina a branch nova como principal somente se necessário.
8. No Render, selecione `main` depois que ela tiver sido atualizada.

Não apague a branch de backup. Ela é o caminho de retorno caso o novo projeto falhe.

## Opção D — Editar diretamente pelo navegador

O GitHub permite editar arquivos pequenos diretamente pelo navegador, mas não é a melhor forma de substituir um aplicativo completo. Para arquivos grandes, centenas de arquivos ou mudanças em dependências, use GitHub Desktop.

No navegador, abra o arquivo no GitHub, clique no ícone de lápis, faça a alteração e selecione **Commit changes**. Esse método é adequado para ajustes pequenos em README, textos simples ou documentação; não é recomendado para trocar todo `client/`, `server/` ou `package.json`.

## O que substituir e o que não copiar

| Item | Procedimento |
|---|---|
| `client/` | Substituir pelo diretório do Barber Lounge Rio |
| `server/` | Substituir pelo diretório do Barber Lounge Rio |
| `drizzle/` | Substituir, mas fazer backup do banco antes de aplicar migrações |
| `shared/` | Substituir pelo novo projeto |
| `package.json` | Substituir; ele define os scripts e dependências corretos |
| `pnpm-lock.yaml` | Substituir junto com `package.json` |
| `vite.config.ts`, `tsconfig.json`, `vitest.config.ts` | Substituir pelo novo projeto |
| `README.md` | Pode substituir ou manter uma cópia antiga separada |
| `.env` | Nunca copiar para o GitHub |
| `node_modules/` | Nunca enviar ao GitHub |
| `dist/` | Não enviar, salvo uma necessidade específica de hospedagem |
| senhas, tokens e chaves | Nunca enviar ao GitHub |
| banco de dados | Não é substituído pelo simples upload do código; precisa de backup e migração separados |
| imagens e vídeos | Confirmar se são URLs persistentes; não depender de arquivos locais ignorados pelo Git |

## Editar o código no computador com VS Code

1. Baixe o [Visual Studio Code](https://code.visualstudio.com/).
2. Instale o GitHub Desktop e faça login.
3. No GitHub Desktop, abra **Repository → Open in Visual Studio Code**.
4. No VS Code, edite somente os arquivos necessários.
5. Não altere `package.json` ou `drizzle/schema.ts` sem compreender o impacto.
6. Faça as alterações no painel **Source Control**.
7. Revise os arquivos modificados.
8. Escreva uma mensagem de commit clara.
9. Clique em **Commit** e depois em **Sync Changes**.

Para o uso diário, a edição de conteúdo deve continuar sendo feita no painel da aplicação:

```text
/admin
```

O VS Code é para alterar o sistema, layout e funcionalidades. O painel `/admin` é para alterar textos, vídeos, fotos, cores e conteúdo sem editar código.

## Fluxo correto para cada alteração

A rotina segura é: abrir o projeto no VS Code, alterar uma coisa por vez, salvar, executar os testes locais, revisar o preview, fazer commit no GitHub e só então permitir que o Render publique a nova versão.

Para adicionar um novo vídeo, use o painel `/admin` em vez de colar o link diretamente no código. Para alterar a estrutura da página, use o VS Code. Para alterar o domínio, use o painel da hospedagem e depois o DNS do Registro.br.

## Segurança obrigatória

Nunca publique no GitHub arquivos `.env`, senhas, tokens de Instagram, credenciais de banco, `JWT_SECRET`, chaves de storage ou credenciais OAuth. O GitHub alerta que segredos publicados podem ser detectados e bloqueados pelo push protection; se um segredo for exposto, ele deve ser revogado e substituído imediatamente.

## Recomendação final

Para o seu caso, use esta sequência:

```text
1. Criar backup do projeto antigo.
2. Criar o repositório privado barber-lounge-rio.
3. Baixar o ZIP atual do Barber Lounge Rio.
4. Abrir a pasta limpa no GitHub Desktop.
5. Publicar o novo repositório.
6. Abrir no VS Code para alterações técnicas.
7. Usar /admin para conteúdo do dia a dia.
8. Conectar o novo repositório ao Render somente depois do teste.
9. Configurar o domínio por último.
```

Essa sequência evita misturar comandos e dependências do site antigo com o aplicativo Barber Lounge Rio.

## Referências

- [GitHub — Adding locally hosted code](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)
- [GitHub Desktop — Adding an existing project](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-an-existing-project-to-github-desktop)
- [GitHub — Managing branches](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-branches)
- [Visual Studio Code — Source Control](https://code.visualstudio.com/docs/sourcecontrol/overview)
- [Render — Deploy Node Express App](https://render.com/docs/deploy-node-express-app)

Autor: Manus AI
