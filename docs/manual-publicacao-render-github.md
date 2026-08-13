# Manual Prático: GitHub e Render para o Barber Lounge Rio

Este manual reúne o passo a passo exato para baixar os arquivos atualizados da aplicação, publicá-los em um novo repositório limpo no GitHub (substituindo qualquer projeto antigo sem misturar códigos) e conectá-los a uma hospedagem web gratuita no Render.

## Passo 1: Baixar os arquivos atualizados do projeto
1. No painel de gerenciamento do Manus, abra as opções do projeto e selecione **Download as ZIP** (ou baixe os arquivos da última versão salva no checkpoint).
2. Extraia o arquivo ZIP baixado em uma pasta limpa no seu computador (por exemplo, `C:\Projetos\barber-lounge-rio`).
3. Confirme que dentro dessa pasta existem as pastas `client/`, `server/`, `drizzle/` e o arquivo `package.json`.

## Passo 2: Criar um repositório limpo no GitHub
Para substituir o site antigo que estava no seu GitHub sem arrastar comandos ou prompts incompatíveis:
1. Acesse o [GitHub](https://github.com) e faça login na sua conta.
2. No canto superior direito, clique em **+** e depois em **New repository**.
3. Defina o nome do repositório (ex: `barber-lounge-rio`).
4. Selecione a opção **Private** (Privado) para proteger seu código.
5. **Atenção:** **Não marque** nenhuma opção de adicionar README, arquivo `.gitignore` ou licença. O repositório deve nascer totalmente vazio.
6. Clique em **Create repository**.

## Passo 3: Enviar o código para o GitHub pelo computador
Abra o **GitHub Desktop** ou o terminal/prompt de comando na pasta onde você extraiu os arquivos e envie o projeto com os comandos padrão:

```bash
git init -b main
git add .
git commit -m "Versao oficial Barber Lounge Rio"
git remote add origin https://github.com/SEU_USUARIO/barber-lounge-rio.git
git push -u origin main
```
*(Substitua `SEU_USUARIO` e `barber-lounge-rio` pelo seu usuário e nome real do repositório no GitHub).*

## Passo 4: Conectar o repositório ao Render (Hospedagem Gratuita)
1. Acesse o [Render](https://render.com) (crie uma conta gratuita ou faça login com o próprio GitHub).
2. No painel principal, clique em **New +** e escolha **Web Service**.
3. Conecte sua conta do GitHub e selecione o repositório `barber-lounge-rio`.
4. Preencha os campos de configuração da seguinte forma:
   - **Name:** `barber-lounge-rio`
   - **Region:** Escolha a mais próxima (ex: *Ohio* ou *Oregon*)
   - **Branch:** `main`
   - **Root Directory:** *(deixe em branco)*
   - **Runtime:** `Node`
   - **Build Command:** `pnpm install --frozen-lockfile && pnpm build`
   - **Start Command:** `pnpm start`
   - **Instance Type:** Selecione **Free**

## Passo 5: Configurar o banco de dados e as variáveis de ambiente
Como o projeto utiliza persistência para o painel administrativo e curadoria, é necessário conectar um banco MySQL gratuito (por exemplo, criando uma instância gratuita no Aiven ou usando o banco fornecido pelo provedor):
1. No painel do Render, na aba **Environment** do seu Web Service, clique em **Add Environment Variable**.
2. Adicione os seguintes parâmetros essenciais:
   - `DATABASE_URL`: `mysql://usuario:senha@host:porta/nome_do_banco` (fornecido pelo seu provedor MySQL externo)
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: Insira uma senha segura aleatória para assinar a sessão administrativa.
3. Clique em **Save Changes**. O Render iniciará automaticamente o primeiro build e deploy gratuito.

## Passo 6: Testar e ligar o domínio
1. Quando o deploy terminar, o Render fornecerá uma URL temporária (ex: `https://barber-lounge-rio.onrender.com`).
2. Abra essa URL para testar o site e acesse `/admin` para verificar o painel administrativo.
3. Somente após confirmar que tudo está funcionando perfeitamente, acesse as configurações de domínios no Render, adicione `barbearia.com.br` e copie os registros CNAME/DNS para o **Registro.br**.
