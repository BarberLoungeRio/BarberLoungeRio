# Validação do vídeo do Hero — 2026-08-13

## Alterações aplicadas

O vídeo original de 16,4 segundos foi recortado para 13,966667 segundos, antes do encerramento que começa em 00:14 e contém a marca do CapCut. A nova versão H.264 sem áudio foi publicada como `/manus-storage/hero-google-photos-clean_dea86347.mp4`, com poster `/manus-storage/hero-google-photos-clean-poster_ac66263e.jpg`. O Hero foi configurado com `object-fit: cover` e breakpoint mobile.

## Resultado das capturas

A estrutura responsiva do Hero ocupou corretamente a área desktop e mobile, sem distorção aparente dos elementos de interface. Entretanto, nas duas capturas o fundo do vídeo/poster apareceu preto, sem mostrar a imagem do vídeo. Isso precisa ser investigado antes do checkpoint: pode ser atraso de carregamento, indisponibilidade do novo caminho no preview ou comportamento do vídeo na captura.

## Próxima ação

Verificar rede e acessibilidade dos dois arquivos publicados, adicionar fallback visual robusto no container e repetir as capturas desktop/mobile antes de concluir a correção.

## Análise adicional

O poster publicado contém um quadro limpo e legível. A extração do vídeo em 00:00.2 mostra que o arquivo começa praticamente preto, o que explica a captura inicial escura quando o autoplay começa no primeiro frame. A correção deve manter o poster visível até a reprodução estar pronta ou iniciar o vídeo após um pequeno deslocamento temporal, evitando exibir o fade-in preto.


Os frames extraídos indicam que o vídeo fica quase preto em 00:00.2, ainda muito escuro em 00:00.5 e apresenta imagem reconhecível em aproximadamente 00:01.0. O Hero deve manter o poster até o vídeo estar pronto e iniciar a reprodução a partir de cerca de 1 segundo para não exibir o fade-in escuro como primeira imagem.


## Validação após correção

Nas capturas finais, o poster aparece enquanto o vídeo carrega e o Hero mostra a imagem do vídeo no desktop e no celular. O enquadramento usa `object-fit: cover`, preserva a proporção e ocupa a área da página; no celular há recorte proporcional das laterais, sem esticar a imagem. O novo arquivo tem 13,966667 segundos e termina antes do encerramento do CapCut.

