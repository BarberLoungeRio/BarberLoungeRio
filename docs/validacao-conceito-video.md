# Validação da seção Conceito com vídeo de fundo

A seção Conceito foi revisada em dois tamanhos de viewport após a publicação do vídeo convertido para MP4 H.264. No desktop, em 1280 × 720, o vídeo ocupa toda a área da seção com `object-fit: cover`, permanece atrás do conteúdo e não altera a estrutura dos três pilares. O overlay em degradê escuro mantém o título, o texto introdutório, os números e as descrições legíveis sobre as linhas claras do vídeo.

No mobile, em 390 × 844, o vídeo continua preenchendo a largura da seção sem criar rolagem horizontal. O enquadramento é centralizado, os textos quebram em linhas adequadas e os três pilares passam para uma coluna vertical sem sobreposição. O overlay continua suficientemente escuro para preservar o contraste. A reprodução usa `autoPlay`, `loop`, `muted` e `playsInline`; em dispositivos com redução de movimento, o vídeo é ocultado e a seção usa um fundo escuro de fallback.

O arquivo original recebido pelo Google Photos era HEVC em contêiner MOV, com 1920 × 1080, 24 fps e 39 segundos. Para compatibilidade com navegadores, foi publicado no armazenamento do projeto um MP4 H.264 sem áudio em `/manus-storage/conceito-fundo_e5a6b4fa.mp4`. O conteúdo visual foi preservado; a conversão removeu somente a faixa de áudio porque a solicitação exige fundo sem som.
