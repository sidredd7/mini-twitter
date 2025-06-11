// Gerenciamento do localStorage
class StorageRepository {
  // Chaves utilizadas no armazenamento local
  static TOKEN_KEY = "mini_twitter_token"
  static USER_KEY = "mini_twitter_user"

  // ---------- TOKEN ----------

  // Salva o token de autenticação no localStorage
  static setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  // Recupera o token salvo no localStorage
  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // Remove o token do localStorage
  static removeToken() {
    localStorage.removeItem(this.TOKEN_KEY)
  }

  // ---------- USUÁRIO ----------

  // Salva os dados do usuário no localStorage (como string JSON)
  static setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  // Recupera os dados do usuário do localStorage (convertendo de volta em objeto)
  static getUser() {
    const user = localStorage.getItem(this.USER_KEY)
    return user ? JSON.parse(user) : null // Se existir, retorna como objeto. Se não, retorna null
  }

  // Remove os dados do usuário do localStorage
  static removeUser() {
    localStorage.removeItem(this.USER_KEY)
  }

  // ---------- GERAL ----------

  // Remove todas as informações salvas (token e usuário)
  static clearAll() {
    this.removeToken()
    this.removeUser()
  }

  // Verifica se o usuário está logado (tem token e dados do usuário)
  static isLoggedIn() {
    return !!(this.getToken() && this.getUser()) // Retorna true se ambos existirem
  }
}
