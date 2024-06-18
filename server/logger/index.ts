import { createConsola } from 'consola'

const logger = createConsola({
  formatOptions: {
    date: !!1,
  },
})

export { logger }
