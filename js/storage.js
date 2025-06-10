// Gerenciamento do localStorage
class StorageRepository {
  static TOKEN_KEY = "mini_twitter_token"
  static USER_KEY = "mini_twitter_user"

  // Token
  static setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static removeToken() {
    localStorage.removeItem(this.TOKEN_KEY)
  }

  // Usuário
  static setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  static getUser() {
    const user = localStorage.getItem(this.USER_KEY)
    return user ? JSON.parse(user) : null
  }

  static removeUser() {
    localStorage.removeItem(this.USER_KEY)
  }

  // Limpar todos os dados
  static clearAll() {
    this.removeToken()
    this.removeUser()
  }

  // Verificar se usuário está logado
  static isLoggedIn() {
    return !!(this.getToken() && this.getUser())
  }
}
