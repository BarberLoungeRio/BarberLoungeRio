# Guia Atualizado: Como Enviar o Vídeo Limpo para o GitHub e Render

Este guia traz os comandos de terminal necessários para atualizar o seu repositório no GitHub com a versão mais recente do site (contendo o vídeo do Hero sem a marca final do CapCut) e forçar o Render a publicar a atualização.

---

## Passo 1: Abrir o terminal na pasta do projeto
Abra o terminal do seu computador (ou o prompt de comando do VS Code) dentro da pasta onde está o projeto `barber-lounge-rio`.

## Passo 2: Executar os comandos de envio para o GitHub

Copie e cole os comandos abaixo em sequência:

```bash
# 1. Verificar se há alterações pendentes
git status

# 2. Adicionar todos os arquivos modificados (incluindo o código atualizado do Hero e os novos manuais)
git add .

# 3. Registrar a alteração com uma mensagem descritiva
git commit -m "Remove CapCut final from hero video and update responsive layout"

# 4. Enviar a atualização para o seu repositório no GitHub
git push origin main
```

---

## Passo 3: Atualizar o site no Render

Assim que o comando `git push origin main` terminar de ser executado, o Render detectará a nova alteração no GitHub automaticamente (caso o deploy automático esteja ativo).

Se preferir atualizar manualmente:
1. Acesse o seu painel no [Render](https://render.com).
2. Clique no Web Service correspondente ao **Barber Lounge Rio**.
3. No canto superior direito, clique em **Manual Deploy**.
4. Selecione **Clear build cache & deploy** para garantir que o Render compile o site usando a versão mais recente sem arquivos em cache.

---

## Passo 4: Conferir o resultado
Após o término do build no Render (que costuma levar de 1 a 2 minutos):
1. Acesse o endereço do seu site (ou a URL temporária `onrender.com`).
2. Confirme que o vídeo de abertura inicia sem tela preta, reproduz a animação limpa e encerra antes de aparecer qualquer marca do CapCut, tanto no computador quanto no celular.
