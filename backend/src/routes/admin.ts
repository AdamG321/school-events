import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'

export default async function adminRoutes(app: FastifyInstance) {
  const auth = (app as any).authenticate

  // Admin-only guard
  const adminOnly = async (req: any, reply: any) => {
    await auth(req, reply)
    if (req.user?.role !== 'ADMIN') reply.code(403).send({ message: 'Admin jogosultság szükséges.' })
  }

  // Pending events
  app.get('/events/pending', { onRequest: [adminOnly] }, async () => {
    return prisma.event.findMany({
      where: { status: 'PENDING' },
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    })
  })

  // Approve event
  app.patch('/events/:id/approve', { onRequest: [adminOnly] }, async (req) => {
    const { id } = req.params as any
    const userId = (req as any).user.id
    return prisma.event.update({
      where: { id },
      data: { status: 'ACTIVE', approvedById: userId },
    })
  })

  // Reject event
  app.patch('/events/:id/reject', { onRequest: [adminOnly] }, async (req) => {
    const { id } = req.params as any
    return prisma.event.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })
  })

  // All users
  app.get('/users', { onRequest: [adminOnly] }, async () => {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, emailVerified: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
  })

  // Change user role
  app.patch('/users/:id/role', { onRequest: [adminOnly] }, async (req) => {
    const { id } = req.params as any
    const { role } = req.body as any
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    })
  })

  // Analytics
  app.get('/analytics', { onRequest: [adminOnly] }, async () => {
    const [totalEvents, totalUsers, totalRegistrations] = await Promise.all([
      prisma.event.count(),
      prisma.user.count(),
      prisma.eventRegistration.count(),
    ])
    const byCategory = await prisma.event.groupBy({
      by: ['category'],
      _count: { id: true },
    })
    return { totalEvents, totalUsers, totalRegistrations, byCategory }
  })
}
