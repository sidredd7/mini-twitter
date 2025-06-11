const API_BASE_URL = "https://mini-twitter-api-vy9q.onrender.com/api"

// Classe para manipular o armazenamento local (localStorage)
class Storage {
  // Armazena o token de autenticação
  static setToken(token) {
    localStorage.setItem("mini_twitter_token", token)
  }

  // Recupera o token de autenticação
  static getToken() {
    return localStorage.getItem("mini_twitter_token")
  }

  // Armazena os dados do usuário
  static setUser(user) {
    localStorage.setItem("mini_twitter_user", JSON.stringify(user))
  }

  // Recupera os dados do usuário
  static getUser() {
    const user = localStorage.getItem("mini_twitter_user")
    return user ? JSON.parse(user) : null
  }

  // Define e aplica o tema (claro ou escuro)
  static setTheme(theme) {
    localStorage.setItem("mini_twitter_theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }

  // Recupera o tema atual, padrão é "light"
  static getTheme() {
    return localStorage.getItem("mini_twitter_theme") || "light"
  }

  // Remove token e usuário do localStorage (logout)
  static clear() {
    localStorage.removeItem("mini_twitter_token")
    localStorage.removeItem("mini_twitter_user")
  }

  // Verifica se o usuário está logado
  static isLoggedIn() {
    return !!(this.getToken() && this.getUser())
  }
}

// Classe responsável por fazer requisições à API
class API {
  // Função genérica para fazer requisições à API
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const token = Storage.getToken()

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Adiciona token de autenticação no cabeçalho se existir
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      // Verifica se houve erro na resposta
      if (!response.ok) {
        throw new Error(data.message || `Erro ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("Erro na API:", error)
      throw error
    }
  }

  // Realiza o login do usuário
  static async login(email, password) {
    return await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  // Registra novo usuário
  static async register(username, email, password) {
    return await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    })
  }

  // Cria um novo post
  static async createPost(content) {
    return await this.request("/posts", {
      method: "POST",
      body: JSON.stringify({ content }),
    })
  }

  // Busca todos os posts do feed
  static async getAllPosts() {
    return await this.request("/posts")
  }

  // Busca apenas os posts do usuário logado
  static async getUserPosts() {
    return await this.request("/posts/my-posts")
  }

  // Deleta um post pelo ID
  static async deletePost(postId) {
    return await this.request(`/posts/${postId}`, {
      method: "DELETE",
    })
  }

  // Busca o perfil do usuário
  static async getProfile() {
    return await this.request("/users/profile")
  }

  // Atualiza o perfil do usuário
  static async updateProfile(username, email) {
    return await this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify({ username, email }),
    })
  }
}

// Classe de utilidades para a interface do usuário (UI)
class UI {
  // Exibe uma notificação (toast) na tela
  static showToast(message, type = "success") {
    const toast = document.getElementById("toast")
    toast.textContent = message
    toast.className = `toast ${type}`
    toast.classList.add("show")

    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => {
        toast.textContent = ""
      }, 300)
    }, 3000)
  }

  // Exibe mensagem de erro em um elemento específico
  static showError(elementId, message) {
    const errorElement = document.getElementById(elementId)
    if (errorElement) {
      errorElement.textContent = message
    }
  }

  // Limpa mensagens de erro de um elemento
  static clearError(elementId) {
    const errorElement = document.getElementById(elementId)
    if (errorElement) {
      errorElement.textContent = ""
    }
  }

  // Exibe uma tela específica da aplicação (auth ou main)
  static showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active")
    })
    document.getElementById(screenId).classList.add("active")
  }

  // Alterna entre seções do conteúdo principal (feed ou perfil)
  static showSection(sectionId) {
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.getElementById(`${sectionId}-btn`).classList.add("active")

    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active")
    })
    document.getElementById(`${sectionId}-section`).classList.add("active")
  }
}

// Classe para controle de tema (claro/escuro)
class ThemeManager {
  // Inicializa o tema salvo
  static init() {
    const savedTheme = Storage.getTheme()
    this.setTheme(savedTheme)
    this.updateThemeIcon(savedTheme)
  }

  // Alterna entre os temas
  static toggle() {
    const currentTheme = Storage.getTheme()
    const newTheme = currentTheme === "light" ? "dark" : "light"
    this.setTheme(newTheme)
    this.updateThemeIcon(newTheme)
  }

  // Define o tema
  static setTheme(theme) {
    Storage.setTheme(theme)
  }

  // Atualiza o ícone do tema
  static updateThemeIcon(theme) {
    const themeIcon = document.querySelector(".theme-icon")
    if (themeIcon) {
      themeIcon.textContent = theme === "light" ? "☾" : "☀"
    }
  }
}
// Classe principal que gerencia toda a aplicação
class MiniTwitter {
  constructor() {
    this.init()
  }

  // Inicializa a aplicação
  init() {
    ThemeManager.init() // Carrega o tema salvo
    this.setupEventListeners() // Configura todos os eventos
    this.checkAuthStatus() // Verifica se o usuário está logado
  }

  // Configura os eventos da interface
  setupEventListeners() {
    this.setupAuthListeners()       // Eventos de autenticação (login, cadastro)
    this.setupNavigationListeners() // Navegação entre telas
    this.setupPostListeners()       // Eventos relacionados a posts
    this.setupProfileListeners()    // Eventos do perfil do usuário
    this.setupThemeListener()       // Botão de alternar tema
  }

  // Evento para alternar entre tema claro e escuro
  setupThemeListener() {
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        ThemeManager.toggle()
      })
    }
  }

  // Configura os eventos da parte de autenticação
  setupAuthListeners() {
    document.getElementById("login-tab").addEventListener("click", () => {
      this.switchAuthTab("login")
    })

    document.getElementById("register-tab").addEventListener("click", () => {
      this.switchAuthTab("register")
    })

    document.getElementById("login-form").addEventListener("submit", (e) => {
      this.handleLogin(e)
    })

    document.getElementById("register-form").addEventListener("submit", (e) => {
      this.handleRegister(e)
    })

    document.getElementById("logout-btn").addEventListener("click", () => {
      this.handleLogout()
    })
  }

  // Configura os eventos de navegação entre seções (feed e perfil)
  setupNavigationListeners() {
    // Clicando no logo volta para o feed
    document.querySelectorAll(".auth-header h1, .header-content h1").forEach((logo) => {
      logo.addEventListener("click", () => {
        this.goToFeed()
      })
      logo.style.cursor = "pointer"
    })

    document.getElementById("feed-btn").addEventListener("click", () => {
      UI.showSection("feed")
      this.loadFeed()
    })

    document.getElementById("profile-btn").addEventListener("click", () => {
      UI.showSection("profile")
      this.loadProfile()
      this.loadUserPosts()
    })
  }

  // Configura os eventos do formulário de criação de post
  setupPostListeners() {
    document.getElementById("post-form").addEventListener("submit", (e) => {
      this.handleCreatePost(e)
    })

    document.getElementById("post-content").addEventListener("input", (e) => {
      this.updateCharCount(e.target.value)
    })
  }

  // Configura os eventos da edição de perfil
  setupProfileListeners() {
    document.getElementById("edit-profile-btn").addEventListener("click", () => {
      this.showEditModal()
    })

    document.getElementById("close-modal").addEventListener("click", () => {
      this.hideEditModal()
    })

    document.getElementById("cancel-edit").addEventListener("click", () => {
      this.hideEditModal()
    })

    document.getElementById("edit-profile-form").addEventListener("submit", (e) => {
      this.handleUpdateProfile(e)
    })

    // Fecha o modal se o usuário clicar fora do conteúdo
    document.getElementById("edit-profile-modal").addEventListener("click", (e) => {
      if (e.target.id === "edit-profile-modal") {
        this.hideEditModal()
      }
    })
  }

  // Navega para o feed ou para tela de login/cadastro, dependendo se o usuário está logado
  goToFeed() {
    if (Storage.isLoggedIn()) {
      UI.showScreen("main-screen")
      UI.showSection("feed")
      this.loadFeed()
    } else {
      UI.showScreen("auth-screen")
    }
  }

  // Alterna entre as abas de login e cadastro
  switchAuthTab(tab) {
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.getElementById(`${tab}-tab`).classList.add("active")

    document.querySelectorAll(".auth-form").forEach((form) => {
      form.classList.remove("active")
    })
    document.getElementById(`${tab}-form`).classList.add("active")

    UI.clearError("auth-error")
  }

  // Processa o login
  async handleLogin(event) {
    event.preventDefault()

    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value
    const submitBtn = event.target.querySelector('button[type="submit"]')

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Entrando..."

      const response = await API.login(email, password)

      Storage.setToken(response.token)
      Storage.setUser(response.user)

      this.showMainScreen()
      UI.showToast("Bem-vindo de volta!", "success")
    } catch (error) {
      UI.showError("auth-error", error.message)
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Entrar"
    }
  }

  // Processa o cadastro
  async handleRegister(event) {
    event.preventDefault()

    const username = document.getElementById("register-username").value
    const email = document.getElementById("register-email").value
    const password = document.getElementById("register-password").value
    const submitBtn = event.target.querySelector('button[type="submit"]')

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Cadastrando..."

      const response = await API.register(username, email, password)

      Storage.setToken(response.token)
      Storage.setUser(response.user)

      this.showMainScreen()
      UI.showToast("Conta criada! Bem-vindo ao Mini Twitter!", "success")
    } catch (error) {
      UI.showError("auth-error", error.message)
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Cadastrar"
    }
  }

  // Processa o logout
  handleLogout() {
    Storage.clear()
    UI.showScreen("auth-screen")
    UI.showToast("Até logo! Volte sempre!", "success")

    document.getElementById("login-form").reset()
    document.getElementById("register-form").reset()
  }

  // Atualiza o contador de caracteres do post
  updateCharCount(content) {
    const maxChars = 280
    const remaining = maxChars - content.length
    const charCountEl = document.getElementById("char-count")
    const submitBtn = document.querySelector('#post-form button[type="submit"]')

    charCountEl.textContent = remaining

    if (remaining < 20) {
      charCountEl.classList.add("warning")
    } else {
      charCountEl.classList.remove("warning")
    }

    submitBtn.disabled = content.trim().length === 0 || remaining < 0
  }
  // Cria e publica um novo post
  async handleCreatePost(event) {
    event.preventDefault()

    const content = document.getElementById("post-content").value.trim()
    const submitBtn = event.target.querySelector('button[type="submit"]')

    if (!content) {
      UI.showToast("Escreva algo interessante!", "error")
      return
    }

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Postando..."

      await API.createPost(content) // Envia post para a API

      document.getElementById("post-content").value = ""
      this.updateCharCount("") // Reseta contador

      await this.loadFeed() // Recarrega feed
      UI.showToast("Post publicado!", "success")
    } catch (error) {
      UI.showToast(error.message, "error")
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Tweetar"
    }
  }

  // Carrega todos os posts do feed
  async loadFeed() {
    const container = document.getElementById("posts-container")

    try {
      container.innerHTML = '<div class="loading">Carregando posts...</div>'

      const posts = await API.getAllPosts()

      if (posts.length === 0) {
        container.innerHTML = '<div class="loading">Seja o primeiro a postar!</div>'
        return
      }

      // Renderiza todos os posts no container
      container.innerHTML = posts.map((post) => this.createPostHTML(post)).join("")
      this.attachDeleteListeners() // Ativa botões de deletar
    } catch (error) {
      container.innerHTML = '<div class="loading">Ops! Erro ao carregar posts</div>'
      UI.showToast(error.message, "error")
    }
  }

  // Carrega os posts do usuário logado
  async loadUserPosts() {
    const container = document.getElementById("user-posts-container")

    try {
      container.innerHTML = '<div class="loading">Carregando seus posts...</div>'

      const posts = await API.getUserPosts()

      if (posts.length === 0) {
        container.innerHTML = '<div class="loading">Você ainda não fez nenhum post</div>'
        return
      }

      container.innerHTML = posts.map((post) => this.createPostHTML(post, true)).join("")
      this.attachDeleteListeners()
    } catch (error) {
      container.innerHTML = '<div class="loading">Erro ao carregar posts</div>'
      UI.showToast(error.message, "error")
    }
  }

  // Cria o HTML de um post
  createPostHTML(post, showDeleteBtn = false) {
    const currentUser = Storage.getUser()
    const canDelete = showDeleteBtn || (currentUser && post.author._id === currentUser.id)

    return `
      <article class="post">
        <div class="post-header">
          <span class="post-author">@${post.author.username}</span>
          <span class="post-date">${this.formatDate(post.createdAt)}</span>
        </div>
        <div class="post-content">${this.escapeHtml(post.content)}</div>
        ${
          canDelete
            ? `
          <div class="post-actions">
            <button class="delete-btn" data-post-id="${post._id}">Deletar</button>
          </div>
        `
            : ""
        }
      </article>
    `
  }

  // Ativa os botões de deletar posts
  attachDeleteListeners() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const postId = e.target.dataset.postId
        this.handleDeletePost(postId)
      })
    })
  }

  // Deleta um post após confirmação
  async handleDeletePost(postId) {
    if (!confirm("Tem certeza que deseja deletar este post?")) {
      return
    }

    try {
      await API.deletePost(postId)
      await this.loadFeed()
      await this.loadUserPosts()
      UI.showToast("Post deletado!", "success")
    } catch (error) {
      UI.showToast(error.message, "error")
    }
  }

  // Carrega e exibe os dados do perfil do usuário
  async loadProfile() {
    try {
      const profile = await API.getProfile()
      this.displayProfile(profile)
    } catch (error) {
      UI.showToast(error.message, "error")
    }
  }

  // Exibe as informações do perfil na interface
  displayProfile(profile) {
    document.getElementById("profile-username").textContent = `@${profile.username}`
    document.getElementById("profile-email").textContent = profile.email

    const joinDate = new Date(profile.createdAt).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    document.getElementById("profile-date").textContent = `Membro desde: ${joinDate}`
  }

  // Abre o modal para editar perfil
  showEditModal() {
    const user = Storage.getUser()
    document.getElementById("edit-username").value = user.username
    document.getElementById("edit-email").value = user.email
    document.getElementById("edit-profile-modal").classList.add("active")
  }

  // Fecha o modal de edição
  hideEditModal() {
    document.getElementById("edit-profile-modal").classList.remove("active")
    document.getElementById("edit-profile-form").reset()
  }

  // Atualiza os dados do perfil
  async handleUpdateProfile(event) {
    event.preventDefault()

    const username = document.getElementById("edit-username").value.trim()
    const email = document.getElementById("edit-email").value.trim()
    const submitBtn = event.target.querySelector('button[type="submit"]')

    if (!username || !email) {
      UI.showToast("Preencha todos os campos!", "error")
      return
    }

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Salvando..."

      const response = await API.updateProfile(username, email)

      Storage.setUser(response.user)
      this.displayProfile(response.user)
      this.hideEditModal()

      UI.showToast("Perfil atualizado!", "success")
    } catch (error) {
      UI.showToast(error.message, "error")
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Salvar"
    }
  }

  // Mostra a tela principal (feed) após login/cadastro
  showMainScreen() {
    UI.showScreen("main-screen")
    UI.showSection("feed")
    this.loadFeed()
  }

  // Verifica se o usuário está logado e redireciona para a tela correta
  checkAuthStatus() {
    if (Storage.isLoggedIn()) {
      this.showMainScreen()
    } else {
      UI.showScreen("auth-screen")
    }
  }

  // Formata a data do post para exibir de forma legível
  formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return "agora"
    if (diffInMinutes < 60) return `${diffInMinutes}min`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Escapa HTML para evitar scripts maliciosos
  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}

// Inicializa o app assim que a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new MiniTwitter()
})
