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
- [ ] Entregar ao usuário o guia consolidado de administração, hospedagem e domínio antes de marcar o item de entrega como concluído

## Última rodada de validação

- [x] Expor no formulário de edição dos Shorts os campos de ordem e ativo, conectados à mutation de atualização
- [x] Tornar explícito o fallback de autoplay bloqueado com overlay reproduzir, link para o YouTube e controles acessíveis
- [x] Criar testes Vitest para as mutations admin de conteúdo e Shorts (create, update, delete e reorder)
