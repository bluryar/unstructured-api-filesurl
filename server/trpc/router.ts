import { t } from './setup'
import { unstructuredRouter } from './routers/unstructured'

export const appRouter = t.router({
  unstructured: unstructuredRouter,
})

export type AppRouter = typeof appRouter
