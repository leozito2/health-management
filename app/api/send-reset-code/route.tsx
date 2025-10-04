import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// In-memory store for demo (in production, use a database)
const resetCodes = new Map<
  string,
  {
    code: string
    expiresAt: number
    used: boolean
  }
>()

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email é obrigatório" }, { status: 400 })
    }

    // Check if user exists in localStorage (in production, check database)
    // For now, we'll allow any email to receive a code

    // Generate 6-digit code
    const code = generateCode()
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes

    // Store code
    resetCodes.set(email, { code, expiresAt, used: false })

    // Send email using Resend
    try {
      await resend.emails.send({
        from: "HealthCare App <onboarding@resend.dev>",
        to: email,
        subject: "Código de Recuperação de Senha - HealthCare",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">HealthCare</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Gerenciamento de Saúde</p>
              </div>
              
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #1f2937; margin-top: 0;">Recuperação de Senha</h2>
                
                <p style="color: #4b5563; font-size: 16px;">
                  Olá! Você solicitou a recuperação de senha da sua conta no HealthCare.
                </p>
                
                <p style="color: #4b5563; font-size: 16px;">
                  Use o código abaixo para redefinir sua senha:
                </p>
                
                <div style="background: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Seu código de verificação:</p>
                  <p style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #3b82f6; margin: 0; font-family: 'Courier New', monospace;">
                    ${code}
                  </p>
                </div>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="color: #92400e; margin: 0; font-size: 14px;">
                    <strong>⚠️ Importante:</strong> Este código expira em 15 minutos e só pode ser usado uma vez.
                  </p>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  Se você não solicitou esta recuperação de senha, ignore este email. Sua senha permanecerá inalterada.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                  © ${new Date().getFullYear()} HealthCare - Sistema de Gerenciamento de Saúde
                </p>
              </div>
            </body>
          </html>
        `,
      })

      console.log(`[v0] Reset code sent to ${email}: ${code}`)

      return NextResponse.json({
        success: true,
        message: "Código enviado com sucesso",
        // For demo purposes, include the code in response
        demoCode: code,
      })
    } catch (emailError) {
      console.error("[v0] Error sending email:", emailError)

      // Even if email fails, return success with demo code for testing
      return NextResponse.json({
        success: true,
        message: "Código gerado (email não enviado - modo demo)",
        demoCode: code,
      })
    }
  } catch (error) {
    console.error("[v0] Error in send-reset-code:", error)
    return NextResponse.json({ success: false, error: "Erro ao processar solicitação" }, { status: 500 })
  }
}

// Export function to access reset codes from verify route
export function getResetCode(email: string) {
  return resetCodes.get(email)
}

export function markCodeAsUsed(email: string) {
  const data = resetCodes.get(email)
  if (data) {
    data.used = true
    resetCodes.set(email, data)
  }
}

export function deleteResetCode(email: string) {
  resetCodes.delete(email)
}
