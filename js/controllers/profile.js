// Importações necessárias
import { apiRepository } from "../repositories/api_repository.js"
import { StorageRepository } from "../repositories/storage_repository.js"
import { postsController } from "./posts.js"
import { UI } from "../utils/ui.js"

// Controlador de Perfil
class ProfileController {
  constructor() {
    this.initializeEventListeners()
  }

  initializeEventListeners() {
    // Botão editar perfil
    document.getElementById("edit-profile-btn").addEventListener("click", () => {
      this.showEditModal()
    })

    // Fechar modal
    document.getElementById("close-modal").addEventListener("click", () => {
      this.hideEditModal()
    })

    document.getElementById("cancel-edit").addEventListener("click", () => {
      this.hideEditModal()
    })

    // Formulário de edição
    document.getElementById("edit-profile-form").addEventListener("submit", (e) => {
      this.handleUpdateProfile(e)
    })

    // Fechar modal clicando fora
    document.getElementById("edit-profile-modal").addEventListener("click", (e) => {
      if (e.target.id === "edit-profile-modal") {
        this.hideEditModal()
      }
    })
  }

  async loadProfile() {
    try {
      const profile = await apiRepository.getUserProfile()
      this.displayProfile(profile)

      // Carregar posts do usuário
      await postsController.loadUserPosts()
    } catch (error) {
      UI.showToast(error.message || "Erro ao carregar perfil", "error")
    }
  }

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

  showEditModal() {
    const user = StorageRepository.getUser()

    // Preencher formulário com dados atuais
    document.getElementById("edit-username").value = user.username
    document.getElementById("edit-email").value = user.email

    document.getElementById("edit-profile-modal").classList.add("active")
  }

  hideEditModal() {
    document.getElementById("edit-profile-modal").classList.remove("active")
    document.getElementById("edit-profile-form").reset()
  }

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

      const response = await apiRepository.updateUserProfile({ username, email })

      // Atualizar dados no localStorage
      StorageRepository.setUser(response.user)

      // Atualizar exibição do perfil
      this.displayProfile(response.user)

      // Fechar modal
      this.hideEditModal()

      UI.showToast("Perfil atualizado com sucesso!", "success")
    } catch (error) {
      UI.showToast(error.message || "Erro ao atualizar perfil", "error")
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Salvar"
    }
  }
}
