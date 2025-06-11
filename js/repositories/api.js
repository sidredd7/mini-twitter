// Configuração da URL base da API
const API_BASE_URL = "https://mini-twitter-api-vy9q.onrender.com/api"

// Importa o repositório responsável pelo armazenamento local (localStorage)
import { StorageRepository } from "../storage/storage.js"

// Classe responsável por centralizar todas as chamadas à API
class ApiRepository {
  constructor() {
    // Define a URL base da API para ser usada nas requisições
    this.baseURL = API_BASE_URL
  }

  // Método genérico para fazer requisições à API
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}` // Monta a URL completa da requisição
    const token = StorageRepository.getToken() // Busca o token salvo no localStorage

    // Configurações da requisição
    const config = {
      headers: {
        "Content-Type": "application/json", // Define o tipo de conteúdo
        ...options.headers, // Permite adicionar headers adicionais
      },
      ...options, // Inclui demais opções como method, body, etc.
    }

    // Se existir token, adiciona o cabeçalho de autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      // Faz a requisição
      const response = await fetch(url, config)
      const data = await response.json()

      // Se a resposta não for bem-sucedida, lança erro
      if (!response.ok) {
        throw new Error(data.message || `Erro ${response.status}`)
      }

      return data // Retorna os dados da resposta
    } catch (error) {
      console.error("Erro na requisição:", error)
      throw error // Lança o erro para ser tratado onde o método for chamado
    }
  }

  // ---------- AUTENTICAÇÃO ----------

  // Cadastro de novo usuário
  async register(userData) {
    return await this.makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData), // userData deve conter: { username, email, password }
    })
  }

  // Login do usuário
  async login(credentials) {
    return await this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials), // credentials: { email, password }
    })
  }

  // ---------- POSTS ----------

  // Criação de um novo post
  async createPost(content) {
    return await this.makeRequest("/posts", {
      method: "POST",
      body: JSON.stringify({ content }), // Envia apenas o conteúdo do post
    })
  }

  // Busca todos os posts (feed público)
  async getAllPosts() {
    return await this.makeRequest("/posts")
  }

  // Busca apenas os posts do usuário logado
  async getUserPosts() {
    return await this.makeRequest("/posts/my-posts")
  }

  // Deleta um post pelo ID
  async deletePost(postId) {
    return await this.makeRequest(`/posts/${postId}`, {
      method: "DELETE",
    })
  }

  // ---------- USUÁRIO ----------

  // Busca o perfil do usuário logado
  async getUserProfile() {
    return await this.makeRequest("/users/profile")
  }

  // Atualiza o perfil do usuário
  async updateUserProfile(userData) {
    return await this.makeRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData), // userData: { username, email }
    })
  }
}

// Cria uma instância global da API para ser usada em toda a aplicação
const apiRepository = new ApiRepository()
