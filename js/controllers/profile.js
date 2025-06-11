// Importações necessárias de outros módulos da aplicação
import { apiRepository } from "../repositories/api_repository.js"
import { StorageRepository } from "../repositories/storage_repository.js"
import { postsController } from "./posts.js"
import { UI } from "../utils/ui.js"

// Controlador responsável pelas ações relacionadas ao perfil do usuário
class ProfileController {
  constructor() {
    // Inicializa os event listeners quando a instância é criada
    this.initializeEventListeners()
  }

  // Registra os ouvintes de eventos relacionados ao perfil
  initializeEventListeners() {
    // Botão de "Editar Perfil"
    document.getElementById("edit-profile-btn").addEventListener("click", () => {
      this.showEditModal() // Exibe o modal de edição
    })

    // Botão de "Fechar Modal" (ícone X)
    document.getElementById("close-modal").addEventListener("click", () => {
      this.hideEditModal()
    })

    // Botão de "Cancelar" dentro do modal
    document.getElementById("cancel-edit").addEventListener("click", () => {
      this.hideEditModal()
    })

    // Submissão do formulário de edição de perfil
    document.getElementById("edit-profile-form").addEventListener("submit", (e) => {
      this.handleUpdateProfile(e) // Manipula a atualização do perfil
    })

    // Fechar o modal clicando fora da área de conteúdo
    document.getElementById("edit-profile-modal").addEventListener("click", (e) => {
      if (e.target.id === "edit-profile-modal") {
        this.hideEditModal()
      }
    })
  }

  // Carrega os dados do perfil do usuário e exibe na tela
  async loadProfile() {
    try {
      const profile = await apiRepository.getUserProfile() // Busca dados da API
      this.displayProfile(profile) // Atualiza a tela com os dados

      // Também carrega os posts do usuário
      await postsController.loadUserPosts()
    } catch (error) {
      UI.showToast(error.message || "Erro ao carregar perfil", "error")
    }
  }

  // Mostra os dados do perfil na interface
  displayProfile(profile) {
    document.getElementById("profile-username").textContent = `@${profile.username}`
    document.getElementById("profile-email").textContent = profile.email

    // Formata a data de criação da conta
    const joinDate = new Date(profile.createdAt).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    document.getElementById("profile-date").textContent = `Membro desde: ${joinDate}`
  }

  // Exibe o modal de edição de perfil com os dados atuais preenchidos
  showEditModal() {
    const user = StorageRepository.getUser()

    // Preenche o formulário com os dados atuais do usuário
    document.getElementById("edit-username").value = user.username
    document.getElementById("edit-email").value = user.email

    // Exibe o modal
    document.getElementById("edit-profile-modal").classList.add("active")
  }

  // Fecha o modal de edição e limpa o formulário
  hideEditModal() {
    document.getElementById("edit-profile-modal").classList.remove("active")
    document.getElementById("edit-profile-form").reset()
  }

  // Manipula o envio do formulário de edição do perfil
  async handleUpdateProfile(event) {
    event.preventDefault() // Evita o recarregamento da página

    // Obtém os valores dos campos
    const username = document.getElementById("edit-username").value.trim()
    const email = document.getElementById("edit-email").value.trim()
    const submitBtn = event.target.querySelector('button[type="submit"]')

    // Validação básica
    if (!username || !email) {
      UI.showToast("Preencha todos os campos!", "error")
      return
    }

    try {
      // Desabilita o botão e mostra carregando
      submitBtn.disabled = true
      submitBtn.textContent = "Salvando..."

      // Envia os dados atualizados para a API
      const response = await apiRepository.updateUserProfile({ username, email })

      // Atualiza os dados no localStorage
      StorageRepository.setUser(response.user)

      // Atualiza visualmente os dados do perfil
      this.displayProfile(response.user)

      // Fecha o modal
      this.hideEditModal()

      // Notifica o sucesso
      UI.showToast("Perfil atualizado com sucesso!", "success")
    } catch (error) {
      UI.showToast(error.message || "Erro ao atualizar perfil", "error")
    } finally {
      // Restaura o estado do botão
      submitBtn.disabled = false
      submitBtn.textContent = "Salvar"
    }
  }
}
