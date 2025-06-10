// Controlador de Interface
class UI {
  static showToast(message, type = "success") {
    const toast = document.getElementById("toast")

    toast.textContent = message
    toast.className = `toast ${type}`
    toast.classList.add("show")

    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }

  static initializeNavigation() {
    // Navegação entre seções
    document.getElementById("feed-btn").addEventListener("click", () => {
      this.showSection("feed")
    })

    document.getElementById("profile-btn").addEventListener("click", () => {
      this.showSection("profile")
    })
  }

  static showSection(section) {
    // Atualizar botões de navegação
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.getElementById(`${section}-btn`).classList.add("active")

    // Atualizar seções
    document.querySelectorAll(".content-section").forEach((sec) => {
      sec.classList.remove("active")
    })
    document.getElementById(`${section}-section`).classList.add("active")

    // Carregar dados específicos da seção
    if (section === "profile") {
      profileController.loadProfile()
    } else if (section === "feed") {
      postsController.loadFeed()
    }
  }
}
