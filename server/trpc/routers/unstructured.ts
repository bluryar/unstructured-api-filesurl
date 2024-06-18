import { z } from 'zod'
import { UnstructuredClient } from 'unstructured-client'
import type { ChunkingStrategyOpen, OutputFormatOpen, StrategyOpen } from 'unstructured-client/sdk/models/shared'
import { omit } from 'lodash-es'
import { adminProcedure, t } from '../setup'
import type { TExtendedGeneralBodyParamSchema, TGeneralBodyParamSchema, TSuccessfulResponseSchema } from '../models/unstructured'
import { ExtendedGeneralBodyParamSchema, HTTPValidationErrorSchema, SuccessfulResponseSchema } from '../models/unstructured'
import { logger } from '@/server/logger'

async function downloadFile(urls: TExtendedGeneralBodyParamSchema['urls'] = []): Promise<TGeneralBodyParamSchema['files']> {
  const fileBuffers: TGeneralBodyParamSchema['files'] = []

  logger.info(`Starting download for ${urls.length} files.`)
  for (const url of urls) {
    try {
      // 使用 Nuxt.js 的 $fetch 方法发送 GET 请求
      const response = await $fetch(url, {
        responseType: 'blob',
      }) satisfies Blob
      fileBuffers.push(response)
    }
    catch (error) {
      console.error(`Error downloading file from ${url}:`, error)
      throw error // 根据需要处理错误，这里选择抛出错误
    }

    logger.info(`Downloaded ${fileBuffers.length} files.`)
  }

  return fileBuffers
}

async function checkFiles(input: TExtendedGeneralBodyParamSchema): Promise<TGeneralBodyParamSchema> {
  let { files, urls } = input

  logger.info(`Checking input for files: ${Boolean(files?.length)}`)
  if (!files?.length) {
    logger.info(`No files found, proceeding to download from URLs.`)
    files = await downloadFile(urls)
  }

  return {
    ...omit(input, ['files', 'urls']),
    files,
  } satisfies TGeneralBodyParamSchema
}

export const unstructuredRouter = t.router(
  {
    general: adminProcedure.meta({
      openapi: {
        method: 'POST',
        path: '/unstructured/general',
      },
    })
      .input(ExtendedGeneralBodyParamSchema)
      .output(z.object({
        successes: SuccessfulResponseSchema.array(),
        failures: HTTPValidationErrorSchema.array(),
      }))
      .mutation(
        async ({ ctx, input }) => {
          const { token, host } = ctx
          logger.info('\n')

          const {
            files,
            xml_keep_tags,
            languages,
            ocr_languages,
            skip_infer_table_types,
            gz_uncompressed_content_type,
            output_format,
            coordinates,
            encoding,
            hi_res_model_name,
            include_page_breaks,
            pdf_infer_table_structure,
            strategy,
            extract_image_block_types,
            unique_element_ids,
            chunking_strategy,
            combine_under_n_chars,
            max_characters,
            multipage_sections,
            new_after_n_chars,
            overlap,
            overlap_all,
            starting_page_number,
          } = await checkFiles(input)

          logger.info(`Using server URL: ${host}`)
          logger.info(`Files to process: ${files.length}`)

          const client = new UnstructuredClient({
            serverURL: host!,
            security: {
              apiKeyAuth: token!,
            },
          })

          const promises = files.map(
            (file) => {
              return client.general.partition({
                partitionParameters: {
                  files: file,
                  strategy: strategy as StrategyOpen,
                  xmlKeepTags: xml_keep_tags,
                  languages,
                  ocrLanguages: ocr_languages,
                  skipInferTableTypes: skip_infer_table_types,
                  gzUncompressedContentType: gz_uncompressed_content_type,
                  outputFormat: output_format as OutputFormatOpen,
                  coordinates,
                  encoding,
                  hiResModelName: hi_res_model_name,
                  includePageBreaks: include_page_breaks,
                  pdfInferTableStructure: pdf_infer_table_structure,
                  extractImageBlockTypes: extract_image_block_types,
                  uniqueElementIds: unique_element_ids,
                  chunkingStrategy: chunking_strategy as ChunkingStrategyOpen,
                  combineUnderNChars: combine_under_n_chars,
                  maxCharacters: max_characters,
                  multipageSections: multipage_sections,
                  newAfterNChars: new_after_n_chars,
                  overlap,
                  overlapAll: overlap_all,
                  startingPageNumber: starting_page_number,
                },
              })
            },
          )
          logger.info(`Processing ${promises.length} blobs.`)
          const result = await Promise.allSettled(promises)
          const successes: TSuccessfulResponseSchema[] = []
          const failures: any[] = []
          for (const current of result) {
            if (current.status === 'fulfilled') {
              const { elements } = current.value

              successes.push(elements as TSuccessfulResponseSchema)
            }
            else {
              failures.push(current.reason)
            }
          }
          logger.info(`Successes: ${successes.length}, Failures: ${failures.length}`)

          return {
            successes,
            failures,
          }
        },
      ),
  },
)

export type UnstructuredRouter = typeof unstructuredRouter
