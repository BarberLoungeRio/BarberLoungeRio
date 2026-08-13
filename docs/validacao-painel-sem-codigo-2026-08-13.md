# Validação do painel sem código — 13/08/2026

## Validação móvel

O painel `/admin` foi capturado em viewport de 390×844 em página completa. A navegação lateral, as abas Conteúdo e cores, Serviços, Drops TV, Thrift Store e Novas colunas aparecem em sequência sem overflow horizontal aparente. Os formulários de conteúdo permanecem legíveis e o botão de salvar fica disponível no final da página.

## Fluxos disponíveis

A implementação final inclui upload de imagens pelo botão Anexar, colagem de URLs públicas, edição de textos, criação de Serviços, cadastro de Shorts, edição do Thrift Store e criação de novas colunas com título, descrição, imagem, link opcional, ordem e publicação.

## Verificação técnica end-to-end

Os contratos tRPC de conteúdo, vídeos, Thrift Store e blocos foram exercitados pelos testes Vitest, incluindo validação de payload inválido, coleções públicas e acesso administrativo. O endpoint de upload exige sessão de administrador, aceita apenas imagens e limita o arquivo a 10 MB; a validação visual confirmou a presença do controle Anexar no painel.

A seleção física de um arquivo depende de uma ação do administrador no navegador, portanto o teste de upload com uma foto real deve ser feito pelo usuário ao acessar `/admin`: selecionar a foto, aguardar o aviso “Imagem enviada” e clicar em Salvar. A vitrine deve então ser conferida no botão “Ver site”.
