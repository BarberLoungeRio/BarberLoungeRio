# Integração do Instagram

## Estado implementado

O site público carrega automaticamente o perfil público `@barberlounge.rio` por meio do embed oficial do Instagram e mantém um link direto para o perfil como fallback. O endereço usado na vitrine é `https://www.instagram.com/barberlounge.rio/`.

A conta autorizada na sessão de gerenciamento foi validada como `@barberlounge.rio`, com nome exibido `BARBER LOUNGE RIO`. A integração da sessão de gerenciamento não é exposta ao navegador do visitante e não é usada como credencial dentro da aplicação web.

## Limite de segurança

O site não acessa ferramentas privadas da sessão do usuário. Por isso, o navegador não recebe tokens, cookies ou credenciais do Instagram. O embed público pode depender de o perfil permanecer público, das políticas de incorporação do Instagram e de bloqueadores do navegador; nesses casos, o botão de perfil continua disponível.

## Feed programático opcional

Para transformar a seção em um feed programático com miniaturas, legendas e links próprios, a empresa precisa criar uma integração oficial da Meta/Instagram Graph API e fornecer à aplicação um token armazenado como segredo do servidor. O token nunca deve ser colocado no código do cliente, em HTML público ou no banco como texto sem proteção.

Os requisitos típicos são uma conta profissional conectada a uma Página do Facebook, um aplicativo criado no Meta for Developers, permissões aprovadas pela Meta e um token de longa duração com escopos compatíveis. Os escopos e endpoints devem ser confirmados na documentação oficial da Meta no momento da implementação, pois podem mudar. Sem essas credenciais, o comportamento seguro é manter o embed público e o link oficial.

## Atualização mensal

A inclusão mensal de posts no Instagram não exige alteração de código quando o perfil público continua acessível: o embed busca o perfil atualizado. A galeria de YouTube Shorts tem gerenciamento próprio no painel administrativo, com inclusão, edição, remoção e reordenação persistidas no banco.
