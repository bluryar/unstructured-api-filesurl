import { Buffer } from 'node:buffer'
import { z } from 'zod'
import type { Files } from 'unstructured-client/sdk/models/shared'

const FilesSchema = z.string().transform((data) => {
  return new Blob([Buffer.from(data)], { type: 'application/octet-stream' }) satisfies Blob | Files
}).array().describe('The file to extract\n | 要提取的文件')

const GeneralBodyParamSchema = z.object({
  files: FilesSchema,
  xml_keep_tags: z.boolean().optional().default(false)
    .describe('If True, will retain the XML tags in the output. Otherwise it will simply extract the text from within the tags. Only applies to partition_xml.\n | 如果为True，将在输出中保留XML标签。否则，将只从标签内提取文本。只适用于partition_xml。'),
  languages: z.array(z.string()).optional()
    .describe('The languages present in the document, for use in partitioning and/or OCR\n | 文档中出现的语言，用于分割和/或OCR'),
  ocr_languages: z.array(z.string()).optional()
    .describe('The languages present in the document, for use in partitioning and/or OCR\n | 文档中出现的语言，用于分割和/或OCR'),
  skip_infer_table_types: z.array(z.string()).optional()
    .describe('The document types that you want to skip table extraction with.\n | 你想要跳过提取表格的文档类型。'),
  gz_uncompressed_content_type: z.string().or(z.null()).optional()
    .describe('If file is gzipped, use this content type after unzipping\n | 如果文件是gzip压缩的，在解压缩后使用此内容类型'),
  output_format: z.enum(['application/json', 'text/csv']).default('application/json')
    .describe('The format of the response. Supported formats are application/json and text/csv. Default: application/json.\n | 响应的格式。支持的格式有application/json和text/csv。默认：application/json。'),
  coordinates: z.boolean().optional().default(false)
    .describe('If true, return coordinates for each element. Default: false\n | 如果为true，返回每个元素的坐标。默认：false'),
  encoding: z.string().default('utf-8')
    .describe('The encoding method used to decode the text input. Default: utf-8\n | 用于解码文本输入的编码方法。默认：utf-8'),
  hi_res_model_name: z.string().or(z.null()).optional()
    .describe('The name of the inference model used when strategy is hi_res\n | 当策略为hi_res时使用的推理模型名称'),
  include_page_breaks: z.boolean().optional().default(false)
    .describe('If True, the output will include page breaks if the filetype supports it. Default: false\n | 如果为True，如果文件类型支持，输出将包含分页符。默认：false'),
  pdf_infer_table_structure: z.boolean().optional().default(true)
    .describe('Deprecated! Use skip_infer_table_types to opt out of table extraction for any file type. If False and strategy=hi_res, no Table Elements will be extracted from pdf files regardless of skip_infer_table_types contents.\n | 已弃用！使用skip_infer_table_types来选择跳过任何文件类型的表格提取。如果为False并且strategy=hi_res，无论skip_infer_table_types的内容如何，都不会从pdf文件中提取表格元素。'),
  strategy: z.enum(['fast', 'hi_res', 'auto', 'ocr_only']).default('auto')
    .describe('The strategy to use for partitioning PDF/image. Options are fast, hi_res, auto. Default: auto\n | 用于PDF/图像分割的策略。选项有fast，hi_res，auto。默认：auto'),
  extract_image_block_types: z.array(z.string()).optional()
    .describe('The types of elements to extract, for use in extracting image blocks as base64 encoded data stored in metadata fields\n | 要提取的元素类型，用于将图像块作为base64编码的数据存储在元数据字段中'),
  unique_element_ids: z.boolean().optional().default(false)
    .describe('When `True`, assign UUIDs to element IDs, which guarantees their uniqueness (useful when using them as primary keys in database). Otherwise a SHA-256 of element text is used. Default: False\n | 当为`True`时，为元素ID分配UUID，这保证了它们的唯一性（在使用它们作为数据库的主键时非常有用）。否则使用元素文本的SHA-256。默认：False'),
  chunking_strategy: z.enum(['basic', 'by_title', 'by_page', 'by_similarity']).optional().default('by_title')
    .describe('Use one of the supported strategies to chunk the returned elements. Currently supports: by_title\n | 使用支持的策略之一来分块返回的元素。当前支持：by_title'),
  combine_under_n_chars: z.number().int().optional()
    .describe('If chunking strategy is set, combine elements until a section reaches a length of n chars. Default: 500\n | 如果设置了分块策略，合并元素直到一个部分达到n个字符的长度。默认：500'),
  max_characters: z.number().int().default(500)
    .describe('If chunking strategy is set, cut off new sections after reaching a length of n chars (hard max). Default: 1500\n | 如果设置了分块策略，在达到n个字符的长度后截断新部分（硬最大值）。默认：1500'),
  multipage_sections: z.boolean().optional().default(true)
    .describe('If chunking strategy is set, determines if sections can span multiple sections. Default: true\n | 如果设置了分块策略，确定部分是否可以跨越多个部分。默认：true'),
  new_after_n_chars: z.number().int().optional()
    .describe('If chunking strategy is set, cut off new sections after reaching a length of n chars (soft max). Default: 1500\n | 如果设置了分块策略，在达到n个字符的长度后截断新部分（软最大值）。默认：1500'),
  overlap: z.number().int().default(0)
    .describe('Specifies the length of a string ("tail") to be drawn from each chunk and prefixed to the next chunk as a context-preserving mechanism. By default, this only applies to split-chunks where an oversized element is divided into multiple chunks by text-splitting. Default: 0\n | 指定从每个块中抽取的字符串（"尾部"）的长度，并将其作为上下文保留机制的前缀添加到下一个块。默认情况下，这只适用于通过文本分割将过大的元素分割成多个块的分割块。默认：0'),
  overlap_all: z.boolean().optional().default(false)
    .describe('When `True`, apply overlap between "normal" chunks formed from whole elements and not subject to text-splitting. Use this with caution as it entails a certain level of "pollution" of otherwise clean semantic chunk boundaries. Default: False\n | 当为`True`时，对由完整元素形成的"正常"块进行重叠，这些块不受文本分割的影响。谨慎使用此功能，因为它意味着对本来清晰的语义块边界的一定程度的"污染"。默认：False'),
  starting_page_number: z.number().int().or(z.null()).optional()
    .describe('When PDF is split into pages before sending it into the API, providing this information will allow the page number to be assigned correctly.\n | 当PDF在发送到API之前被分割成页面'),
})

const ExtendedGeneralBodyParamSchema = GeneralBodyParamSchema
  .extend({
    files: FilesSchema.optional(),
    urls: z.string().url().array().optional()
      .describe('当设置了url后，可以在将文件请求到本地，然后传入给unstructured进行解析。当设置了files后，该选项失效。'),
  })
  .refine((ctx) => {
    return !!ctx.files || !!ctx.urls || []
  }, {
    message: 'At least one of the properties propA or propB must be provided.',
  })

const ElementSchema = z.object({
  type: z.string(),
  element_id: z.string(),
  metadata: z.object({}), // 根据实际的 metadata 结构定义
  text: z.string(),
})

const SuccessfulResponseSchema = z.array(ElementSchema)

const ValidationErrorSchema = z.object({
  loc: z.array(z.union([z.string(), z.number()])),
  msg: z.string(),
  type: z.string(),
})

const HTTPValidationErrorSchema = z.object({
  detail: z.array(ValidationErrorSchema),
})

export { GeneralBodyParamSchema, ExtendedGeneralBodyParamSchema, SuccessfulResponseSchema, HTTPValidationErrorSchema }

type TGeneralBodyParamSchema = z.infer<typeof GeneralBodyParamSchema>
type TExtendedGeneralBodyParamSchema = z.infer<typeof ExtendedGeneralBodyParamSchema>
type TSuccessfulResponseSchema = z.infer<typeof SuccessfulResponseSchema>
type THTTPValidationErrorSchema = z.infer<typeof HTTPValidationErrorSchema>

export type {
  TGeneralBodyParamSchema,
  TExtendedGeneralBodyParamSchema,
  TSuccessfulResponseSchema,
  THTTPValidationErrorSchema,
}
