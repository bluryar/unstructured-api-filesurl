import { createNuxtApiHandler } from 'trpc-nuxt'
import { appRouter, createContext } from '@/server/trpc'

export default createNuxtApiHandler({
  router: appRouter,
  createContext,
})
