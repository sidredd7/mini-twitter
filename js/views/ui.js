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
