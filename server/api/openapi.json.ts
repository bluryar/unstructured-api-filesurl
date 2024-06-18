import { generateOpenApiDocument } from 'trpc-openapi'

import { appRouter } from '@/server/trpc'

export default defineEventHandler(() => {
  return generateOpenApiDocument(appRouter, {
    title: 'Unstructured Wrapper API',
    description: 'OpenAPI compliant REST API built using tRPC with Next.js. This is a wrapper API that wraps the [Unstructured API](https://github.com/Unstructured-IO/unstructured-api).',
    version: '1.0.0',
    baseUrl: '/api',
    securitySchemes: {
      'unstructured-api-key': {
        in: 'header',
        type: 'apiKey',
        name: 'unstructured-api-key',
      },
    },
  })
})
