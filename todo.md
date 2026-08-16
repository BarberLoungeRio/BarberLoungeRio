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

## Guia de Publicação, Domínio e Configuração
- [x] Elaborar passo a passo para publicação do site no Manus
- [x] Explicar o processo de configuração do domínio `.com.br` no Registro.br
- [x] Detalhar o acesso à página de configuração e painel administrativo do site

## Avaliação de hospedagem gratuita externa
- [x] Comparar hospedagens gratuitas atuais compatíveis com Node.js, banco MySQL e painel administrativo
- [x] Comparar formalmente Render, Railway e Vercel com critérios de Node.js, MySQL, domínio próprio e painel `/admin`
- [x] Recomendar arquitetura gratuita Render Free + Aiven MySQL Free e explicar a continuidade do painel visual
- [x] Documentar limitações críticas: sleep, expiração, armazenamento efêmero, créditos e ausência de MySQL gerenciado
- [x] Definir a arquitetura externa final após o usuário escolher o provedor
- [x] Preparar migração do projeto, banco, variáveis de ambiente e armazenamento se o usuário escolher um provedor

## Guia GitHub e Render
- [x] Mapear scripts de build, start, banco e integrações do projeto para deploy externo
- [x] Pesquisar instruções oficiais de envio ao GitHub e conexão de um Web Service Node.js ao Render
- [x] Elaborar guia seguro com variáveis de ambiente, teste pré-DNS e integração do domínio
- [x] Executar a migração real após o usuário criar ou informar o repositório GitHub e escolher a hospedagem

## Ajustes solicitados na vitrine
- [x] Ampliar visualmente o primeiro vídeo nas laterais sem distorcer a imagem
- [x] Remover o segundo vídeo da vitrine e manter a área limpa
- [x] Substituir o item Drops TV do rodapé pela seção Serviços
- [x] Validar desktop, mobile, testes e build após as alterações


## Refinamento e validação adicional
- [x] Implementar um enquadramento verificável que preserve o vídeo 1 completo e preencha as laterais sem distorção
- [x] Capturar e validar a página em viewport móvel, incluindo Hero, Conceito e rodapé


## Substituição do projeto antigo no GitHub
- [x] Criar orientação para backup do repositório antigo antes da substituição
- [x] Explicar substituição total, nova branch, novo repositório e edição pelo navegador
- [x] Explicar uso combinado de GitHub Desktop, VS Code e painel `/admin`
- [x] Documentar quais arquivos manter, substituir ou nunca copiar


## Edição visual sem código
- [x] Garantir edição de textos e links por formulários visuais
- [x] Garantir inclusão e troca de fotos por upload no painel
- [x] Garantir inclusão de vídeos por colagem de links e reordenação visual
- [x] Permitir criar e editar colunas/blocos de conteúdo sem alterar código
- [x] Validar o fluxo de publicação e edição pelo painel em desktop e celular


## Validação end-to-end do painel sem código
- [x] Capturar o painel `/admin` em viewport móvel com as abas de edição sem código
- [x] Validar o fluxo end-to-end de editar texto, anexar foto, salvar e conferir a vitrine


## Resolução do domínio GoDaddy e endereços corretos
- [x] Esclarecer que o domínio barbearia.com.br está na GoDaddy e não foi configurado
- [x] Explicar a diferença entre o endereço de teste do Manus e o domínio real
- [x] Guiar o acesso correto sem sugerir compra de serviços na GoDaddy

## Renomeação de Drops TV e edição ampliada
- [x] Renomear todos os rótulos visíveis de Drops TV para Serviços na vitrine, navegação e painel
- [x] Remover a expressão Drops TV dos títulos e descrições visíveis ao público
- [x] Tornar editáveis pelo painel os rótulos, títulos e textos principais da vitrine
- [x] Preservar a edição de vídeos, fotos e novas colunas no mesmo painel gratuito
- [x] Validar o painel, a vitrine e a compatibilidade do projeto com GitHub


## Passo a passo de migração GitHub e Render
- [x] Orientar download do checkpoint pronto em ZIP
- [x] Orientar backup do repositório antigo e criação/substituição no GitHub
- [x] Detalhar configuração do Web Service Node.js no Render, banco MySQL e variáveis de ambiente
- [x] Explicar como testar antes de apontar o domínio no Registro.br

## Inclusão de prompts e aplicativo no GitHub
- [x] Organizar os prompts em uma pasta `docs/prompts/` dentro do projeto
- [x] Explicar como enviar código e prompts juntos para o GitHub
- [x] Detalhar métodos de envio (GitHub Desktop, VS Code e navegador)
- [x] Garantir que o Render continue lendo apenas o aplicativo sem conflito com os prompts

## Pacote de Prompts Prontos para o GitHub
- [x] Criar arquivo de prompts operacionais e instruções em `docs/prompts/pacote-instrucoes-github.md`
- [x] Detalhar em cada prompt o objetivo, o local de uso (Copilot/Issues) e o comportamento esperado
- [x] Explicar a separação entre comandos executados pelo Git/GitHub e ações no painel do Render

## Correção do vídeo de abertura
- [x] Remover o trecho final com marca/código do CapCut do vídeo do Hero
- [x] Publicar a versão limpa do vídeo no armazenamento do projeto
- [x] Ajustar o enquadramento do Hero para preencher desktop e celular sem distorção
- [x] Validar visualmente o vídeo limpo em web e mobile, executar testes e salvar checkpoint


## Comandos atualizados para GitHub e Render (vídeo limpo)
- [x] Documentar os comandos de Git para atualizar o repositório com o novo vídeo do Hero sem CapCut
- [x] Orientar como acionar o redeploy no Render e validar a versão publicada

## Correção do domínio oficial
- [x] Substituir referências visíveis e documentais de barbearia.com.br por barberloungerio.com.br
- [x] Atualizar guias, URLs administrativas e instruções de DNS para o domínio oficial
- [x] Validar que nenhum endereço antigo permaneça em Home, Admin, DnsGuide e documentação
- [x] Executar testes, build e salvar checkpoint da correção


## Identificação pública e acesso ao modo de edição
- [x] Atualizar o título público para Barber Lounge Rio — barberloungerio.com.br
- [x] Diferenciar o nome técnico interno barbearia-app do nome público e do domínio oficial
- [x] Criar um caminho documentado para acessar `/admin`, editar conteúdo e abrir os guias GitHub/Render
- [x] Validar título, painel, documentação, testes e build e salvar checkpoint


## Correção do Guia de Prompts
- [x] Reproduzir o 404 do botão Guia GitHub e Prompts
- [x] Corrigir a rota ou criar um fallback público funcional para o manual
- [x] Validar o acesso pelo painel e pelo link direto
- [x] Executar testes/build e salvar checkpoint da correção


## Correção do ERR_PNPM_PATCH_FAILED no Render
- [x] Analisar o patch do Wouter e a versão instalada (Wouter v3.3.5 no package.json versus patch direcionado a v3.7.1)
- [x] Remover o patch problemático do package.json e da pasta patches para evitar falha no Render
- [x] Validar pnpm install limpo sem patches
- [x] Executar typecheck, testes e build de produção

## Correção do Erro de Build no Render (vite-plugin-manus-runtime)
- [x] Analisar o vite.config.ts e o uso do plugin manus-runtime
- [x] Ajustar vite.config.ts para produção para evitar falha ao carregar plugins internos do Manus
- [x] Validar build local com NODE_ENV=production
- [x] Entregar instruções claras para o Render
