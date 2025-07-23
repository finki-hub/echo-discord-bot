/* eslint-disable camelcase */

import { z } from 'zod';

const Formats = z.enum(['large', 'medium', 'small', 'thumbnail']);

const FormatSchema = z
  .object({
    ext: z.string(),
    hash: z.string(),
    height: z.number(),
    mime: z.string(),
    name: z.string(),
    path: z.string().nullable(),
    size: z.number(),
    sizeInBytes: z.number(),
    url: z.string(),
    width: z.number(),
  })
  .strict();

const FileSchema = z
  .object({
    alternativeText: z.string().nullable(),
    caption: z.string().nullable(),
    createdAt: z.string(),
    documentId: z.string(),
    ext: z.string(),
    formats: z.record(Formats, FormatSchema).nullable(),
    hash: z.string(),
    height: z.number().nullable(),
    id: z.number(),
    locale: z.string().nullable(),
    mime: z.string(),
    name: z.string(),
    previewUrl: z.string().nullable(),
    provider: z.string(),
    provider_metadata: z.string().nullable(),
    publishedAt: z.string(),
    size: z.number(),
    updatedAt: z.string(),
    url: z.string(),
    width: z.number().nullable(),
  })
  .strict();

const QuestionSchema = z
  .object({
    content: z.string(),
    createdAt: z.string(),
    documentId: z.string(),
    files: z.array(FileSchema).nullable(),
    id: z.number(),
    links: z.record(z.string(), z.string()).nullable(),
    locale: z.string().nullable(),
    name: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

export const StrapiQuestionSchema = z
  .object({
    data: z.array(QuestionSchema),
    meta: z
      .object({
        pagination: z
          .object({
            page: z.number(),
            pageCount: z.number(),
            pageSize: z.number(),
            total: z.number(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

export type Question = z.infer<typeof QuestionSchema>;
