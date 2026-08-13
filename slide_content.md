# Barber Lounge Rio — Guia de Publicação, Domínio e Operação

---

## Publicação Automatizada na Nuvem Sem Custo de Servidor
- A infraestrutura gerenciada do Manus publica o projeto em uma URL HTTPS de produção com apenas um clique no botão **Publish** [1].
- O sistema mantém a aplicação ativa de forma automatizada, sem exigir que computadores ou servidores físicos permaneçam ligados.
- O banco de dados relacional integrado preserva em tempo real todo o conteúdo editado, títulos, cores, serviços, fotos do Thrift Store e os vídeos do Drops TV.
- A arquitetura serverless assegura escalabilidade e velocidade de carregamento estáveis para os clientes no Centro do Rio de Janeiro.

---

## Conexão Transparente do Domínio `barbearia.com.br`
- O domínio personalizado existente no Registro.br é integrado ao projeto por meio do painel de gerenciamento em **Settings → Domains** [2].
- A plataforma gera os registros DNS específicos da implantação, garantindo apontamento seguro e sem substituição de IPs genéricos.
- O procedimento no Registro.br consiste em acessar a zona DNS de `barbearia.com.br` e cadastrar os apontamentos indicados pela hospedagem [2].
- A validação de propriedade no painel ativa automaticamente a emissão e a renovação do certificado de segurança HTTPS.

---

## Passo a Passo Prático no Painel do Registro.br
1. **Publicar no Manus**: Clique em **Publish** no cabeçalho do projeto e copie o endereço de produção gerado [1].
2. **Obter os Registros**: Abra **Settings → Domains**, informe `barbearia.com.br` e anote os registros DNS fornecidos pela hospedagem.
3. **Editar a Zona DNS**: Acesse o [Registro.br](https://registro.br), abra **Domínios → barbearia.com.br → DNS → Editar zona** e insira os dados do Manus [2].
4. **Validar e Aguardar**: Retorne ao painel, clique em **Verify / Validar** e aguarde a propagação global do DNS e a emissão do SSL.

---

## Central de Configuração e Administração Visual (`/admin`)
- O painel administrativo protegido por login dispensa alterações no código-fonte para a manutenção diária do negócio.
- A aba **Conteúdo e cores** permite atualizar textos institucionais, telefones, horários e a identidade visual de forma imediata.
- A aba **Drops TV** oferece suporte a inserção unitária e em lote de links do YouTube Shorts, com reordenação por arrastar e soltar.
- A aba **Thrift Store** gerencia a galeria de fotos e descrições, mantendo a vitrine pública sempre sincronizada com o estoque real.

---

## Checklist de Lançamento e Próximos Passos
- [x] Publicar o projeto na nuvem do Manus através do botão **Publish** [1].
- [x] Configurar os registros CNAME e A correspondentes no painel de zona do Registro.br [2].
- [x] Validar a integridade dos endereços `https://barbearia.com.br` e `https://www.barbearia.com.br`.
- [ ] Realizar um teste completo em dispositivos móveis do botão flutuante do WhatsApp e do autoplay dos Shorts.
- [ ] Cadastrar os vídeos do mês corrente utilizando a ferramenta de entrada em lote no painel administrativo.

---

## Referências
- [1] Manus WebDev Documentation — Publishing and Deployment Guide.
- [2] Registro.br — Instruções de Gerenciamento de Zona DNS. (`https://registro.br/ajuda/procedimentos/gerenciar-dns/`)
