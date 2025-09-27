export interface User {
  id: string
  nome_completo: string
  email: string
  cpf: string
  sexo: string
  endereco_completo: string
  data_nascimento: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Simple in-memory storage for demo purposes
let users: User[] = []
let currentUser: User | null = null

export const authService = {
  register: async (userData: {
    nome_completo: string
    email: string
    password: string
    cpf: string
    sexo: string
    endereco_completo: string
    data_nascimento: string
  }): Promise<{ success: boolean; error?: string; user?: User }> => {
    // Check if user already exists
    const existingUser = users.find((u) => u.email === userData.email || u.cpf === userData.cpf)
    if (existingUser) {
      return { success: false, error: "Usuário já existe com este email ou CPF" }
    }

    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      nome_completo: userData.nome_completo,
      email: userData.email,
      cpf: userData.cpf,
      sexo: userData.sexo,
      endereco_completo: userData.endereco_completo,
      data_nascimento: userData.data_nascimento,
      createdAt: new Date(),
    }

    users.push(newUser)
    currentUser = newUser

    if (typeof window !== "undefined") {
      const usersWithPasswords = JSON.parse(localStorage.getItem("usersWithPasswords") || "[]")
      usersWithPasswords.push({
        email: userData.email,
        password: userData.password,
        userId: newUser.id,
      })
      localStorage.setItem("usersWithPasswords", JSON.stringify(usersWithPasswords))
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(newUser))
    }

    return { success: true, user: newUser }
  },

  login: async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    // Load users from localStorage if available
    if (typeof window !== "undefined") {
      const storedUsers = localStorage.getItem("users")
      if (storedUsers) {
        users = JSON.parse(storedUsers)
      }
    }

    if (typeof window !== "undefined") {
      const usersWithPasswords = JSON.parse(localStorage.getItem("usersWithPasswords") || "[]")
      const userCredentials = usersWithPasswords.find((u: any) => u.email === email && u.password === password)

      if (!userCredentials) {
        return { success: false, error: "Email ou senha incorretos" }
      }

      const user = users.find((u) => u.id === userCredentials.userId)
      if (!user) {
        return { success: false, error: "Email ou senha incorretos" }
      }

      currentUser = user

      // Store current user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user))
      return { success: true, user }
    }

    return { success: false, error: "Email ou senha incorretos" }
  },

  logout: async (): Promise<void> => {
    currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window !== "undefined" && !currentUser) {
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        currentUser = JSON.parse(storedUser)
      }
    }
    return currentUser
  },

  resetPassword: async (email: string): Promise<{ success: boolean; error?: string }> => {
    const user = users.find((u) => u.email === email)
    if (!user) {
      return { success: false, error: "Email não encontrado" }
    }

    // In a real app, this would send an email
    console.log(`Password reset email sent to ${email}`)
    return { success: true }
  },

  updateUser: async (userData: {
    nome_completo: string
    email: string
    telefone?: string
    data_nascimento?: string
    endereco?: string
    cidade?: string
    estado?: string
    cep?: string
  }): Promise<{ success: boolean; error?: string; user?: User }> => {
    if (!currentUser) {
      return { success: false, error: "Usuário não autenticado" }
    }

    // Load users from localStorage if available
    if (typeof window !== "undefined") {
      const storedUsers = localStorage.getItem("users")
      if (storedUsers) {
        users = JSON.parse(storedUsers)
      }
    }

    // Find and update user
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex === -1) {
      return { success: false, error: "Usuário não encontrado" }
    }

    // Update user data
    const updatedUser: User = {
      ...users[userIndex],
      nome_completo: userData.nome_completo,
      email: userData.email,
      telefone: userData.telefone,
      data_nascimento: userData.data_nascimento || users[userIndex].data_nascimento,
      endereco: userData.endereco,
      cidade: userData.cidade,
      estado: userData.estado,
      cep: userData.cep,
    }

    users[userIndex] = updatedUser
    currentUser = updatedUser

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }

    return { success: true, user: updatedUser }
  },
}
