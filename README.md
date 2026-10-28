# TactiFlow — MVP de quadro tático de futsal

Aplicação web em React + Vite para desenhar e compartilhar táticas. **Nome provisório.**

## 1. Abrir no VS Code

1. Extraia este ZIP em uma pasta.
2. Abra a pasta `tactiflow` no VS Code.
3. Instale o Node.js LTS em https://nodejs.org se ainda não tiver.
4. Abra **Terminal > Novo Terminal**.
5. Execute `npm install` e depois `npm run dev`.
6. Abra o endereço local mostrado no terminal (normalmente `http://localhost:5173`).

Sem Supabase, o editor funciona em **modo local**: dados ficam no armazenamento do navegador. Não há login nem links públicos reais nesse modo.

## 2. Configurar contas e nuvem grátis (Supabase)

1. Crie um projeto em https://supabase.com.
2. Vá ao **SQL Editor** e execute o conteúdo de `supabase.sql`.
3. Em **Project Settings > API** (ou **Connect**, dependendo da interface), copie a URL do projeto e a chave pública/anon (`publishable` ou `anon`). **NUNCA use a service_role ou secret key no frontend.**
4. Duplique `.env.example` e renomeie para `.env`.
5. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
6. Reinicie `npm run dev`.
7. Em **Authentication > URL Configuration**, configure o endereço do seu site como Site URL e inclua URLs locais e do Netlify nas Redirect URLs, se usar confirmação de e-mail.
8. Em **Authentication > Providers > Email**, configure se o cadastro precisa confirmar e-mail. Para uso real, recomenda-se manter confirmação ativa.

**Importante:** a política SQL de compartilhamento permite leitura pública dos dados completos de qualquer tática com `share_id` definido. Portanto, não inclua informações pessoais, dados de menores ou segredos em jogadas compartilhadas. Para maior privacidade e controle de acesso, evolua para uma função de backend que devolva apenas os campos públicos, em vez de expor a tabela diretamente.

## 3. Publicar no Netlify

1. Execute `npm run build` e confira a pasta `dist`.
2. Em https://app.netlify.com, escolha **Add new project > Deploy manually** e arraste **a pasta `dist`**, não o ZIP nem a pasta `src`.
3. Se estiver usando Supabase, **a publicação manual precisa receber um build feito com `.env` preenchido**. A chave pública é incluída no JavaScript gerado; isso é esperado. Nunca coloque chaves secretas.
4. Alternativa recomendada: suba o código para um repositório Git e conecte-o ao Netlify. Em **Site configuration > Environment variables**, configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`; o `netlify.toml` já define `npm run build` e `dist`.
5. Depois de publicar, atualize as URLs permitidas no Supabase Authentication.
6. Teste cadastro, login, salvamento, compartilhamento e acesso ao link em uma janela anônima.

## Recursos implementados

- Quadro interativo com 10 jogadores e bola, movimentação por arrastar, setas e linhas.
- Inclusão de jogadores e reposicionamento da bola.
- Etapas duplicáveis, reprodução sequencial, desfazer/refazer, exclusão e limpeza de linhas.
- Zoom e destaque de meia quadra.
- Imagem de referência temporária (sobreposição translúcida).
- Biblioteca com pastas, tags, pesquisa, favoritos e duplicação.
- Exportação PNG, PDF e WebM (quando o navegador suporta MediaRecorder).
- Contas de treinador, salvamento em nuvem e links de visualização quando Supabase configurado.

## Limitações conhecidas desta primeira versão

- A animação alterna entre **posições estáticas por etapa**; ainda não interpola movimentos suavemente.
- A opção de meia quadra **destaca uma metade** da quadra, sem alterar suas coordenadas.
- A imagem de referência não é persistida na nuvem.
- Sem Supabase, o salvamento é somente local, e a sincronização não existe.
- Não há envio ou hospedagem de vídeos; a proposta foi alterada para **recriar jogadas de referência**.
- O compartilhamento é público para quem possui o link e não exige login de jogador.
- O WebM depende do navegador; a exportação pode variar entre dispositivos.
- Não há garantia de uso totalmente gratuito para sempre: planos gratuitos têm limites.
- Para produção, recomenda-se melhorar permissões de compartilhamento, validação, testes automatizados, acessibilidade e segurança.

## Arquivos

- `src/App.jsx`: telas, editor, autenticação, biblioteca, exportações.
- `src/engine.js`: desenho da quadra e jogadores.
- `src/style.css`: identidade visual responsiva.
- `supabase.sql`: esquema e regras do banco.
- `netlify.toml`: configuração da publicação.

## Instalação como aplicativo (PWA)

O projeto está preparado para gerar uma versão instalável no Android e no iPhone.

1. Instale as dependências com `npm install` (é necessária conexão com a internet nessa etapa).
2. Teste localmente com `npm run dev`.
3. Gere a versão de publicação com `npm run build`. O resultado ficará na pasta `dist`.
4. Publique a pasta `dist` em um serviço HTTPS, como Netlify. O arquivo `netlify.toml` já contém o comando de build e a pasta de publicação.
5. Abra o endereço publicado no celular para instalar:
   - Android: abra no Chrome e use a opção **Instalar app** ou **Adicionar à tela inicial**.
   - iPhone: abra no Safari, toque em **Compartilhar** e depois em **Adicionar à Tela de Início**.

A instalação não significa que todas as funções estejam disponíveis sem internet. O uso offline completo será verificado e aprimorado em uma etapa separada.
