// Controlador de Posts
class PostsController {
  constructor() {
    this.initializeEventListeners()
  }

  // Inicializa os event listeners da interface de posts
  initializeEventListeners() {
    // Submissão do formulário de novo post
    document.getElementById("post-form").addEventListener("submit", (e) => {
      this.handleCreatePost(e)
    })

    // Atualiza o contador de caracteres enquanto o usuário digita
    document.getElementById("post-content").addEventListener("input", (e) => {
      this.updateCharCount(e.target.value)
    })
  }

  // Atualiza contador de caracteres e aplica lógica de limite
  updateCharCount(content) {
    const maxChars = 280
    const remaining = maxChars - content.length
    const charCountEl = document.getElementById("char-count")

    // Mostra número de caracteres restantes
    charCountEl.textContent = remaining

    // Aplica estilo de aviso se restarem poucos caracteres
    if (remaining < 20) {
      charCountEl.classList.add("warning")
    } else {
      charCountEl.classList.remove("warning")
    }

    // Desabilita o botão de postar se ultrapassar o limite
    const submitBtn = document.querySelector('#post-form button[type="submit"]')
    submitBtn.disabled = remaining < 0
  }

  // Lida com a criação de um novo post
  async handleCreatePost(event) {
    event.preventDefault()

    const content = document.getElementById("post-content").value.trim()
    const submitBtn = event.target.querySelector('button[type="submit"]')

    // Valida se há conteúdo
    if (!content) {
      UI.showToast("Digite algo para postar!", "error")
      return
    }

    try {
      // Feedback de carregamento
      submitBtn.disabled = true
      submitBtn.textContent = "Postando..."

      // Cria o post via API
      await apiRepository.createPost(content)

      // Limpa formulário e contador
      document.getElementById("post-content").value = ""
      this.updateCharCount("")

      // Recarrega o feed
      await this.loadFeed()

      UI.showToast("Post criado com sucesso!", "success")
    } catch (error) {
      UI.showToast(error.message || "Erro ao criar post", "error")
    } finally {
      // Restaura o botão
      submitBtn.disabled = false
      submitBtn.textContent = "Tweetar"
    }
  }

  // Carrega todos os posts do feed público
  async loadFeed() {
    const container = document.getElementById("posts-container")

    try {
      container.innerHTML = '<div class="loading">Carregando posts...</div>'

      const posts = await apiRepository.getAllPosts()

      if (posts.length === 0) {
        container.innerHTML = '<div class="loading">Nenhum post encontrado</div>'
        return
      }

      // Exibe os posts no HTML
      container.innerHTML = posts.map((post) => this.createPostHTML(post)).join("")

      // Adiciona os botões de deletar
      this.attachDeleteListeners()
    } catch (error) {
      container.innerHTML = '<div class="loading">Erro ao carregar posts</div>'
      UI.showToast(error.message || "Erro ao carregar feed", "error")
    }
  }

  // Carrega apenas os posts do usuário logado
  async loadUserPosts() {
    const container = document.getElementById("user-posts-container")

    try {
      container.innerHTML = '<div class="loading">Carregando seus posts...</div>'

      const posts = await apiRepository.getUserPosts()

      if (posts.length === 0) {
        container.innerHTML = '<div class="loading">Você ainda não fez nenhum post</div>'
        return
      }

      container.innerHTML = posts.map((post) => this.createPostHTML(post, true)).join("")

      this.attachDeleteListeners()
    } catch (error) {
      container.innerHTML = '<div class="loading">Erro ao carregar posts</div>'
      UI.showToast(error.message || "Erro ao carregar seus posts", "error")
    }
  }

  // Cria o HTML de um post individual, com opção de botão "Deletar"
  createPostHTML(post, showDeleteBtn = false) {
    const currentUser = StorageRepository.getUser()
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

  // Adiciona os eventos aos botões "Deletar"
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
      await apiRepository.deletePost(postId)

      // Recarrega o feed e os posts do usuário
      await this.loadFeed()
      await this.loadUserPosts()

      UI.showToast("Post deletado com sucesso!", "success")
    } catch (error) {
      UI.showToast(error.message || "Erro ao deletar post", "error")
    }
  }

  // Formata a data do post para exibição legível
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

  // Evita execução de HTML malicioso (XSS)
  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}
