// Controlador de Posts
class PostsController {
  constructor() {
    this.initializeEventListeners()
  }

  initializeEventListeners() {
    // Formulário de novo post
    document.getElementById("post-form").addEventListener("submit", (e) => {
      this.handleCreatePost(e)
    })

    // Contador de caracteres
    document.getElementById("post-content").addEventListener("input", (e) => {
      this.updateCharCount(e.target.value)
    })
  }

  updateCharCount(content) {
    const maxChars = 280
    const remaining = maxChars - content.length
    const charCountEl = document.getElementById("char-count")

    charCountEl.textContent = remaining

    if (remaining < 20) {
      charCountEl.classList.add("warning")
    } else {
      charCountEl.classList.remove("warning")
    }

    // Desabilitar botão se exceder limite
    const submitBtn = document.querySelector('#post-form button[type="submit"]')
    submitBtn.disabled = remaining < 0
  }

  async handleCreatePost(event) {
    event.preventDefault()

    const content = document.getElementById("post-content").value.trim()
    const submitBtn = event.target.querySelector('button[type="submit"]')

    if (!content) {
      UI.showToast("Digite algo para postar!", "error")
      return
    }

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Postando..."

      await apiRepository.createPost(content)

      // Limpar formulário
      document.getElementById("post-content").value = ""
      this.updateCharCount("")

      // Recarregar feed
      await this.loadFeed()

      UI.showToast("Post criado com sucesso!", "success")
    } catch (error) {
      UI.showToast(error.message || "Erro ao criar post", "error")
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Tweetar"
    }
  }

  async loadFeed() {
    const container = document.getElementById("posts-container")

    try {
      container.innerHTML = '<div class="loading">Carregando posts...</div>'

      const posts = await apiRepository.getAllPosts()

      if (posts.length === 0) {
        container.innerHTML = '<div class="loading">Nenhum post encontrado</div>'
        return
      }

      container.innerHTML = posts.map((post) => this.createPostHTML(post)).join("")

      // Adicionar event listeners para botões de deletar
      this.attachDeleteListeners()
    } catch (error) {
      container.innerHTML = '<div class="loading">Erro ao carregar posts</div>'
      UI.showToast(error.message || "Erro ao carregar feed", "error")
    }
  }

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

      // Adicionar event listeners para botões de deletar
      this.attachDeleteListeners()
    } catch (error) {
      container.innerHTML = '<div class="loading">Erro ao carregar posts</div>'
      UI.showToast(error.message || "Erro ao carregar seus posts", "error")
    }
  }

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

  attachDeleteListeners() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const postId = e.target.dataset.postId
        this.handleDeletePost(postId)
      })
    })
  }

  async handleDeletePost(postId) {
    if (!confirm("Tem certeza que deseja deletar este post?")) {
      return
    }

    try {
      await apiRepository.deletePost(postId)

      // Recarregar feeds
      await this.loadFeed()
      await this.loadUserPosts()

      UI.showToast("Post deletado com sucesso!", "success")
    } catch (error) {
      UI.showToast(error.message || "Erro ao deletar post", "error")
    }
  }

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

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}
