import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, name: string, code: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'noreply@schoolevents.hu',
    to: email,
    subject: 'Email megerősítés — SchoolEvents',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; color: #1E1B4B; margin-bottom: 8px;">Szia, ${name}!</h1>
        <p style="color: #6b7280; margin-bottom: 32px;">Add meg ezt a kódot a SchoolEvents felületen az email-ed megerősítéséhez:</p>
        <div style="background: #F8FAFC; border: 2px solid #6366F1; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
          <span style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #6366F1;">${code}</span>
        </div>
        <p style="color: #9ca3af; font-size: 14px;">A kód 15 percig érvényes. Ha nem te regisztráltál, hagyd figyelmen kívül ezt az emailt.</p>
      </div>
    `,
  })
}

export async function sendEventNotification(email: string, name: string, eventTitle: string, type: 'registered' | 'reminder' | 'cancelled') {
  const subjects: Record<string, string> = {
    registered: `Sikeres jelentkezés: ${eventTitle}`,
    reminder: `Emlékeztető: ${eventTitle} holnap!`,
    cancelled: `Esemény törölve: ${eventTitle}`,
  }

  const messages: Record<string, string> = {
    registered: `Sikeresen jelentkeztél a(z) <strong>${eventTitle}</strong> eseményre.`,
    reminder: `Ne feledd! A(z) <strong>${eventTitle}</strong> esemény holnap lesz.`,
    cancelled: `Sajnáljuk, de a(z) <strong>${eventTitle}</strong> eseményt törölték.`,
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'noreply@schoolevents.hu',
    to: email,
    subject: subjects[type],
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 20px; color: #1E1B4B; margin-bottom: 16px;">Szia, ${name}!</h1>
        <p style="color: #6b7280;">${messages[type]}</p>
      </div>
    `,
  })
}
