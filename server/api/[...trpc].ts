import { createOpenApiNuxtHandler } from 'trpc-openapi'
import { appRouter, createContext } from '@/server/trpc'

export default createOpenApiNuxtHandler({
  router: appRouter,
  createContext,
})
