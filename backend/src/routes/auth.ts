import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'

export default async function authRoutes(app: FastifyInstance) {
  const auth = (app as any).authenticate

  // Get current user — lazy creation happens in authenticate middleware
  app.get('/me', { onRequest: [auth] }, async (req) => {
    const { id } = (req as any).user
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    })
  })

  // Set role after first registration (called once after Clerk signup completes)
  app.post('/sync', { onRequest: [auth] }, async (req) => {
    const { id } = (req as any).user
    const { role } = req.body as any
    const validRole = role === 'TEACHER' ? 'TEACHER' : 'STUDENT'
    return prisma.user.update({
      where: { id },
      data: { role: validRole },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    })
  })
}
