// Importações necessárias
import { apiRepository } from "../repositories/apiRepository.js"
import { StorageRepository } from "../repositories/storageRepository.js"
import { UI } from "../ui.js"
import { postsController } from "./posts.js"
import { profileController } from "./profile.js"

// Controlador de Autenticação
class AuthController {
  constructor() {
    this.initializeEventListeners()
  }

  initializeEventListeners() {
    // Tabs de login/cadastro
    document.getElementById("login-tab").addEventListener("click", () => {
      this.switchTab("login")
    })

    document.getElementById("register-tab").addEventListener("click", () => {
      this.switchTab("register")
    })

    // Formulários
    document.getElementById("login-form").addEventListener("submit", (e) => {
      this.handleLogin(e)
    })

    document.getElementById("register-form").addEventListener("submit", (e) => {
      this.handleRegister(e)
    })

    // Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
      this.handleLogout()
    })
  }

  switchTab(tab) {
    // Atualizar tabs
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.getElementById(`${tab}-tab`).classList.add("active")

    // Atualizar formulários
    document.querySelectorAll(".auth-form").forEach((form) => {
      form.classList.remove("active")
    })
    document.getElementById(`${tab}-form`).classList.add("active")
  }

  async handleLogin(event) {
    event.preventDefault()

    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value
    const submitBtn = event.target.querySelector('button[type="submit"]')

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Entrando..."

      const response = await apiRepository.login({ email, password })

      // Salvar dados no localStorage
      StorageRepository.setToken(response.token)
      StorageRepository.setUser(response.user)

      // Mostrar tela principal
      this.showMainScreen()

      UI.showToast("Login realizado com sucesso!", "success")
    } catch (error) {
      UI.showToast(error.message || "Erro ao fazer login", "error")
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Entrar"
    }
  }

  async handleRegister(event) {
    event.preventDefault()

    const username = document.getElementById("register-username").value
    const email = document.getElementById("register-email").value
    const password = document.getElementById("register-password").value
    const submitBtn = event.target.querySelector('button[type="submit"]')

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Cadastrando..."

      const response = await apiRepository.register({ username, email, password })

      // Salvar dados no localStorage
      StorageRepository.setToken(response.token)
      StorageRepository.setUser(response.user)

      // Mostrar tela principal
      this.showMainScreen()

      UI.showToast("Conta criada com sucesso!", "success")
    } catch (error) {
      UI.showToast(error.message || "Erro ao criar conta", "error")
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Cadastrar"
    }
  }

  handleLogout() {
    StorageRepository.clearAll()
    this.showAuthScreen()
    UI.showToast("Logout realizado com sucesso!", "success")
  }

  showAuthScreen() {
    document.getElementById("auth-screen").classList.add("active")
    document.getElementById("main-screen").classList.remove("active")

    // Limpar formulários
    document.getElementById("login-form").reset()
    document.getElementById("register-form").reset()
  }

  showMainScreen() {
    document.getElementById("auth-screen").classList.remove("active")
    document.getElementById("main-screen").classList.add("active")

    // Carregar dados iniciais
    postsController.loadFeed()
    profileController.loadProfile()
  }

  // Verificar se usuário está logado ao carregar a página
  checkAuthStatus() {
    if (StorageRepository.isLoggedIn()) {
      this.showMainScreen()
    } else {
      this.showAuthScreen()
    }
  }
}
