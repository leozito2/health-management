interface PasswordResetToken {
  email: string
  token: string
  expiresAt: Date
  used: boolean
}

// Simple in-memory storage for demo purposes
let resetTokens: PasswordResetToken[] = []

export const passwordResetService = {
  generateResetToken: (email: string): string => {
    // Generate a 6-digit code
    const token = Math.floor(100000 + Math.random() * 900000).toString()

    // Remove any existing tokens for this email
    resetTokens = resetTokens.filter((rt) => rt.email !== email)

    // Create new token that expires in 15 minutes
    const resetToken: PasswordResetToken = {
      email,
      token,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      used: false,
    }

    resetTokens.push(resetToken)

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("resetTokens", JSON.stringify(resetTokens))
    }

    return token
  },

  validateResetToken: (email: string, token: string): { valid: boolean; error?: string } => {
    // Load tokens from localStorage if available
    if (typeof window !== "undefined") {
      const storedTokens = localStorage.getItem("resetTokens")
      if (storedTokens) {
        resetTokens = JSON.parse(storedTokens).map((rt: any) => ({
          ...rt,
          expiresAt: new Date(rt.expiresAt),
        }))
      }
    }

    const resetToken = resetTokens.find((rt) => rt.email === email && rt.token === token)

    if (!resetToken) {
      return { valid: false, error: "Código inválido" }
    }

    if (resetToken.used) {
      return { valid: false, error: "Código já foi utilizado" }
    }

    if (resetToken.expiresAt < new Date()) {
      return { valid: false, error: "Código expirado" }
    }

    return { valid: true }
  },

  useResetToken: (email: string, token: string): boolean => {
    const resetToken = resetTokens.find((rt) => rt.email === email && rt.token === token)

    if (resetToken) {
      resetToken.used = true

      // Store updated tokens
      if (typeof window !== "undefined") {
        localStorage.setItem("resetTokens", JSON.stringify(resetTokens))
      }

      return true
    }

    return false
  },
}
