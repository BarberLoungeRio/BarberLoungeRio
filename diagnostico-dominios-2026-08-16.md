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

## Comparação do vídeo
- `Downloads/barber_lounge_rio_site.mp4` foi analisado e corresponde a uma vinheta de abertura: logo 3D/brasão Barber Lounge, tesouras douradas, poste de barbeiro, fundo escuro com brilho vermelho/laranja e movimento de zoom.
- O código atual local não usa esse arquivo diretamente; usa `/manus-storage/hero-google-photos-clean_dea86347.mp4`.
- Conclusão: para o Render externo mostrar o vídeo de abertura, ele precisa usar uma URL pública acessível externamente ou um arquivo versionado no próprio repositório/serviço. O caminho `/manus-storage/` não deve ser tratado como arquivo local do Render.

## Divergência visual
- O conteúdo textual observado no Render provisório (`BL`, `Serviços & Vídeos`, `DE JANEIRO`) não corresponde ao `Home.tsx` local atual (`BARBER LOUNGE RIO`, `Serviços`, `Centro · Rio de Janeiro`).
- Conclusão: o Render está conectado a um commit/repositório diferente ou a uma versão antiga do código, além do problema de mídia.
