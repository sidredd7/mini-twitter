// Importações necessárias de outros módulos
import { apiRepository } from "../repositories/apiRepository.js"
import { StorageRepository } from "../repositories/storageRepository.js"
import { UI } from "../ui.js"
import { postsController } from "./posts.js"
import { profileController } from "./profile.js"

// Controlador responsável por autenticação de usuários (login, cadastro e logout)
class AuthController {
  constructor() {
    // Inicializa os event listeners ao criar a instância
    this.initializeEventListeners()
  }

  // Adiciona os manipuladores de eventos da interface de autenticação
  initializeEventListeners() {
    // Alterna entre abas "Login" e "Cadastro"
    document.getElementById("login-tab").addEventListener("click", () => {
      this.switchTab("login")
    })

    document.getElementById("register-tab").addEventListener("click", () => {
      this.switchTab("register")
    })

    // Submissão dos formulários de login e cadastro
    document.getElementById("login-form").addEventListener("submit", (e) => {
      this.handleLogin(e)
    })

    document.getElementById("register-form").addEventListener("submit", (e) => {
      this.handleRegister(e)
    })

    // Botão de logout
    document.getElementById("logout-btn").addEventListener("click", () => {
      this.handleLogout()
    })
  }

  // Alterna visualmente entre as abas de login e cadastro
  switchTab(tab) {
    // Remove a classe "active" de todos os botões de aba
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active")
    })
    // Ativa a aba atual
    document.getElementById(`${tab}-tab`).classList.add("active")

    // Esconde os formulários e mostra o selecionado
    document.querySelectorAll(".auth-form").forEach((form) => {
      form.classList.remove("active")
    })
    document.getElementById(`${tab}-form`).classList.add("active")
  }

  // Manipula o processo de login do usuário
  async handleLogin(event) {
    event.preventDefault()

    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value
    const submitBtn = event.target.querySelector('button[type="submit"]')

    try {
      // Mostra estado de carregamento no botão
      submitBtn.disabled = true
      submitBtn.textContent = "Entrando..."

      // Envia dados para a API
      const response = await apiRepository.login({ email, password })

      // Armazena token e dados do usuário no localStorage
      StorageRepository.setToken(response.token)
      StorageRepository.setUser(response.user)

      // Exibe a tela principal do app
      this.showMainScreen()

      UI.showToast("Login realizado com sucesso!", "success")
    } catch (error) {
      UI.showToast(error.message || "Erro ao fazer login", "error")
    } finally {
      // Restaura o botão
      submitBtn.disabled = false
      submitBtn.textContent = "Entrar"
    }
  }

  // Manipula o processo de registro/cadastro
  async handleRegister(event) {
    event.preventDefault()

    const username = document.getElementById("register-username").value
    const email = document.getElementById("register-email").value
    const password = document.getElementById("register-password").value
    const submitBtn = event.target.querySelector('button[type="submit"]')

    try {
      submitBtn.disabled = true
      submitBtn.textContent = "Cadastrando..."

      // Envia dados de cadastro para a API
      const response = await apiRepository.register({ username, email, password })

      // Salva token e usuário no localStorage
      StorageRepository.setToken(response.token)
      StorageRepository.setUser(response.user)

      // Exibe a tela principal
      this.showMainScreen()

      UI.showToast("Conta criada com sucesso!", "success")
    } catch (error) {
      UI.showToast(error.message || "Erro ao criar conta", "error")
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "Cadastrar"
    }
  }

  // Realiza logout do usuário
  handleLogout() {
    // Remove token e dados do usuário do localStorage
    StorageRepository.clearAll()
    this.showAuthScreen()
    UI.showToast("Logout realizado com sucesso!", "success")
  }

  // Mostra a tela de autenticação (login/cadastro)
  showAuthScreen() {
    document.getElementById("auth-screen").classList.add("active")
    document.getElementById("main-screen").classList.remove("active")

    // Limpa os formulários
    document.getElementById("login-form").reset()
    document.getElementById("register-form").reset()
  }

  // Mostra a tela principal do sistema após login/cadastro
  showMainScreen() {
    document.getElementById("auth-screen").classList.remove("active")
    document.getElementById("main-screen").classList.add("active")

    // Carrega dados iniciais do usuário e do feed
    postsController.loadFeed()
    profileController.loadProfile()
  }

  // Verifica o status de login ao carregar a aplicação
  checkAuthStatus() {
    if (StorageRepository.isLoggedIn()) {
      this.showMainScreen()
    } else {
      this.showAuthScreen()
    }
  }
}
