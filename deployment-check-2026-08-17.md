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
