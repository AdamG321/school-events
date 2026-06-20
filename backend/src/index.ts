import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { createClerkClient } from '@clerk/backend'
import prisma from './lib/prisma'
import authRoutes from './routes/auth'
import eventRoutes from './routes/events'
import adminRoutes from './routes/admin'

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })

const app = Fastify({ logger: true })

app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
})

// Clerk auth decorator — verifies token + lazy user creation in DB
app.decorate('authenticate', async (request: any, reply: any) => {
  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return reply.code(401).send({ message: 'Unauthorized' })

  try {
    const token = authHeader.slice(7)
    const payload = await clerk.verifyToken(token)
    const clerkId = payload.sub

    let user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      const cu = await clerk.users.getUser(clerkId)
      user = await prisma.user.create({
        data: {
          clerkId,
          name: [cu.firstName, cu.lastName].filter(Boolean).join(' ') || 'Felhasználó',
          email: cu.emailAddresses[0]?.emailAddress || '',
          avatar: cu.imageUrl,
        },
      })
    }

    request.user = { id: user.id, role: user.role }
  } catch {
    return reply.code(401).send({ message: 'Unauthorized' })
  }
})

app.register(authRoutes, { prefix: '/api/auth' })
app.register(eventRoutes, { prefix: '/api/events' })
app.register(adminRoutes, { prefix: '/api/admin' })

app.get('/api/health', async () => ({ status: 'ok' }))

const PORT = Number(process.env.PORT) || 3000
app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) { app.log.error(err); process.exit(1) }
})
