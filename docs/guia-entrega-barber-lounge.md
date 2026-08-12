# Guia Definitivo · Barber Lounge Rio

O aplicativo web e sistema de gestão da **Barber Lounge Rio** foi desenvolvido e estruturado com acabamento sofisticado em preto profundo e detalhes em dourado e marfim. O projeto integra o vídeo de abertura `ARTEPARASITE.mp4` enviado, a galeria de YouTube Shorts, o feed do Instagram, o painel administrativo protegido e as orientações para o domínio no Registro.br.

---

## 1. Arquitetura da Solução e Tecnologias

O portal foi construído em arquitetura moderna com **React 19**, **Tailwind CSS**, **Express**, **tRPC** e **Banco de Dados Relacional (MySQL/TiDB)** via Drizzle ORM. 

- **Persistência em Banco de Dados:** Textos, cores da marca, serviços e os links do YouTube Shorts são armazenados em tabelas dedicadas (`site_content`, `services`, `youtube_videos`).
- **Painel Administrativo Protegido:** O acesso à rota `/admin` é restrito à conta administradora autenticada, com formulários visuais para gerenciar todo o conteúdo da vitrine.
- **Multimídia Otimizada:** O arquivo `ARTEPARASITE.mp4` foi processado e armazenado com segurança no sistema, servindo como a peça central de impacto no Hero.
- **Galeria de YouTube Shorts:** Exibe os 19 vídeos fornecidos em autoplay sem som (`muted`), com botões de fallback e controles acessíveis para o visitante.

---

## 2. Guia de Administração Visual (Sem Código)

O painel administrativo em `/admin` permite alterar qualquer elemento da vitrine em tempo real:

1. **Acesso:** Faça login na plataforma com sua conta administrativa. O painel exibirá as abas **Conteúdo e Cores**, **Serviços** e **Drops TV**.
2. **Conteúdo e Identidade Visual:** Edite o título do Hero, os textos institucionais, os números de destaque, os telefones de contato, o endereço e as cores da marca (cor principal e tom de destaque) sem alterar o código-fonte. As alterações entram em vigor imediatamente após clicar em **Salvar alterações**.
3. **Gerenciamento de Serviços:** Adicione, edite ou remova os rituais de atendimento, ajustando título, descrição, valor, etiqueta e imagem por URL.
4. **Gerenciamento dos YouTube Shorts (Drops TV):** Adicione novos vídeos mensais informando a URL do Short, título e descrição. Utilize as setas de ordenação para reorganizar a vitrine ou edite itens existentes.

---

## 3. Hospedagem Gratuita e Conexão de Domínio Próprio (`barbearia.com.br`)

O projeto está pronto para ser hospedado na infraestrutura automatizada de nuvem, aceitando o domínio registrado no **Registro.br** (`barbearia.com.br`).

### Passo a passo para configurar o DNS no Registro.br:

1. **Publicação Inicial:** No painel de gerenciamento do projeto, clique no botão **Publish** para gerar a versão de produção.
2. **Configuração de Domínio:** Em **Settings → Domains**, informe o seu domínio personalizado `barbearia.com.br` (e/ou `www.barbearia.com.br`). O sistema exibirá o destino DNS correspondente (geralmente um registro CNAME ou A).
3. **Ajuste na Zona DNS do Registro.br:**
   - Acesse [registro.br](https://registro.br), entre com suas credenciais e clique em **Domínios → barbearia.com.br → DNS → Editar zona**.
   - Insira o registro fornecido pela plataforma de hospedagem (por exemplo, apontando o CNAME de `www` para o destino indicado).
   - Para o domínio raiz (`barbearia.com.br`), configure o redirecionamento ou o registro IP correspondente orientado no painel.
4. **Verificação de SSL:** Após salvar os registros no Registro.br, clique em **Verify / Validar** no painel de domínios. O certificado de segurança HTTPS será emitido automaticamente.
5. **Teste Final:** Acesse `https://barbearia.com.br` e `https://www.barbearia.com.br` para confirmar que a vitrine carrega com segurança e velocidade.

---

## Referências

- Documentação Oficial do Registro.br: [Gerenciamento de DNS](https://registro.br/ajuda/procedimentos/gerenciar-dns/) [1]
- Padrões de embeds e otimização de mídia: [YouTube Embedded Players](https://developers.google.com/youtube/player_parameters) [2]
- Arquitetura tRPC e React: [tRPC Documentation](https://trpc.io/docs) [3]

*(Documento compilado por **Manus AI** para a Barber Lounge Rio).*
