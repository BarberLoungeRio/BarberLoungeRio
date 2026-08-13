# Validação dos ajustes da vitrine — 13/08/2026

## Alterações confirmadas

O primeiro vídeo do Hero agora usa o próprio vídeo com `object-fit: contain`, preservando a proporção original, enquanto o poster é usado como fundo ampliado e desfocado nas áreas laterais. Assim, o vídeo não é esticado nem deformado e as laterais não ficam visualmente vazias quando a proporção da tela for diferente.

O segundo vídeo, que era usado como fundo da seção Conceito, foi removido. A seção permanece limpa, com fundo preto, texto e os três valores da marca.

O item do rodapé que apontava para “Drops TV & Shorts” foi substituído por “Serviços”, mantendo o link para a seção `#servicos`.

## Validação técnica

- TypeScript sem erros após a correção do JSX.
- 3 arquivos de teste aprovados; 1 teste de integração do Instagram permanece ignorado conforme a configuração existente.
- Build de produção concluído com sucesso.
- Captura desktop realizada em 1280×720.
- Captura mobile realizada em 390×844, em página completa.
- No mobile, o menu permanece compacto e a página continua sem overflow horizontal aparente.
- A seção Conceito aparece limpa em desktop e mobile.
- O grid de vídeos e o rodapé continuam presentes.

## Observação

O build exibiu apenas avisos existentes sobre configuração do pnpm, atualização do pacote baseline-browser-mapping e tamanho de bundle; não houve falha de compilação ou teste.
