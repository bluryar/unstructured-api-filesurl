import { env } from 'node:process'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { inferAsyncReturnType } from '@trpc/server'

/**
 * Nuxt Context
 *
 * 1. 获取 token 信息
 */
export function createContext({
  req,
}: {
  req: IncomingMessage
  res: ServerResponse<IncomingMessage>
}) {
  let token = req.headers['unstructured-api-key']
  let host = req.headers['unstructured-api-host']

  if (!token) {
    token = env.UNSTRUCTURED_API_KEY
  }
  else if (Array.isArray(token)) {
    token = token[0]
  }
  if (!host) {
    host = env.UNSTRUCTURED_API_HOST
  }
  else if (Array.isArray(host)) {
    host = host[0]
  }

  return {
    token,
    host,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
