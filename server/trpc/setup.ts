import { env } from 'node:process'
import { TRPCError, initTRPC } from '@trpc/server'
import type { OpenApiMeta } from 'trpc-openapi'
import type { Context } from './context'

export const t = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    errorFormatter: ({ error, shape }) => {
      if (error.code === 'INTERNAL_SERVER_ERROR' && env.NODE_ENV === 'production')
        return { ...shape, message: 'Internal server error' }

      return shape
    },
  })

/**
 * COMMON
 */
export const publicProcedure = t.procedure

/**
 * AUTH
 */
export const adminProcedure = t.procedure.use((opt) => {
  const { ctx, next } = opt
  if (!ctx.token)
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden' })

  return next(opt)
})
