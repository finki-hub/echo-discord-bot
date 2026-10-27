/* eslint-disable camelcase -- Strapi response fields are snake_case and must match the API payload exactly. */

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
    sizeInBytes: z.number().optional(),
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
    formats: z.partialRecord(Formats, FormatSchema).nullable(),
    hash: z.string(),
    height: z.number().nullable(),
    id: z.number(),
    locale: z.string().nullable(),
    mime: z.string(),
    name: z.string(),
    previewUrl: z.string().nullable(),
    provider: z.string(),
    provider_metadata: z.record(z.string(), z.json()).nullable(),
    publishedAt: z.string().nullable(),
    size: z.number(),
    updatedAt: z.string(),
    url: z.string(),
    width: z.number().nullable(),
  })
  // Only attachment names and URLs are consumed; upload metadata varies by provider.
  .partial()
  .required({ name: true, url: true });

const QuestionSchema = z
  .object({
    content: z.string(),
    createdAt: z.string(),
    documentId: z.string(),
    // Unpopulated relations are omitted from list responses.
    files: z.array(FileSchema).nullable().optional(),
    id: z.number(),
    links: z.record(z.string(), z.string()).nullable(),
    locale: z.string().nullable().optional(),
    name: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string(),
  })
  .partial({
    createdAt: true,
    documentId: true,
    id: true,
    publishedAt: true,
    updatedAt: true,
  });

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
