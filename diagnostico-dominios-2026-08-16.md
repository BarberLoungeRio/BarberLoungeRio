# Diagnóstico de publicação — 16/08/2026

## Domínio oficial
- URL: https://barberloungerio.com.br/
- Título observado: `Hi there 👋 | barberloungerio`
- Conteúdo observado: página branca simples com o texto `barberloungerio` e `Hi there 👋`.
- Conclusão: o domínio oficial não está apontando para o Web Service Render que serve o aplicativo Barber Lounge Rio; está apontando para outra publicação/placeholder.

## Serviço provisório Render
- URL: https://barberloungerio.onrender.com/
- Título observado: `Barber Lounge Rio · barberloungerio.com.br`
- Conteúdo observado: o React carrega, com navegação `Início`, `Serviços & Vídeos`, `Thrift Store`, `Avaliações`, `Contato` e CTAs de agendamento.
- Conclusão: o serviço Render está respondendo com o aplicativo, mas não necessariamente com os assets de mídia esperados.

## Código local relevante
- `client/src/pages/Home.tsx` usa `heroVideoUrl = /manus-storage/hero-google-photos-clean_dea86347.mp4` e poster em `/manus-storage/`.
- `vite.config.ts` gera o frontend em `dist/public`.
- Em hospedagem Render externa, os caminhos `/manus-storage/` dependem do proxy/storage Manus; se esse proxy não existir ou não tiver os arquivos, o vídeo não aparece.
- O domínio precisa ser removido de qualquer serviço placeholder e adicionado ao Web Service Render correto como domínio personalizado.

## Verificação após o commit `eef615c` — 17/08/2026

A API pública do Render agora responde HTTP 200 com `content: 90`, `services: 3`, `videos: 19`, `thriftStore: 23` e `blocks: 0`. O primeiro item contém uma URL CDN HTTP 200, portanto o fallback do servidor chegou ao Render.

Entretanto, ao abrir `https://barberloungerio.onrender.com/#thrift`, o HTML visível mostra o título `Curadoria consciente` e o texto da Thrift Store, mas não mostra elementos de imagem da galeria antes da seção `Barber Lounge em movimento`. A inspeção do navegador confirmou `itemCount: 0`, `imageCount: 0` e `.thrift-track` com largura 0, embora um fetch executado no mesmo navegador retorne `thriftStore: 23`.

A correção local adicionou o fallback direto das 23 URLs CDN no próprio `Home.tsx`, usa os itens retornados quando houver dados e os itens embutidos quando a lista vier vazia, além de carregar os seis primeiros itens sem lazy loading. O build, testes e typecheck passaram. A captura full-page local confirmou visualmente a faixa com fotos, captions e espaçamento entre os cards. Portanto, a próxima publicação precisa servir o bundle do novo `Home.tsx`; o problema restante é o bundle/client publicado no Render estar desatualizado ou não ter sido redeployado após a correção.

## Diagnóstico adicional — 17/08/2026

A consulta direta ao endpoint público do Render `https://barberloungerio.onrender.com/api/trpc/site.publicData?batch=1&input=%7B%7D` respondeu HTTP 200, porém retornou `content: []`, `services: []`, `videos: []`, `thriftStore: []` e `blocks: []`. Isso explica por que a página publicada não mostra as fotos: a API estava devolvendo arrays vazios quando o banco externo não estava disponível ou ainda não havia sido populado.

O domínio oficial `https://barberloungerio.com.br/` respondeu HTTP 200, mas o HTML retornado é uma página GitHub Pages/Jekyll com título `Hi there 👋 | barberloungerio`, e não o aplicativo do Render. O domínio ainda não está apontado para o Web Service correto.

Os três URLs CDN de teste das fotos da Thrift Store responderam HTTP 200 com `image/jpeg`, confirmando que os arquivos públicos estão acessíveis:

- `https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/dSrCQFfUPBhNofMK.jpg`
- `https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/VtnoFrxCEkMIbojc.jpg`
- `https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/kqeTVmqudmEdrEgp.jpg`

## Comparação do vídeo
- `Downloads/barber_lounge_rio_site.mp4` foi analisado e corresponde a uma vinheta de abertura: logo 3D/brasão Barber Lounge, tesouras douradas, poste de barbeiro, fundo escuro com brilho vermelho/laranja e movimento de zoom.
- O código atual local não usa esse arquivo diretamente; usa `/manus-storage/hero-google-photos-clean_dea86347.mp4`.
- Conclusão: para o Render externo mostrar o vídeo de abertura, ele precisa usar uma URL pública acessível externamente ou um arquivo versionado no próprio repositório/serviço. O caminho `/manus-storage/` não deve ser tratado como arquivo local do Render.

## Divergência visual
- O conteúdo textual observado no Render provisório (`BL`, `Serviços & Vídeos`, `DE JANEIRO`) não corresponde ao `Home.tsx` local atual (`BARBER LOUNGE RIO`, `Serviços`, `Centro · Rio de Janeiro`).
- Conclusão: o Render está conectado a um commit/repositório diferente ou a uma versão antiga do código, além do problema de mídia.
