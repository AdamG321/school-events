import { FastifyInstance } from 'fastify'
import prisma from '../lib/prisma'
import { sendEventNotification } from '../lib/email'

const authenticate = (app: FastifyInstance) => (app as any).authenticate

export default async function eventRoutes(app: FastifyInstance) {
  const auth = authenticate(app)

  // List all active events
  app.get('/', async (req) => {
    const { category, search } = req.query as any
    return prisma.event.findMany({
      where: {
        status: 'ACTIVE',
        ...(category ? { category } : {}),
        ...(search ? { title: { contains: search, mode: 'insensitive' } } : {}),
      },
      include: {
        createdBy: { select: { id: true, name: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { startAt: 'asc' },
    })
  })

  // Get single event
  app.get('/:id', async (req, reply) => {
    const { id } = req.params as any
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
        _count: { select: { registrations: true } },
        attachments: true,
      },
    })
    if (!event) return reply.code(404).send({ message: 'Esemény nem található.' })
    return event
  })

  // Create event (teacher/admin)
  app.post('/', { onRequest: [auth] }, async (req, reply) => {
    const user = (req as any).user
    if (!['TEACHER', 'ADMIN'].includes(user.role)) {
      return reply.code(403).send({ message: 'Nincs jogosultságod.' })
    }
    const data = req.body as any
    const event = await prisma.event.create({
      data: {
        ...data,
        createdById: user.id,
        status: user.role === 'ADMIN' ? 'ACTIVE' : 'PENDING',
      },
    })
    return reply.code(201).send(event)
  })

  // Update event
  app.patch('/:id', { onRequest: [auth] }, async (req, reply) => {
    const { id } = req.params as any
    const user = (req as any).user
    const event = await prisma.event.findUnique({ where: { id } })
    if (!event) return reply.code(404).send({ message: 'Esemény nem található.' })
    if (event.createdById !== user.id && user.role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Nincs jogosultságod.' })
    }
    const updated = await prisma.event.update({ where: { id }, data: req.body as any })
    return updated
  })

  // Register for event
  app.post('/:id/register', { onRequest: [auth] }, async (req, reply) => {
    const { id } = req.params as any
    const userId = (req as any).user.id

    const event = await prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } },
    })
    if (!event) return reply.code(404).send({ message: 'Esemény nem található.' })
    if (event.status !== 'ACTIVE') return reply.code(400).send({ message: 'Az esemény nem aktív.' })

    const existing = await prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId: id, userId } },
    })
    if (existing) return reply.code(409).send({ message: 'Már jelentkeztél.' })

    const isFull = event.capacity && event._count.registrations >= event.capacity
    const status = isFull && event.waitlistEnabled ? 'WAITLIST' : isFull ? null : 'CONFIRMED'

    if (!status) return reply.code(400).send({ message: 'Az esemény megtelt.' })

    const reg = await prisma.eventRegistration.create({
      data: { eventId: id, userId, status },
    })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user) await sendEventNotification(user.email, user.name, event.title, 'registered').catch(() => {})

    return reply.code(201).send(reg)
  })

  // Unregister
  app.delete('/:id/register', { onRequest: [auth] }, async (req, reply) => {
    const { id } = req.params as any
    const userId = (req as any).user.id
    await prisma.eventRegistration.delete({
      where: { eventId_userId: { eventId: id, userId } },
    })
    return { message: 'Jelentkezés visszavonva.' }
  })

  // Check registration status
  app.get('/:id/registration', { onRequest: [auth] }, async (req) => {
    const { id } = req.params as any
    const userId = (req as any).user.id
    const reg = await prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId: id, userId } },
    })
    return { registered: !!reg, status: reg?.status }
  })

  // Get attendance list (teacher/admin)
  app.get('/:id/attendance', { onRequest: [auth] }, async (req, reply) => {
    const user = (req as any).user
    if (!['TEACHER', 'ADMIN'].includes(user.role)) return reply.code(403).send({ message: 'Nincs jogosultságod.' })
    const { id } = req.params as any
    return prisma.attendance.findMany({
      where: { eventId: id },
      include: { user: { select: { id: true, name: true, email: true } } },
    })
  })

  // Check-in
  app.post('/:id/checkin', { onRequest: [auth] }, async (req, reply) => {
    const reqUser = (req as any).user
    if (!['TEACHER', 'ADMIN'].includes(reqUser.role)) return reply.code(403).send({ message: 'Nincs jogosultságod.' })

    const { id } = req.params as any
    const { email, method } = req.body as any

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return reply.code(404).send({ message: 'Felhasználó nem található.' })

    const attendance = await prisma.attendance.upsert({
      where: { eventId_userId: { eventId: id, userId: user.id } },
      update: {},
      create: { eventId: id, userId: user.id, method: method || 'MANUAL' },
      include: { user: { select: { id: true, name: true, email: true } } },
    })
    return attendance
  })
}
