# Guia simples de operação — Barber Lounge Rio

## Onde o site fica hospedado

O projeto fica hospedado na infraestrutura gerenciada do próprio ambiente WebDev do Manus. A aplicação funciona em uma URL HTTPS de pré-visualização e, depois que você clicar em **Publish** no painel de gerenciamento, poderá ser publicada em produção com o domínio personalizado `barbearia.com.br`. O banco de dados permanece conectado ao projeto e guarda os textos, cores, serviços e vídeos cadastrados no painel.

A hospedagem padrão é automatizada e adequada para um site institucional: o serviço inicia quando recebe acesso, utiliza HTTPS e não exige que o seu computador fique ligado. O domínio próprio é configurado no painel do projeto, em **Settings → Domains**, e depois no Registro.br, conforme o guia de DNS que já está disponível em `/admin/dns`.

## Qual aplicativo usar no dia a dia

Você não precisa instalar um programa de edição de código. Use o site do Manus pelo navegador para abrir o painel do projeto e, no cartão do projeto, abra a **Pré-visualização**. Para administrar a vitrine, acesse `/admin`, faça login com a conta autorizada e utilize as abas **Conteúdo e cores**, **Serviços** e **Drops TV**.

| O que você deseja alterar | Onde fazer | Como funciona |
|---|---|---|
| Palavras, títulos e textos | **Conteúdo e cores** | Clique no campo, substitua o texto e selecione **Salvar alterações**. |
| Cores da marca | **Conteúdo e cores** | Escolha a cor no seletor ou cole o código hexadecimal e salve. |
| Imagens e serviços | **Serviços** | Clique em **Editar**, cole a URL da imagem, revise o texto e salve. |
| Vídeos mensais | **Drops TV** | Clique em **Adicionar Short**, cole a URL do YouTube Shorts e salve. |
| Ordem dos vídeos | **Drops TV** | Arraste o cartão para outra posição; no celular, use as setas para cima e para baixo. |
| Ocultar um vídeo | **Drops TV** | Edite o cartão, desmarque **Publicado na galeria** e salve. |
| Remover um vídeo | **Drops TV** | Use o botão de lixeira e confirme a remoção. |

> O painel não altera o código-fonte. Ele grava os valores no banco de dados e a página pública lê essas informações automaticamente.

## Como adicionar um vídeo novo

Abra **Drops TV → Adicionar Short**. No campo de URL, cole o endereço completo, por exemplo `https://www.youtube.com/shorts/SEU_ID`. Depois, preencha um título curto, escolha a etiqueta, ajuste a ordem se desejar, confirme que o item está publicado e selecione **Salvar Short**. O site converte o endereço em um card vertical e tenta iniciar o vídeo sem som; se o navegador ou o YouTube bloquear o autoplay, o visitante ainda poderá abrir o vídeo diretamente no YouTube.

## Como funciona o Instagram neste momento

A seção **Barber Lounge em movimento** permanece ativa sem depender do Facebook/Meta. Cada imagem da grade é clicável e leva ao perfil oficial `@barberlounge.rio`; o botão **Seguir @barberlounge.rio** abre o perfil em uma nova aba. Essa é a alternativa estável enquanto a configuração da Graph API do Facebook está pausada.

A conexão de feed automático real exige autorização da Meta, uma conta profissional do Instagram e um token válido. Como essa etapa foi pulada por solicitação do responsável, o site não tenta autenticar nem fazer chamadas periódicas ao Facebook. Quando a Meta estiver disponível, será possível adicionar essa camada depois, preservando o layout atual e substituindo as imagens de fallback por posts recebidos da API oficial.

## Domínio `barbearia.com.br`

A publicação do projeto e o domínio são etapas separadas. Primeiro, publique o projeto pelo botão **Publish** e copie o endereço de produção informado pelo painel. Depois, abra o Registro.br, selecione `barbearia.com.br`, entre em **DNS → Editar zona** e crie os registros indicados pelo painel de domínios do projeto. Não invente valores de DNS: o destino pode variar conforme a publicação, portanto use exatamente os registros exibidos em **Settings → Domains**. Após a propagação, volte ao painel, valide o domínio e aguarde a emissão do certificado HTTPS.

## Rotina mensal recomendada

Uma vez por mês, abra o painel, adicione os novos Shorts, arraste-os para a posição desejada, revise os textos da vitrine e confirme se os links de Instagram e WhatsApp continuam corretos. Para qualquer alteração importante, salve e abra o site público em uma nova aba para conferir o resultado antes de divulgar.

## Referência do projeto

O painel é acessado em `/admin`. O guia técnico de DNS está em `/admin/dns`. A vitrine pública continua em `/`. O acesso administrativo é protegido por login e as operações de criação, edição, reordenação e remoção são autorizadas no servidor para contas com função de administrador.
