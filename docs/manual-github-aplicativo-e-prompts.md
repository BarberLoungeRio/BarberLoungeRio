# Manual: Como Enviar o Aplicativo e os Prompts juntos para o GitHub

Para manter o seu histórico organizado, você pode armazenar no mesmo repositório do GitHub tanto o código-fonte da aplicação (que roda no Render) quanto os arquivos de texto contendo os **prompts e instruções** que utilizamos para criar e refinar o projeto.

---

## 1. Organização das Pastas no Computador

Antes de enviar para o GitHub, organize os arquivos na pasta do projeto da seguinte forma:

```text
barber-lounge-rio/
├── client/              <-- Código visual do site e painel /admin (React)
├── server/              <-- Servidor backend, rotas e banco (Node.js/Express)
├── drizzle/             <-- Estrutura e migrações do banco de dados
├── docs/
│   └── prompts/         <-- 📂 ONDE VOCÊ GUARDA SEUS PROMPTS E INSTRUÇÕES (.md)
├── package.json         <-- Configurações e dependências do projeto
└── README.md            <-- Apresentação do projeto
```

### Como incluir os prompts:
1. Crie uma pasta chamada `prompts` dentro da pasta `docs/` (ficando `docs/prompts/`).
2. Salve seus prompts em arquivos de texto com extensão `.md` ou `.txt` (por exemplo, `docs/prompts/instrucao-inicial.md` e `docs/prompts/ajustes-videos-e-servicos.md`).
3. O Render **ignora** automaticamente essa pasta de documentos durante o build da aplicação, focando apenas no código do site.

---

## 2. Passo a Passo para Enviar ao GitHub

### Método A: Usando o GitHub Desktop (Mais Fácil)
1. Baixe e instale o [GitHub Desktop](https://desktop.github.com/).
2. Faça login com sua conta do GitHub.
3. Arraste a pasta principal do seu projeto (`barber-lounge-rio`, já contendo o código e a pasta `docs/prompts/`) para dentro do GitHub Desktop (ou clique em **File → Add Local Repository** e selecione a pasta).
4. O aplicativo mostrará todos os arquivos novos e modificados.
5. No campo inferior esquerdo, digite um título (ex: *Versao completa com codigo e prompts*) e clique em **Commit to main**.
6. Clique no botão azul **Publish repository** (ou **Push origin** para enviar para o seu repositório remoto no GitHub).

### Método B: Usando o Terminal / VS Code
Se você usa o Visual Studio Code, abra a pasta do projeto, abra o terminal integrado (`Ctrl + ~`) e execute:

```bash
git add .
git commit -m "Adiciona aplicativo e pasta de prompts"
git push origin main
```

---

## 3. Vantagens desta Organização

- **Tudo em um só lugar:** O código do site e os prompts ficam versionados juntos. Se você quiser alterar algum detalhe no futuro, basta abrir o prompt correspondente, ler o que foi instruído e pedir novos ajustes.
- **Render sem conflito:** O Render continuará fazendo o deploy apenas do site, ignorando os arquivos de texto e documentação na pasta `docs/`.
- **Segurança:** Nenhum arquivo de segredo (`.env`) é enviado para o GitHub, garantindo que suas chaves fiquem protegidas nas configurações do Render.
