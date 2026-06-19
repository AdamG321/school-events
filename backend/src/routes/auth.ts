import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma'
import { sendVerificationEmail } from '../lib/email'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default async function authRoutes(app: FastifyInstance) {
  // Register
  app.post('/register', async (req, reply) => {
    const { name, email, password, role } = req.body as any

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return reply.code(409).send({ message: 'Ez az email már regisztrálva van.' })

    const passwordHash = await bcrypt.hash(password, 12)
    const code = generateCode()
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 perc

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role === 'TEACHER' ? 'TEACHER' : 'STUDENT',
        verificationCode: code,
        codeExpiresAt,
      },
    })

    await sendVerificationEmail(email, name, code)
    return reply.code(201).send({ message: 'Regisztráció sikeres. Ellenőrizd az emailed!' })
  })

  // Email verify
  app.post('/verify-email', async (req, reply) => {
    const { code } = req.body as any

    const user = await prisma.user.findFirst({
      where: {
        verificationCode: code,
        codeExpiresAt: { gt: new Date() },
      },
    })

    if (!user) return reply.code(400).send({ message: 'Érvénytelen vagy lejárt kód.' })

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationCode: null, codeExpiresAt: null },
    })

    const token = app.jwt.sign({ id: user.id, role: user.role }, { expiresIn: '7d' })
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, emailVerified: true } }
  })

  // Resend verification code
  app.post('/resend-code', async (req, reply) => {
    const { email } = req.body as any
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.emailVerified) return reply.code(400).send({ message: 'Nem lehetséges.' })

    const code = generateCode()
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000)
    await prisma.user.update({ where: { id: user.id }, data: { verificationCode: code, codeExpiresAt } })
    await sendVerificationEmail(email, user.name, code)
    return { message: 'Kód elküldve.' }
  })

  // Login
  app.post('/login', async (req, reply) => {
    const { email, password } = req.body as any

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) return reply.code(401).send({ message: 'Hibás email vagy jelszó.' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return reply.code(401).send({ message: 'Hibás email vagy jelszó.' })

    if (!user.emailVerified) return reply.code(403).send({ message: 'Erősítsd meg az emailed először.' })

    const token = app.jwt.sign({ id: user.id, role: user.role }, { expiresIn: '7d' })
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, emailVerified: true } }
  })

  // Me
  app.get('/me', { onRequest: [(app as any).authenticate] }, async (req) => {
    const { id } = (req as any).user
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, avatar: true, emailVerified: true },
    })
    return user
  })

  // Google OAuth redirect
  app.get('/google', async (req, reply) => {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = encodeURIComponent(`${process.env.BACKEND_URL}/api/auth/google/callback`)
    const scope = encodeURIComponent('openid email profile')
    return reply.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`
    )
  })

  // Google OAuth callback
  app.get('/google/callback', async (req, reply) => {
    const { code } = req.query as any
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })
    const tokenData = await tokenRes.json() as any

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const googleUser = await userInfoRes.json() as any

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId: googleUser.id }, { email: googleUser.email }] },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.id,
          avatar: googleUser.picture,
          emailVerified: true,
          role: 'STUDENT',
        },
      })
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.id, avatar: googleUser.picture, emailVerified: true },
      })
    }

    const jwt = app.jwt.sign({ id: user.id, role: user.role }, { expiresIn: '7d' })
    return reply.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${jwt}`)
  })
}
