"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">HealthCare Manager</h1>
          <p className="text-muted-foreground">Sistema de Gerenciamento de Saúde</p>
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
