# Avaliação de hospedagem gratuita externa — Barber Lounge Rio

## Escopo técnico

O projeto atual é uma aplicação full-stack baseada em React 19, Vite, Node.js, Express, tRPC, Drizzle ORM e banco MySQL/TiDB. Além da vitrine pública, ele possui login administrativo, painel `/admin`, persistência de conteúdo, Shorts, galeria Thrift Store, variáveis de ambiente e armazenamento de mídia.

A hospedagem gratuita precisa, portanto, executar um processo Node.js, aceitar variáveis de ambiente, permitir domínio próprio e conectar a um banco MySQL externo ou compatível. O painel visual de edição é uma parte do próprio aplicativo; ele não é fornecido pelo provedor de hospedagem e continua sendo acessado em `/admin` depois da migração.

## Comparação

| Opção | Compatibilidade imediata | Banco | Domínio próprio | Limitações gratuitas | Veredito |
|---|---|---|---|---|---|
| Render Free + Aiven MySQL Free | Alta para o servidor Node/Express; requer ajustar variáveis e migrar o banco | Aiven MySQL Free, 1 GB | Sim, com TLS gerenciado no Render | Render suspende o serviço após 15 min sem tráfego e pode levar cerca de 1 min para reativar; Aiven usa 1 GB/1 GB RAM em nó único e pode desligar após inatividade | Melhor combinação gratuita para testar e colocar o projeto no ar, desde que o usuário aceite sleep e limites |
| Railway Free | Alta para Node e bancos; deploy simples por Git | Pode executar MySQL, mas o plano gratuito concede apenas US$ 1 de crédito por mês | Compatível conforme o serviço/projeto | O crédito é mensal e não acumula; o uso contínuo do servidor e do banco tende a consumir o limite | Bom para testes curtos; não é uma hospedagem gratuita confiável para funcionamento contínuo |
| Vercel Hobby + backend/banco separados | Baixa sem refatoração; o projeto atual usa Express/tRPC e não é um app Vercel nativo | Não oferece banco MySQL gerenciado no plano Hobby | Sim | Hobby é gratuito para projetos pessoais e tem limites de funções; seria necessário separar frontend, backend e banco ou reescrever a arquitetura | Não recomendado para este projeto sem uma migração significativa |

## Recomendação

A alternativa mais coerente é **Render Free para o serviço Node/Express + Aiven Free MySQL para o banco**, com o repositório conectado ao GitHub. Essa combinação preserva o formato do projeto atual com menos refatoração do que Vercel/Cloudflare e não exige comprar um domínio novo.

A ressalva é importante: Render descreve o serviço gratuito como apropriado para testes, projetos pessoais e prévias, e informa que ele não deve ser usado em produção por causa das limitações do plano. O serviço dorme após 15 minutos sem tráfego, o sistema de arquivos local é efêmero e não deve armazenar uploads permanentes. Aiven oferece MySQL gratuito sem expiração de 30 dias, mas limita a instância a 1 GB de armazenamento, 1 GB de RAM e um único nó, além de poder desligá-la após inatividade.

## Como a edição continuará funcionando

Após a migração, o painel continuará dentro do próprio site:

```text
https://barbearia.com.br/admin
```

O usuário continuará editando textos, cores, vídeos, fotos e descrições pelo painel visual. A diferença é que o provedor hospedará o processo do aplicativo; o conteúdo continuará sendo salvo no banco Aiven e os arquivos de mídia deverão ser movidos para armazenamento externo persistente, como S3/R2, em vez de depender do sistema de arquivos efêmero do servidor gratuito.

## Próxima etapa técnica

Não é seguro fornecer registros DNS antes de a aplicação estar instalada no novo provedor. Depois do deploy do Render, o Render exibirá o hostname CNAME e o destino do domínio raiz; depois da criação do banco Aiven, será necessário atualizar `DATABASE_URL`, `JWT_SECRET`, credenciais de storage e demais variáveis do projeto. Só então o Registro.br poderá receber os valores reais para `www` e para o domínio raiz.

## Fontes oficiais consultadas

- Render — [Deploy for Free](https://render.com/docs/free): serviços Node gratuitos, domínios personalizados, TLS, sleep após 15 minutos, filesystem efêmero, 750 horas mensais e limitações do PostgreSQL gratuito.
- Render — [Platforms with a real free tier in 2026](https://render.com/articles/platforms-with-a-real-free-tier-for-developers-in-2026): comparação contextual entre Render, Vercel, Netlify, Railway, Cloudflare Workers e Fly.io.
- Aiven — [Free managed MySQL database](https://aiven.io/free-mysql-database): MySQL gratuito sem expiração de 30 dias, 1 GB de armazenamento, 1 GB de RAM, nó único e desligamento por inatividade.
- Railway — [Pricing plans](https://docs.railway.com/pricing/plans) e [Free trial](https://docs.railway.com/pricing/free-trial): plano Free de US$ 0 com US$ 1 de crédito por mês e trial inicial de US$ 5 por até 30 dias.
- Vercel — [Hobby plan](https://vercel.com/docs/plans/hobby) e [Custom domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain): plano Hobby gratuito, limites de funções e configuração de domínios próprios.

## Conclusão

Nenhuma opção gratuita oferece ao mesmo tempo uptime garantido, banco MySQL robusto, armazenamento de mídia persistente e suporte de produção. Para este projeto, Render + Aiven é a rota gratuita mais compatível para teste e pequenos acessos, mas a publicação comercial definitiva deve ser tratada como uma etapa posterior, com plano pago ou infraestrutura equivalente, caso a operação precise de disponibilidade contínua e maior segurança de dados.

---

Autor: Manus AI
Data da pesquisa: 12 de agosto de 2026

A hospedagem própria e o domínio são coisas separadas: o domínio permanece no Registro.br, e os registros DNS apontam para o provedor escolhido.
