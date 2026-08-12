# Project TODO

- [x] Modelar banco de dados para conteúdo editável, serviços, vídeos YouTube Shorts, configurações de marca e integrações
- [x] Criar migração SQL e sincronizar o schema com o banco de dados
- [x] Implementar API pública de conteúdo e API administrativa protegida por role admin
- [x] Implementar CRUD visual de blocos de conteúdo, serviços, cores e configurações do site
- [x] Implementar CRUD e reordenação dos 19 vídeos YouTube Shorts no painel admin
- [x] Localizar e publicar o arquivo ARTEPARASITE.mp4 fornecido para o Hero
- [x] Implementar site público premium responsivo com Hero em vídeo, Serviços, Shorts, Instagram e Contato
- [x] Implementar autoplay muted e fallback acessível para vídeos/embeds do YouTube Shorts
- [x] Integrar Instagram de forma segura e documentar requisitos de credenciais/token
- [x] Implementar painel administrativo protegido por login
- [x] Implementar página técnica com instruções de DNS específicas para Registro.br e barbearia.com.br
- [x] Criar testes Vitest para autenticação, autorização admin, conteúdo e vídeos
- [x] Executar typecheck, testes e validação visual responsiva
- [x] Criar checkpoint final antes da entrega
- [x] Entregar guia de administração, hospedagem e domínio ao usuário

## Histórico de solicitações

- [x] Solicitação inicial: criar portal público premium com painel admin, vídeos, Instagram, contato e DNS
- [x] Solicitação atualizada: usar ARTEPARASITE.mp4 exatamente como enviado, incluir 19 Shorts com autoplay muted e administração mensal

## Ajustes finais identificados na validação

- [x] Adicionar edição de vídeos existentes no painel admin (URL, título, descrição, etiqueta e ordem/ativo)
- [x] Implementar fallback público acessível para Shorts quando o embed/autoplay falhar, com link visível para o YouTube
- [x] Documentar no projeto os limites da integração Instagram na aplicação web e os requisitos de credenciais/token para uma integração programática
- [x] Criar testes Vitest para leitura/atualização de conteúdo e criação/atualização/remoção/reordenação de vídeos
- [x] Entregar ao usuário o guia consolidado de administração, hospedagem e domínio antes de marcar o item de entrega como concluído

## Última rodada de validação

- [x] Expor no formulário de edição dos Shorts os campos de ordem e ativo, conectados à mutation de atualização
- [x] Tornar explícito o fallback de autoplay bloqueado com overlay reproduzir, link para o YouTube e controles acessíveis
- [x] Criar testes Vitest para as mutations admin de conteúdo e Shorts (create, update, delete e reorder)

## Adequação ao layout exato de barber-lounge-rio (4).html

- [x] Solicitar ou receber o conteúdo do arquivo HTML de referência fornecido pelo usuário
- [x] Adaptar a interface pública para incorporar exatamente o CSS, tipografia e estrutura HTML do arquivo de referência
- [x] Preservar o Hero com ARTEPARASITE.mp4, os 19 Shorts com autoplay muted, a seção de serviços editáveis e o painel administrativo protegido
- [x] Validar visualmente com captura de tela e salvar checkpoint final
- [x] Entregar o resultado atualizado ao usuário

## Ajustes solicitados pelo usuário (Instagram e Edição Visual Simplificada)

- [x] Implementar integração direta com o perfil e posts recentes do Instagram na seção "Barber Lounge em movimento" com links clicáveis reais
- [x] Atualizar o painel administrativo para um modo de edição visual direto por clique ("click-to-edit") e colagem rápida de links de vídeos
- [x] Criar guia claro detalhando onde o site será hospedado de forma gratuita, como usar o painel sem código no dia a dia e como conectar o domínio do Registro.br

## Continuidade sem dependência da API do Facebook

- [x] Ignorar a dependência da Graph API da Meta conforme solicitado pelo usuário
- [x] Refinar a seção do Instagram para garantir que o feed exiba posts clicáveis direcionados ao perfil real da barbearia
- [x] Atualizar o painel administrativo para edição direta e simples de textos, imagens e vídeos
- [x] Elaborar o guia claro de hospedagem gratuita e operação diária (sem código)

- [x] Remover da vitrine qualquer avaliação, nota ou depoimento demonstrativo não conectado a uma fonte real e manter somente o link para avaliações verificáveis

## Solicitações recentes do usuário

- [x] Remover a frase "Alta barbearia em cada detalhe" e as fotos associadas
- [x] Retirar todas as referências ao "Up Spa" no site e textos institucionais
- [x] Atualizar o nome da marca para "BARBER LOUNGE RIO" (incluindo "RIO" no cabeçalho e rodapé)
- [x] Conectar o painel do Google Maps na seção de avaliações com link direto e transparente
- [x] Processar e publicar as fotos enviadas para a seção Thrift Store
- [x] Adicionar suporte a descrições editáveis para cada foto da Thrift Store no painel administrativo
- [x] Publicar a nova logo enviada pelo usuário e substituir a identidade antiga no cabeçalho e rodapé
- [x] Eliminar a seção de Serviços e suas fotos da vitrine pública, mantendo apenas Drops TV, Thrift Store, Instagram e Avaliações
- [x] Conectar o link oficial do Google Maps compartilhado pelo usuário na seção de avaliações
- [x] Salvar checkpoint atualizado e entregar o resultado ao usuário

- [x] Remover as imagens externas antigas da grade do Instagram e manter somente o perfil oficial clicável enquanto a Graph API estiver pausada
- [x] Atualizar no banco e na fonte padrão os textos antigos do Hero para BARBER LOUNGE RIO
- [x] Revisar visualmente a galeria Thrift Store e o cartão do Instagram após as alterações

## Melhorias solicitadas pelo usuário (WhatsApp, Domínio e Fluxo Mensal)

- [x] Implementar botão flutuante e chamadas de ação do WhatsApp com mensagem pré-preenchida para agendamento
- [x] Atualizar o painel e o guia de domínio para facilitar a configuração do barbearia.com.br
- [x] Aprimorar a experiência de adição e reordenação mensal de vídeos no Drops TV
- [x] Validar com testes, salvar checkpoint final e entregar os resultados completos

## Vídeo de fundo na seção Conceito

- [x] Inspecionar e incorporar o vídeo fornecido pelo Google Fotos como fundo silencioso e em loop na seção Conceito
- [x] Validar a legibilidade dos textos e o comportamento responsivo do vídeo de fundo
- [x] Testar, salvar checkpoint e entregar o resultado ao usuário
- [x] Validar a seção Conceito com o vídeo de fundo em viewport móvel e desktop, confirmando enquadramento e legibilidade
- [x] Registrar a validação textual objetiva do vídeo da seção Conceito em desktop e mobile antes do checkpoint

## Substituição do vídeo do Hero pela melhor qualidade

- [x] Converter o arquivo de alta qualidade obtido do Google Fotos para otimizar o carregamento no Hero
- [x] Publicar a nova versão de alta qualidade no armazenamento do projeto
- [x] Atualizar o Hero no Home.tsx para usar o novo arquivo de vídeo
- [x] Testar, salvar checkpoint e entregar o resultado ao usuário

## Substituição definitiva do vídeo do Hero pelo novo link correto

- [x] Acessar e baixar o arquivo correto do novo link do Google Fotos (`https://photos.app.goo.gl/QrAKYt9JW6Aua4AE8`)
- [x] Converter o novo vídeo para H.264 de alta qualidade sem som e publicá-lo no armazenamento
- [x] Atualizar o Hero no Home.tsx para usar o novo arquivo correto
- [x] Testar, salvar checkpoint final e entregar o resultado ao usuário
- [x] Criar e aplicar um poster do novo vídeo do Hero para evitar primeiro frame preto durante o carregamento
