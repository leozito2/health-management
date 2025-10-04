import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email é obrigatório" }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // In a real application, you would send this via an email service like:
    // - Resend (resend.com)
    // - SendGrid
    // - AWS SES
    // - Mailgun

    // Example with Resend (commented out - requires API key):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'MedCare <noreply@medcare.com>',
      to: email,
      subject: 'MedCare - Código de Recuperação de Senha',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">MedCare - Recuperação de Senha</h2>
          <p>Olá!</p>
          <p>Você solicitou a redefinição de sua senha no MedCare.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Seu código de verificação é:</p>
            <h1 style="margin: 10px 0; font-size: 32px; letter-spacing: 8px; color: #2563eb;">${code}</h1>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Este código é válido por 15 minutos e pode ser usado apenas uma vez.</p>
          <p style="color: #6b7280; font-size: 14px;">Se você não solicitou esta redefinição, ignore este email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">MedCare - Cuidando da sua saúde</p>
        </div>
      `
    })
    */

    // For demo purposes, we'll store the code in memory and show it to the user
    // In production, remove this and only send via email
    console.log(`[MedCare] Password reset code for ${email}: ${code}`)

    // Store the code with expiration (15 minutes)
    const resetData = {
      email,
      code,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      used: false,
    }

    // In a real app, store this in a database
    // For demo, we'll return it in the response (NEVER do this in production!)
    return NextResponse.json({
      success: true,
      message: "Código enviado com sucesso",
      // Remove this in production - only for demo
      demoCode: code,
    })
  } catch (error) {
    console.error("Error sending reset code:", error)
    return NextResponse.json({ success: false, error: "Erro ao enviar código" }, { status: 500 })
  }
}
