# 🐦 Mini Twitter

Uma versão simplificada do Twitter desenvolvida com **HTML5**, **CSS3** e **JavaScript vanilla**. O projeto permite aos usuários criar contas, fazer posts, gerenciar perfis e interagir em um feed social moderno e responsivo.

## ✨ Funcionalidades

### 🔐 Autenticação
- **Cadastro de usuários** com validação completa de dados
- **Login seguro** com JWT tokens e criptografia
- **Logout automático** com limpeza total de sessão
- **Persistência inteligente** de login após refresh da página
- **Validação em tempo real** de formulários

### 📝 Sistema de Posts
- **Criar posts** com limite inteligente de 280 caracteres
- **Contador dinâmico** de caracteres com alertas visuais
- **Feed público** com todos os posts em tempo real
- **Deletar posts próprios** com confirmação de segurança
- **Visualização organizada** de posts por usuário
- **Formatação automática** de datas e horários

### 👤 Perfil do Usuário
- **Visualizar informações** completas do perfil
- **Editar username e email** com validação instantânea
- **Data de cadastro** formatada e localizada
- **Posts pessoais** organizados cronologicamente
- **Modal responsivo** para edição de dados

### 🎨 Interface Moderna
- **Design responsivo** com abordagem mobile-first
- **Tema claro e escuro** com transições suaves
- **Notificações toast** elegantes para feedback
- **Animações CSS** fluidas e profissionais
- **Loading states** informativos durante requisições
- **Navegação intuitiva** entre seções

## 🚀 Como Usar

### 📋 Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão estável com internet para comunicação com API
- JavaScript habilitado no navegador

### 💻 Instalação
1. **Clone o repositório** ou baixe os arquivos do projeto
   \`\`\`bash
   git clone [URL-do-repositório]
   cd mini-twitter
   \`\`\`

2. **Abra o arquivo** `index.html` no navegador
   \`\`\`bash
   # Opção 1: Abrir diretamente
   open index.html
   
### 🎯 Primeiro Uso
1. **Acesse a aplicação** no navegador
2. **Cadastre uma conta** na aba "Cadastrar"
3. **Preencha os dados** (username, email, senha)
4. **Faça login** com suas credenciais
5. **Comece a tweetar** e explore as funcionalidades!

## 🛠️ Tecnologias

### Frontend
- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilização moderna com Flexbox/Grid
- **JavaScript ES6+** - Lógica da aplicação e interatividade
- **CSS Variables** - Sistema de temas dinâmicos
- **LocalStorage** - Persistência de dados no cliente

### APIs e Comunicação
- **Fetch API** - Comunicação assíncrona com servidor
- **JWT Tokens** - Autenticação segura
- **REST API** - Arquitetura de comunicação

### Ferramentas de Desenvolvimento
- **CSS Reset** - Normalização de estilos
- **Mobile-First** - Design responsivo
- **ES6 Modules** - Organização modular do código

## 📱 Responsividade

O projeto foi desenvolvido com abordagem **mobile-first** e suporta:

- **📱 Mobile**: < 480px
  - Layout em coluna única
  - Navegação simplificada
  - Botões otimizados para toque

- **📟 Tablet**: 480px - 768px
  - Layout adaptado para telas médias
  - Melhor aproveitamento do espaço
  - Navegação híbrida

- **💻 Desktop**: > 768px
  - Layout completo com sidebar
  - Hover effects e transições
  - Navegação completa

## 🌙 Sistema de Temas

A aplicação suporta dois temas elegantes:

### ☀️ Tema Claro (Padrão)
- Fundo branco e tons claros
- Texto escuro para melhor legibilidade
- Cores vibrantes para elementos interativos

### 🌙 Tema Escuro
- Fundo escuro e tons suaves
- Texto claro para conforto visual
- Cores ajustadas para modo noturno

**Como alternar**: Use o botão de tema (🌙/☀️) no cabeçalho da aplicação.

## 🔗 API Integration

O projeto utiliza a API oficial do Mini Twitter hospedada no Render:

**Base URL**: `https://mini-twitter-api-vy9q.onrender.com/api`

### 📡 Endpoints Principais

#### Autenticação
- `POST /auth/register` - Cadastro de novo usuário
- `POST /auth/login` - Login de usuário existente

#### Posts
- `GET /posts` - Listar todos os posts
- `POST /posts` - Criar novo post
- `GET /posts/my-posts` - Listar posts do usuário logado
- `DELETE /posts/:id` - Deletar post específico

#### Usuário
- `GET /users/profile` - Obter perfil do usuário
- `PUT /users/profile` - Atualizar dados do perfil

### 🔑 Autenticação
Todas as requisições autenticadas incluem o header:
\`\`\`javascript
Authorization: Bearer <JWT_TOKEN>
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
mini-twitter/
├── index.html          # Página principal da aplicação
├── README.md           # Documentação completa
├── css/
│   ├── reset.css       # Reset de estilos padrão
│   └── style.css       # Estilos principais e temas
├── design/
│   ├── img1.png        # Screenshot app
│   ├── img2.png        # Screenshot app
│   ├── img3.png        # Screenshot app
│   ├── img4.png        # Screenshot app
│   ├── img5.png        # Screenshot app
│   ├── img6.png        # Screenshot app
│   ├── img7.png        # Screenshot app
│   └── img8.png        # Screenshot app
└── js/
    ├── app.js          # Lógica principal da aplicação
    ├── controllers/
    │   ├── auth.js     # Controlador de autenticação
    │   ├── posts.js    # Controlador de posts
    │   └── profile.js  # Controlador de perfil
    ├── repositories/
    │   ├── api.js      # Repositório da API
    │   └── storage.js  # Repositório do localStorage
    └── views/
        └── ui.js       # Controlador de interface
\`\`\`

## 🎯 Funcionalidades Detalhadas

### 🔐 Sistema de Autenticação
- **Formulários inteligentes** com validação em tempo real
- **Tokens JWT** armazenados com segurança no localStorage
- **Verificação automática** de sessão ao carregar a página
- **Logout seguro** com limpeza completa de dados
- **Feedback visual** para estados de loading e erro

### 📝 Gerenciamento de Posts
- **Editor intuitivo** com contador de caracteres dinâmico
- **Validação de conteúdo** antes do envio
- **Formatação automática** de datas relativas (ex: "2h", "1 dia")
- **Escape de HTML** para prevenir XSS
- **Confirmação de exclusão** para evitar perdas acidentais

### 👤 Sistema de Perfil
- **Modal responsivo** para edição de dados
- **Validação em tempo real** de username e email
- **Atualização instantânea** da interface após mudanças
- **Histórico completo** de posts do usuário
- **Informações de cadastro** formatadas

### 🎨 Interface e UX
- **Navegação fluida** entre seções sem reload
- **Estados de loading** informativos durante requisições
- **Notificações toast** com auto-dismiss e cores temáticas
- **Animações CSS** suaves para melhor experiência
- **Feedback visual** para todas as interações

### 🔐 Boas Práticas
- Senhas nunca são armazenadas em texto plano
- Tokens têm tempo de expiração
- Validação dupla (frontend + backend)
- Headers de segurança configurados
