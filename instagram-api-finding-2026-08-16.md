# Integração automática do Instagram — achados verificados

A documentação oficial da Meta informa que o Instagram API with Business Login for Instagram permite acessar dados de contas Instagram Business e Instagram Creator e obter/publicar mídia. A alternativa com Facebook Login for Business requer conta Business ou Creator vinculada a uma Página do Facebook.

A referência oficial de IG Media lista `media_url`, `permalink`, `thumbnail_url` e `timestamp` como campos públicos úteis para uma grade. `media_url` pode faltar em alguns vídeos/Reels por áudio licenciado, direitos autorais ou download desativado; a implementação precisa usar `thumbnail_url` ou `permalink` como fallback.

A conta Instagram conectada no ambiente é `@barberlounge.rio`, conforme a configuração local do conector Instagram. Isso confirma o perfil-alvo, mas não prova que o token disponível no Render possui permissões da API oficial para leitura de mídia. O site precisa de um token e identificador válidos no próprio Render, ou de uma sincronização intermediária em banco/endpoint público.

Fontes consultadas:
- https://developers.facebook.com/documentation/instagram-platform
- https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media
