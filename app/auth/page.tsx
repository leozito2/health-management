"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Heart } from "lucide-react"

type AuthMode = "login" | "register" | "forgot-password"

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login")
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              MedCare
            </h1>
          </div>
          <p className="text-gray-600">Sistema de Gerenciamento de Saúde</p>
        </div>

        {mode === "login" && (
          <LoginForm onToggleMode={() => setMode("register")} onForgotPassword={() => setMode("forgot-password")} />
        )}

        {mode === "register" && <RegisterForm onToggleMode={() => setMode("login")} />}

        {mode === "forgot-password" && <ForgotPasswordForm onBack={() => setMode("login")} />}
      </div>
    </div>
  )
}
