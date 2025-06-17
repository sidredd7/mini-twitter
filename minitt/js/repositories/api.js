// Configuração da API
const API_BASE_URL = "https://mini-twitter-api-vy9q.onrender.com/api"

// Importar StorageRepository
import { StorageRepository } from "../storage/storage.js"

class ApiRepository {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Método auxiliar para fazer requisições
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = StorageRepository.getToken()

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Adicionar token de autorização se existir
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Erro ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("Erro na requisição:", error)
      throw error
    }
  }

  // Autenticação
  async register(userData) {
    return await this.makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials) {
    return await this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  // Posts
  async createPost(content) {
    return await this.makeRequest("/posts", {
      method: "POST",
      body: JSON.stringify({ content }),
    })
  }

  async getAllPosts() {
    return await this.makeRequest("/posts")
  }

  async getUserPosts() {
    return await this.makeRequest("/posts/my-posts")
  }

  async deletePost(postId) {
    return await this.makeRequest(`/posts/${postId}`, {
      method: "DELETE",
    })
  }

  // Usuário
  async getUserProfile() {
    return await this.makeRequest("/users/profile")
  }

  async updateUserProfile(userData) {
    return await this.makeRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }
}

// Instância global da API
const apiRepository = new ApiRepository()
