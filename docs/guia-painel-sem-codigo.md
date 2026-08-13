# Guia do painel visual sem código — Barber Lounge Rio

## Objetivo

O uso diário do site pode ser feito pelo painel administrativo, sem abrir o GitHub, o VS Code ou escrever código. O GitHub e o editor técnico ficam reservados para alterações estruturais; textos, imagens, vídeos e novas colunas são administrados pela página `/admin`.

## Acesso

Abra:

```text
https://barberloungerio.com.br/admin
```

Durante a configuração, use a URL pública atual do projeto e acrescente `/admin`. Faça login com a conta autorizada como administradora.

## Editar textos e cores

Na aba **Conteúdo e cores**, altere o campo desejado e clique em **Salvar alterações**. O painel grava o conteúdo no banco e a vitrine pública passa a usar o valor atualizado.

## Anexar uma foto

Nas abas **Serviços**, **Thrift Store** ou **Novas colunas**, clique em **Novo serviço**, **Adicionar foto** ou **Nova coluna**. No campo de imagem, clique em **Anexar**, escolha uma foto do computador ou celular e aguarde o aviso de upload concluído. Depois, clique em **Salvar**.

O painel aceita imagens com até 10 MB. Também é possível colar uma URL pública no campo. A foto enviada recebe um caminho `/manus-storage/` e fica vinculada ao item salvo no banco.

## Adicionar um vídeo

Na aba **Serviços**, cole uma URL do YouTube Shorts no formulário ou use **Entrada mensal rápida** para colar vários links. Clique em **Adicionar lote mensal**. Depois, edite título, descrição, etiqueta, visibilidade e ordem. No celular, use as setas; no computador, arraste os cartões.

## Criar uma nova coluna

Na aba **Novas colunas**, clique em **Nova coluna**. Preencha título, descrição e nome interno, anexe uma imagem, informe um link opcional, defina a ordem e marque **Publicada na vitrine**. Clique em **Salvar coluna**.

As novas colunas aparecem automaticamente na seção **Novidades da casa** da vitrine pública. Para reorganizar, arraste os cartões. Para retirar uma coluna sem apagar o registro, edite-a e desmarque **Publicada na vitrine**. Para excluir definitivamente, use **Remover**.

## O que não precisa ser feito no dia a dia

Não é necessário editar `Home.tsx`, `Admin.tsx`, `package.json`, o banco ou os arquivos do GitHub para trocar uma foto, inserir um Short, alterar um texto ou criar uma coluna. O GitHub Desktop e o VS Code só devem ser usados quando for preciso mudar o funcionamento, a estrutura, o layout ou uma integração do sistema.

## Cuidados

Faça uma pré-visualização depois de salvar. Não envie senhas ou tokens como imagem e não cole credenciais nos campos do painel. Antes de remover um item, confirme se ele não é mais necessário.
