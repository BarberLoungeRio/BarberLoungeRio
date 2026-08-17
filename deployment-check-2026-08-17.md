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
