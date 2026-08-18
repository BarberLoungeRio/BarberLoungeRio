# Diagnóstico de restauração — Admin e Instagram

## Painel administrativo

A resposta HTTP de `https://barberloungerio.com.br/admin` era `200`, mas o bundle público antigo continha apenas a rota `/` e o fallback `NotFound`. O problema não estava no fallback Express/Vite: o `App.tsx` que o Render estava compilando no GitHub era uma versão antiga sem `/admin`, `/admin/dns`, `/admin/guide` e `/docs/manual-github-aplicativo-e-prompts.md`. O `App.tsx` atualizado inclui essas rotas e o cliente local foi validado visualmente com `/admin` e `/admin/guide`.

## Instagram e Reels

A Graph API atualmente responde erro HTTP 400 com a mensagem da Meta `Expected 1 '.' in the input between the postcard and the payload`. Isso indica que a credencial configurada foi recusada pelo parser de token da Meta; o site não deve tratar isso como feed vazio nem fabricar publicações. A interface passou a exibir o motivo sanitizado e a manter um embed oficial do perfil público como fallback.

Quando a API fornecer `media_url`, o card usa vídeo HTML5 inline com `muted`, `autoPlay`, `loop`, `playsInline` e `controls`. Quando a Meta omitir `media_url` — por exemplo, em vídeos com áudio licenciado/copyright ou conforme os controles de download — o card usa o embed oficial de `instagram.com/embed.js` com o permalink real do Reel. O embed oficial é a alternativa compatível com o comportamento de widgets como Wix, mas o Instagram pode impedir autoplay com som, exigir interação ou bloquear conteúdo privado/embeds desativados.

## Fontes oficiais consultadas

- Meta, “Embed an Instagram Post”: https://developers.facebook.com/documentation/instagram-platform/oembed
- Meta, “IG Media”: https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media
- Instagram Help Center, “Embed an Instagram post or profile”: https://help.instagram.com/620154495870484/
