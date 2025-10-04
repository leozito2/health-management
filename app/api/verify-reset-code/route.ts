import { NextResponse } from "next/server"

// In a real app, this would be stored in a database
// For demo purposes, we'll use a simple in-memory store
const resetCodes = new Map<
  string,
  {
    code: string
    expiresAt: number
    used: boolean
  }
>()

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email e código são obrigatórios" }, { status: 400 })
    }

    // In a real app, fetch from database
    const storedData = resetCodes.get(email)

    if (!storedData) {
      return NextResponse.json({ success: false, error: "Código inválido ou expirado" }, { status: 400 })
    }

    if (storedData.used) {
      return NextResponse.json({ success: false, error: "Código já foi utilizado" }, { status: 400 })
    }

    if (Date.now() > storedData.expiresAt) {
      resetCodes.delete(email)
      return NextResponse.json({ success: false, error: "Código expirado" }, { status: 400 })
    }

    if (storedData.code !== code) {
      return NextResponse.json({ success: false, error: "Código inválido" }, { status: 400 })
    }

    // Mark as used
    storedData.used = true
    resetCodes.set(email, storedData)

    return NextResponse.json({
      success: true,
      message: "Código verificado com sucesso",
    })
  } catch (error) {
    console.error("Error verifying reset code:", error)
    return NextResponse.json({ success: false, error: "Erro ao verificar código" }, { status: 500 })
  }
}

// Helper function to store reset code (called by send-reset-code route)
export function storeResetCode(email: string, code: string, expiresAt: number) {
  resetCodes.set(email, { code, expiresAt, used: false })
}
