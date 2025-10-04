import { NextResponse } from "next/server"

// In-memory store shared with send-reset-code
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

    console.log("[v0] Verifying code for email:", email, "code:", code)

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email e código são obrigatórios" }, { status: 400 })
    }

    // Get stored code
    const storedData = resetCodes.get(email)

    console.log("[v0] Stored data:", storedData)

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

    console.log("[v0] Code verified successfully")

    return NextResponse.json({
      success: true,
      message: "Código verificado com sucesso",
    })
  } catch (error) {
    console.error("[v0] Error verifying reset code:", error)
    return NextResponse.json({ success: false, error: "Erro ao verificar código" }, { status: 500 })
  }
}
