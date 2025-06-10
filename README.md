# 🐦 Mini Twitter

Uma versão simplificada do Twitter desenvolvida com **HTML5**, **CSS3** e **JavaScript vanilla**. O projeto permite aos usuários criar contas, fazer posts, gerenciar perfis e interagir em um feed social.


## ✨ Funcionalidades

### 🔐 Autenticação
- **Cadastro de usuários** com validação de dados
- **Login seguro** com JWT tokens
- **Logout** com limpeza de sessão
- **Persistência de login** após refresh da página

### 📝 Sistema de Posts
- **Criar posts** com limite de 280 caracteres
- **Contador de caracteres** em tempo real
- **Feed público** com todos os posts
- **Deletar posts próprios**
- **Visualização de posts por usuário**

### 👤 Perfil do Usuário
- **Visualizar informações** do perfil
- **Editar username e email**
- **Data de cadastro** formatada
- **Posts pessoais** organizados

### 🎨 Interface
- **Design responsivo** (mobile-first)
- **Tema claro e escuro** alternáveis
- **Notificações toast** para feedback
- **Animações suaves** e transições
- **Loading states** durante requisições

## 🚀 Como Usar

### Pré-requisitos
- Navegador web moderno
- Conexão com internet (para API)

### Instalação
1. **Clone ou baixe** os arquivos do projeto
2. **Abra o arquivo** `index.html` no navegador
3. **Ou use um servidor local** como Live Server (VS Code)

\`\`\`bash
# Se usar um servidor local
npx serve .
# ou
python -m http.server 8000
\`\`\`

### Primeiro Uso
1. **Acesse a aplicação** no navegador
2. **Cadastre uma conta** na aba "Cadastrar"
3. **Faça login** com suas credenciais
4. **Comece a tweetar!** 🎉

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização com Flexbox/Grid
- **JavaScript ES6+** - Lógica da aplicação
- **LocalStorage** - Persistência de dados
- **Fetch API** - Comunicação com servidor
- **CSS Variables** - Temas dinâmicos

## 📱 Responsividade

O projeto foi desenvolvido com abordagem **mobile-first**:

- **Mobile**: < 480px
- **Tablet**: 480px - 768px  
- **Desktop**: > 768px

## 🌙 Temas

A aplicação suporta dois temas:

- **🌞 Tema Claro** (padrão)
- **🌙 Tema Escuro** (alternável)

Use o botão de tema no cabeçalho para alternar entre eles.

## 🔗 API

O projeto utiliza a API oficial do Mini Twitter:

**Base URL**: `https://mini-twitter-api-vy9q.onrender.com/api`

### Endpoints Principais
- `POST /auth/register` - Cadastro
- `POST /auth/login` - Login
- `GET /posts` - Listar posts
- `POST /posts` - Criar post
- `DELETE /posts/:id` - Deletar post
- `GET /users/profile` - Perfil do usuário
- `PUT /users/profile` - Atualizar perfil

## 📁 Estrutura do Projeto

\`\`\`
mini-twitter/
├── index.html          # Página principal
├── README.md           # Documentação
├── css/
│   ├── reset.css       # Reset de estilos
│   └── style.css       # Estilos principais
└── js/
    └── app.js          # Lógica da aplicação
\`\`\`

## 🎯 Funcionalidades Detalhadas

### Autenticação
- Formulários com validação em tempo real
- Tokens JWT armazenados com segurança
- Verificação automática de sessão
- Logout com limpeza completa de dados

### Posts
- Editor com contador de caracteres
- Validação de conteúdo antes do envio
- Formatação automática de datas
- Escape de HTML para segurança

### Perfil
- Modal de edição responsivo
- Validação de dados de perfil
- Atualização em tempo real
- Histórico de posts do usuário

### Interface
- Navegação intuitiva entre seções
- Estados de loading durante requisições
- Notificações toast com auto-dismiss
- Animações CSS suaves

## 🔧 Personalização

### Cores do Tema
Edite as variáveis CSS em `style.css`:

\`\`\`css
:root {
  --primary-color: #1da1f2;
  --background-color: #f7f9fa;
  --text-color: #14171a;
}
\`\`\`

### Limite de Caracteres
Altere o limite em `app.js`:

\`\`\`javascript
const maxChars = 280; // Altere aqui
\`\`\`

## 🐛 Solução de Problemas

### Erro de CORS
Se encontrar erros de CORS, use um servidor local:
\`\`\`bash
npx serve .
\`\`\`

### Posts não carregam
Verifique sua conexão com internet e se a API está funcionando.

### Login não persiste
Verifique se o localStorage está habilitado no navegador.

## 📈 Próximas Funcionalidades

- [ ] Sistema de curtidas
- [ ] Comentários em posts
- [ ] Upload de imagens
- [ ] Busca de posts
- [ ] Seguir usuários
- [ ] Notificações push

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é livre para uso educacional e pessoal.

## 👨‍💻 Desenvolvedor

Desenvolvido como projeto acadêmico para demonstrar habilidades em:
- HTML5 semântico
- CSS3 moderno
- JavaScript vanilla
- Design responsivo
- Integração com APIs

---

**🐦 Divirta-se tweetando!**
