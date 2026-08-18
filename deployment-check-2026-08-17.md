# Verificação de publicação — 2026-08-17

- GitHub branch `main`: commit `53c61d8` atualizou `client/src/pages/Home.tsx`.
- GitHub branch `main`: commit `4c49fa6` atualizou `server/db.ts` com o fallback público da Thrift Store.
- Render Web Service `barberloungerio`: deploy `4c49fa6` concluído com status **Live**.
- URL provisória do Render: `https://barberloungerio.onrender.com`.
- O vídeo do Hero não foi substituído durante esta publicação; a alteração foi limitada ao bundle do cliente e ao fallback público dos dados.
- Próxima verificação: endpoint público, seção `#thrift` e domínio oficial `barberloungerio.com.br`.

Validação publicada após o deploy 4c49fa6: o Render está `Live`; a página `https://barberloungerio.onrender.com/#thrift` carrega o layout completo; o DOM contém `PEÇA 01` até `PEÇA 23` e a segunda cópia usada pela faixa contínua; o Hero e a seção de vídeos também estão presentes. O próximo passo é validar os URLs das imagens no navegador e o domínio oficial.

Validação do domínio oficial: `https://barberloungerio.com.br/#thrift` ainda retorna a página placeholder `Hi there 👋`, enquanto `https://barberloungerio.onrender.com/#thrift` retorna o aplicativo completo e 23 itens da Thrift Store. A aplicação no Render está correta; o domínio oficial ainda aponta para a publicação GitHub Pages/placeholder e precisa ser vinculado ao Web Service do Render.

Domínios personalizados adicionados no Render: `barberloungerio.com.br` e `www.barberloungerio.com.br`. Status atual: `Waiting for DNS`. O usuário deve configurar os apontamentos no Registro.br para que o domínio oficial aponte para o target fornecido pelo Render.

Verificação adicional: no Render, `barberloungerio.com.br` e `www.barberloungerio.com.br` aparecem adicionados, mas o status ainda está `Loading` / `Waiting for Verification`. O modal do Render informa os registros necessários: CNAME hostname `www` apontando para `barberloungerio.onrender.com`; para o domínio raiz, hostname `@` e o target `barberloungerio.onrender.com` quando o provedor aceitar CNAME/ALIAS, ou o A record `216.24.57.1` quando necessário. O Registro.br abriu autenticado na conta do usuário, mas ainda não foi aberta a tela de edição da zona DNS.

No Registro.br, o domínio `barberloungerio.com.br` está com status `Publicado`, expira em 14/06/2029 e está utilizando os servidores DNS do próprio Registro.br. A tela de administração mostra as opções `Alterar servidores DNS` e `Configurar zona DNS`; a zona ainda precisa ser aberta para confirmar se existem os registros `@`/raiz e `www` exigidos pelo Render.
Auditoria do perfil oficial via link `https://share.google/TVi4GWtvKyHwk3PdY`: o Google resolveu para `BARBER LOUNGE RIO -Barbearia & Luxury Thrift Store Rio de Janeiro`, perfil administrado pelo usuário, com nota exibida de `4,9`, `177 avaliações` e endereço Av. Churchill, 10C, Centro, Rio de Janeiro - RJ, 20020-021.
Documentação oficial do Google Maps JavaScript API (Place Details, atualizada em 08/07/2026) confirma que um objeto `Place` pode ser criado com Place ID e que `Place.fetchFields()` busca dados do local; a página oficial de Place Reviews deve ser consultada para confirmar o campo e as atribuições necessárias antes da implementação. Fonte: https://developers.google.com/maps/documentation/javascript/place-details.
Zona DNS confirmada no Registro.br em 17/08/2026: existem quatro registros A para `barberloungerio.com.br` apontando para `185.199.108.153`, `185.199.109.153`, `185.199.110.153` e `185.199.111.153`, além de `CNAME www.barberloungerio.com.br → barberloungerio.github.io`. A substituição autorizada deve deixar `A barberloungerio.com.br → 216.24.57.1` e `CNAME www.barberloungerio.com.br → barberloungerio.onrender.com`.

## 2026-08-17 — conflito durante a troca DNS
Na zona avançada do Registro.br, foram marcados para remoção os quatro A do GitHub Pages e o CNAME antigo `www → barberloungerio.github.io`. Foram inseridos provisoriamente `A barberloungerio.com.br → 216.24.57.1` e `CNAME www → barberloungerio.onrender.com`, mas o Registro.br recusou o salvamento com `Conflito em Record CNAME`, pois a plataforma valida o CNAME antigo e o novo no mesmo lote. Procedimento seguro: remover/cancelar as novas entradas pendentes, salvar apenas as remoções antigas, depois adicionar os dois registros do Render em uma segunda operação e salvar.

O Registro.br aceitou a operação de limpeza com a mensagem `Zona DNS atualizada com sucesso!`; ao reabrir a zona, a tabela mostrou `Nenhum dado encontrado`. Isso confirma que o GitHub Pages foi removido e a zona está pronta para receber, em lote único, `A barberloungerio.com.br → 216.24.57.1` e `CNAME www.barberloungerio.com.br → barberloungerio.onrender.com`.

A zona DNS foi reaberta após a limpeza; a tabela permanece vazia (`Nenhum dado encontrado`), sem conflito de nomes. O cadastro dos dois registros do Render será feito agora em uma única operação antes de salvar.

## Render após a troca DNS
O painel do Render agora mostra `barberloungerio.com.br` e `www.barberloungerio.com.br` como **Verified**. A janela `Custom Domain DNS Records` confirma os alvos cadastrados (`www → barberloungerio.onrender.com` e raiz verificada por A/ALIAS com `216.24.57.1`). A emissão do certificado ainda aparece como `Certificate Error`; o próprio Render orienta conferir registros AAAA e CAA. Como a zona do Registro.br estava vazia antes dos dois registros atuais, não há AAAA/CAA configurados no momento; a próxima ação é aguardar/revalidar a emissão TLS e testar o HTTPS.

Validação por resolvedores públicos: Google DNS e Cloudflare DNS já retornam `A barberloungerio.com.br → 216.24.57.1`; Google DNS retorna `CNAME www.barberloungerio.com.br → barberloungerio.onrender.com` e a cadeia CDN do Render. O origin `https://barberloungerio.onrender.com/` respondeu `HTTP 200` após o wake-up do serviço Free e entregou o título `Barber Lounge Rio · barberloungerio.com.br`. O DNS já propagou; resta aguardar/revalidar o certificado TLS do Render.

Fonte oficial consultada: https://render.com/docs/custom-domains. O Render recomenda remover qualquer AAAA porque usa IPv4; se não houver CAA, nenhuma configuração CAA é necessária; após a verificação, a emissão automática do TLS pode exigir alguns minutos e nova verificação. Consulta pública ao Google DNS confirmou ausência de resposta AAAA e CAA para `barberloungerio.com.br`; a raiz retorna `216.24.57.1` e `www` retorna CNAME para `barberloungerio.onrender.com`. Status atual no dashboard: ambos os domínios **Verified**; raiz `Certificate Error`; www `Certificate Pending`.

O modal `Custom Domain DNS Records` do Render confirma explicitamente: `www` deve apontar por CNAME para `barberloungerio.onrender.com`; a raiz pode usar A/ANAME/ALIAS e, para A, o alvo é `216.24.57.1`. O aviso de certificado não identifica outro registro obrigatório; apenas solicita conferir AAAA/CAA. A consulta pública já mostrou ausência desses registros.

Auditoria do ambiente do Web Service Render: a seção `Environment Variables` está vazia. O componente atual usa `VITE_FRONTEND_FORGE_API_KEY` e `VITE_FRONTEND_FORGE_API_URL` para carregar o proxy Google Maps; sem essas variáveis o navegador registra `Failed to load Google Maps script`, e a busca automática de Places/reviews não consegue iniciar. O link compartilhado do Google Maps, sozinho, não fornece a API necessária para incorporar reviews automaticamente. Para concluir essa parte no Render é necessário uma credencial Google Maps Platform configurada com Maps JavaScript API e Places API (New), ou manter o fallback seguro com link oficial.

## Auditoria do Instagram Business
O conector autorizado retornou a conta real `@barberlounge.rio` (nome `BARBER LOUNGE RIO`, 1.274 seguidores, 789 publicações) e 20 posts recentes via `get_post_list`, cada um com `id`, `caption`, `media_type`, `media_url`, `thumbnail_url`, `permalink` e `timestamp`. Exemplos verificáveis: `https://www.instagram.com/reel/DcHxAnMDDCG/`, `https://www.instagram.com/reel/DcBhCIsOT0J/`, `https://www.instagram.com/reel/DcBWdkWuXxA/` e `https://www.instagram.com/p/DcBWID5uxbR/`. O conector é de leitura de conta/posts e não expõe uma rota HTTP pública para o Render; portanto a aplicação precisa receber uma cópia/snapshot desses dados por backend com credenciais Meta/Instagram configuradas no Render, ou continuar com a grade editorial/fallback. Os `media_url` retornados são URLs CDN assinadas e podem expirar; não devem ser tratados como assets permanentes sem armazenamento próprio.

Referências oficiais Meta consultadas em 2026-08-17:
- https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media confirma `GET /<INSTAGRAM_USER_ID>/media`, campos de mídia e que `media_url` pode ser omitida em vídeos com áudio licenciado ou restrições de direitos.
- https://developers.facebook.com/documentation/instagram-platform/reference/access_token confirma que tokens curtos expiram em 1 hora, tokens longos em 60 dias, e a troca deve ocorrer exclusivamente no servidor; as permissões variam entre `instagram_basic` e `instagram_business_basic` conforme o fluxo de login.

Painel Meta for Developers verificado:
- App Name: Barber Lounge Rio site
- App ID: 2044994446126258
- Chave Secreta do Aplicativo: visível na aba Configurações > Básico (botão Mostrar).
Para gerar o token de acesso da conta Instagram Business (@barberlounge.rio), a ferramenta recomendada pelo Meta é o Explorador da Graph API (Graph API Explorer) selecionando o app Barber Lounge Rio site e gerando um User Access Token com permissões `instagram_basic` e `instagram_business_basic`, ou vinculando a conta Business no painel de Casos de Uso.

Estado atual do Graph API Explorer: a ferramenta abriu com o app `Barber Lounge Rio site` selecionado. `instagram_basic` aparece como permissão adicionada; `instagram_business_basic` não foi reconhecida no seletor e aparece como `Other`. O menu de token oferece `Obter token de acesso do usuário`, `Obter token do aplicativo` e `Obter token de acesso da Página`. Após selecionar a opção de usuário, não abriu uma janela OAuth e o campo Token de acesso continua vazio; a Meta provavelmente exige a configuração do produto/caso de uso Instagram no app ou uma conta vinculada antes de liberar o escopo.

A seção Casos de uso do app principal confirma que o único caso relacionado a Instagram atualmente habilitado é `Incorporar conteúdo do Facebook, Instagram e Threads em outros sites`. Ao abrir `Adicionar mais casos de uso` e filtrar `Tudo (14)`, não apareceu `Instagram API with Instagram Login` nem outro caso de leitura de mídia da Graph API. Isso explica por que o Graph API Explorer não reconhece `instagram_business_basic` e não abre o fluxo de token; o app precisa de um produto/caso de uso de Instagram Business compatível, ou de outro app criado especificamente para esse fluxo.

Novo app criado com sucesso: `Barber Lounge Rio Feed`, App ID `1048134558274800`, com o caso de uso `Gerenciar mensagens e conteúdo no Instagram`. No Graph API Explorer, o app aparece selecionado, mas os campos digitados `instagram_business_basic` e `instagram_basic` retornam `0 resultados encontrados`; o botão de geração informa `Selecione pelo menos uma permissão ou configuração` e nenhuma configuração está disponível. O token ainda não foi gerado.

A configuração correta foi encontrada no novo app. O caso `INSTAGRAM_BUSINESS` abriu o painel `Conheça a API do Instagram`, com login do Instagram. O app do Instagram é `Barber Lounge Rio Feed-IG`, Instagram App ID `1057715053318855`. A Meta lista como permissões obrigatórias: `instagram_business_basic`, `instagram_business_manage_comments` e `instagram_business_manage_messages`. A etapa de token exige primeiro clicar em `Adicionar conta`; antes disso, a conta deve receber a função de `Testador do Instagram` na aba Funções. O Graph API Explorer não era o caminho correto para esse fluxo novo.

O painel `INSTAGRAM_BUSINESS` está carregado com a configuração oficial de login do Instagram. A rolagem visual não desloca o conteúdo principal, mas o HTML/texto confirma a etapa `2. Gerar tokens de acesso` e o controle `Adicionar conta`; é necessário localizar esse controle no DOM ou usar a navegação própria do painel para continuar.

Após o login do Instagram, a Meta retornou ao painel sem adicionar a conta; a etapa 2 ainda mostra `Adicionar conta`. Na aba Funções, o diálogo `Adicionar pessoas` oferece a função adicional `Testador do Instagram`; ela foi selecionada, porém o botão `Adicionar` permanece desabilitado e a mensagem informa: `É necessária uma conta de desenvolvedor do Facebook para adicionar alguém a um app. Os usuários de teste não podem ser adicionados.`

Diagnóstico após a senha: a autenticação do Instagram foi aceita e voltou ao painel, mas a conta não foi vinculada porque a Meta exige que ela esteja habilitada como testadora antes da geração do token. A aba Funções mostra `Testadores 0 de 50`; o diálogo oferece `Testador do Instagram`, porém não há pessoa selecionada e o botão `Adicionar` fica desabilitado, com a mensagem de que é necessária uma conta de desenvolvedor do Facebook. O perfil do app continua sem conta conectada.

A segunda tentativa de `Adicionar conta` com a sessão do Instagram já autenticada repetiu o comportamento: a janela de login fechou, mas o painel continuou mostrando `Adicionar conta`, sem conta vinculada e sem token. O bloqueio permanece na exigência de testador/conta de desenvolvedor ou na elegibilidade da conta para o fluxo de login do Instagram. A alternativa disponível no painel é `Configuração da API com login do Facebook`, que pode vincular a conta Business por meio da Página/portfólio empresarial.

Fontes e estado da integração Instagram:
- Painel do novo app: https://developers.facebook.com/apps/1048134558274800/
- Configuração oficial Instagram Business/API setup: https://developers.facebook.com/apps/1048134558274800/use_cases/customize/?use_case_enum=INSTAGRAM_BUSINESS&selected_tab=API-Setup&product_route=instagram-business
- Funções do app: https://developers.facebook.com/apps/1048134558274800/roles/roles/
- Graph API Explorer: https://developers.facebook.com/tools/explorer/?app_id=1048134558274800
- A configuração oficial informa que o Instagram App ID é `1057715053318855`, exige `instagram_business_basic`, `instagram_business_manage_comments` e `instagram_business_manage_messages`, e pede que uma conta seja adicionada antes da geração do token. A conta foi autenticada, mas não ficou vinculada; o painel ainda mostra `Adicionar conta`.

A rota alternativa `API-Setup-with-Facebook-login` foi aberta com sucesso. A Meta confirmou `Permissões de gerenciamento de conteúdo adicionadas`, incluindo `instagram_basic`, `instagram_content_publishing`, `pages_read_engagement`, `business_management` e `pages_show_list`. Essa rota exige que a conta Instagram profissional esteja conectada a uma Página do Facebook e que o app seja autorizado pelo Login do Facebook para Empresas.

A rota `API-Setup-with-Facebook-login` está ativa e informa que o profissional deve conectar o Instagram a uma Página do Facebook e autorizar o app pelo Login do Facebook para Empresas. As permissões de conteúdo já foram adicionadas. Como a etapa visual de configuração do login não expôs um botão no painel, a próxima alternativa técnica é gerar um token de usuário pelo Graph API Explorer com `instagram_basic`, `pages_show_list`, `pages_read_engagement` e `business_management`, então consultar a Página vinculada e o `instagram_business_account`.

No Graph API Explorer do novo app, as permissões `instagram_basic` e `pages_show_list` foram reconhecidas e adicionadas ao conjunto de permissões. Ainda faltam `pages_read_engagement` e `business_management` para localizar a Página e a conta Instagram Business vinculada.

No Explorer, o fluxo correto é digitar a permissão e clicar em `Adicionar uma permissão`; após isso a permissão aparece como entrada selecionada com botão `Remover`. Neste ponto `instagram_basic` está selecionada. As tentativas anteriores com setas/Enter apenas pesquisaram a sugestão e não geraram token, pois o Explorer informou `Selecione pelo menos uma permissão ou configuração`.

O botão `Generate Access Token` ainda retorna `Selecione pelo menos uma permissão ou configuração` mesmo quando `instagram_basic` aparece na lista. Isso indica que a entrada exibida no campo de busca não está sendo marcada como seleção efetiva; é necessário clicar no item de permissão dentro do menu/resultado, não apenas digitar ou usar o botão genérico. Nenhum token foi gerado ou exposto.
Correção do Explorer: era necessário focar o campo de permissões e clicar no item `li[role=option]` `instagram_basic`. Após isso, o campo ficou vazio e `instagram_basic` passou a aparecer como botão selecionado, indicando que a seleção foi aceita. O próximo passo é clicar em `Generate Access Token` com essa permissão efetiva.
O Explorer agora confirma `4 opções selecionadas`: `instagram_basic`, `pages_show_list`, `business_management` e `pages_read_engagement`. Nenhum token novo foi copiado ou exposto neste registro.
A consulta autorizada `me/accounts?fields=id,name,instagram_business_account` retornou a Página `Barber Lounge Rio` com Page ID `591148494657141` e Instagram Business ID `17841409173794713`. Também retornou outras páginas do perfil, mas somente `Barber Lounge Rio` corresponde à integração do site. O token de usuário está presente no Explorer; ele não foi registrado neste arquivo.


## Deploy 02820ea — falha de build e correção
- O Render reconheceu automaticamente os commits `a1a0baf` e `02820ea`, mas o deploy `02820ea` falhou com status 1.
- Log exato: `Could not load /opt/render/project/src/shared/googleReviews (imported by client/src/pages/Home.tsx): ENOENT`.
- A causa é que o Home.tsx local importava `shared/googleReviews.ts`, mas esse arquivo ainda não existia no GitHub main.
- `shared/googleReviews.ts` foi carregado no formulário de upload do GitHub e está pronto para commit direto no branch `main`, com autorização do usuário já obtida.
- Após o commit, o Render deve disparar novo Auto-Deploy; o próximo erro de build, se existir, será revisado nos logs.

Fonte do log: https://dashboard.render.com/web/srv-da13cke7bikc73896log/deploys/dep-da1pl0jncjis73f1umvg
Fonte do upload: https://github.com/BarberLoungeRio/barberloungerio/upload/main/shared
Fonte do arquivo local: /home/ubuntu/barbearia-app/shared/googleReviews.ts


## Smoke test pós-b202dcf — domínio oficial
- O Render concluiu o deploy `b202dcf` com status **Live**; esse é o commit exibido como último deploy bem-sucedido.
- `https://barberloungerio.com.br/` respondeu HTTP 200 e `https://barberloungerio.onrender.com/` respondeu HTTP 200, confirmando TLS/serving ativo no domínio oficial e no origin.
- `https://www.barberloungerio.com.br/` respondeu HTTP 301, mantendo o redirecionamento esperado para o domínio canônico.
- A rota pública `site.instagramFeed` respondeu `status=ready`, com 12 itens e primeiro permalink real `https://www.instagram.com/reel/DcHxAnMDDCG/`.
- `site.publicData` respondeu com 23.564 bytes; a página oficial carrega os 23 itens da Thrift Store e os 19 Shorts.
- A captura textual inicial do navegador ainda mostrou a cópia editorial/fallback do Instagram e o estado de carregamento/fallback do Google Reviews. Isso precisa ser diferenciado entre estado inicial assíncrono do navegador e erro real do hook; a rota tRPC do Instagram está comprovadamente pronta.

Fonte do deploy: https://dashboard.render.com/web/srv-da13cke7bikc73896log/deploys
Fonte do domínio: https://barberloungerio.com.br/
Fonte do feed: https://barberloungerio.com.br/api/trpc/site.instagramFeed?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%7D%7D
