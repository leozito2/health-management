"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { passwordResetService } from "@/lib/password-reset"
import { Loader2, Lock, Key, ArrowLeft } from "lucide-react"

interface ResetPasswordFormProps {
  email: string
  onBack: () => void
  onSuccess: () => void
}

export function ResetPasswordForm({ email, onBack, onSuccess }: ResetPasswordFormProps) {
  const [step, setStep] = useState<"token" | "password">("token")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const validation = passwordResetService.validateResetToken(email, token)

    if (validation.valid) {
      setStep("password")
    } else {
      setError(validation.error || "Código inválido")
    }

    setIsLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    // Validate token again and mark as used
    const validation = passwordResetService.validateResetToken(email, token)
    if (!validation.valid) {
      setError(validation.error || "Código inválido")
      setIsLoading(false)
      return
    }

    // In a real app, this would update the password in the database
    console.log(`Password reset successful for ${email}`)

    setIsLoading(false)
    onSuccess()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      {step === "token" && (
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold text-primary">Digite o código</CardTitle>
          <CardDescription className="text-muted-foreground">
            Digite o código de 6 dígitos enviado para {email}
          </CardDescription>
        </CardHeader>
      )}
      {step === "password" && (
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold text-primary">Nova senha</CardTitle>
          <CardDescription className="text-muted-foreground">Digite sua nova senha</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {step === "token" && (
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Código de verificação</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="token"
                  type="text"
                  placeholder="123456"
                  value={token}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setToken(value)
                  }}
                  className="pl-10 text-center text-lg tracking-widest font-mono"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">Digite apenas os 6 números do código</p>
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading || token.length !== 6}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verificar Código
            </Button>
          </form>
        )}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Redefinir Senha
            </Button>
          </form>
        )}
        {step === "token" && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
