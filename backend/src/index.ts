import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import authRoutes from './routes/auth'
import eventRoutes from './routes/events'
import adminRoutes from './routes/admin'

const app = Fastify({ logger: true })

app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'change-me-in-production',
})

// Auth decorator
app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify()
  } catch {
    reply.code(401).send({ message: 'Unauthorized' })
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
