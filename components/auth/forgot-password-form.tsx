"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResetPasswordForm } from "./reset-password-form"
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react"

interface ForgotPasswordFormProps {
  onBack: () => void
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<"email" | "reset" | "success">("email")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [demoCode, setDemoCode] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Sending reset code to:", email)

      const response = await fetch("/api/send-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      console.log("[v0] Response from send-reset-code:", data)

      if (data.success) {
        if (data.demoCode) {
          setDemoCode(data.demoCode)
          alert(
            `✅ Código de recuperação gerado!\n\n` +
              `📧 Email: ${email}\n` +
              `🔑 Código: ${data.demoCode}\n\n` +
              `⏰ Válido por 15 minutos\n\n` +
              `ℹ️ O código também foi enviado para seu email (se configurado).`,
          )
        }
        setStep("reset")
      } else {
        setError(data.error || "Erro ao enviar email de recuperação")
      }
    } catch (err) {
      console.error("[v0] Error in handleEmailSubmit:", err)
      setError("Erro ao enviar email de recuperação")
    }

    setIsLoading(false)
  }

  const handleResetSuccess = () => {
    setStep("success")
  }

  if (step === "success") {
    return (
      <Card className="w-full max-w-md mx-auto border-gray-200 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-semibold text-primary">Senha redefinida!</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sua senha foi redefinida com sucesso. Você já pode fazer login com a nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            Fazer Login
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === "reset") {
    return <ResetPasswordForm email={email} onBack={() => setStep("email")} onSuccess={handleResetSuccess} />
  }

  return (
    <Card className="w-full max-w-md mx-auto border-gray-200 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Recuperar senha
        </CardTitle>
        <CardDescription className="text-gray-600">
          Digite seu email para receber um código de recuperação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Código
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
