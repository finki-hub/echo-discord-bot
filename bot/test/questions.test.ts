import { type ChatInputCommandInteraction } from 'discord.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { execute as list } from '../src/commands/list.js';
import { getAllQuestions, getQuestionsByTerm } from '../src/data/questions.js';
import { StrapiQuestionSchema } from '../src/schemas/QuestionSchema.js';
import { getCommonCommand } from '../src/shared/question.js';
import { getQuestionFiles } from '../src/utils/questions.js';

// Exact synthetic record captured from Strapi 5.59; i18n is disabled.
const question = {
  content: 'Synthetic isolated API contract fixture',
  createdAt: '2026-10-26T20:33:15.208Z',
  documentId: 'vauf73rd13ugjgnpayo7gtcu',
  id: 2,
  links: { Reference: 'https://example.invalid/synthetic' },
  name: 'Synthetic Verification Question',
  publishedAt: '2026-10-26T20:33:15.215Z',
  updatedAt: '2026-10-26T20:33:15.208Z',
};
const response = (record: object) => ({
  data: [record],
  meta: { pagination: { page: 1, pageCount: 1, pageSize: 25, total: 1 } },
});
const all = response(question);
const search = response({ ...question, files: [] });
const httpFailure = /Question API request failed \(503\)/u;
const parseFiles = (files: unknown) => {
  const [parsed] = StrapiQuestionSchema.parse(
    response({ ...question, files }),
  ).data;
  assert.ok(parsed);
  return parsed;
};

test('attachment URLs support local paths and absolute providers', (context) => {
  const previousUrl = process.env['STRAPI_URL'];
  process.env['STRAPI_URL'] = 'https://example.invalid';
  context.after(() => {
    if (previousUrl === undefined) {
      Reflect.deleteProperty(process.env, 'STRAPI_URL');
    } else {
      process.env['STRAPI_URL'] = previousUrl;
    }
  });
  assert.deepEqual(getQuestionFiles(parseFiles(undefined)), []);
  assert.deepEqual(getQuestionFiles(parseFiles(null)), []);
  assert.deepEqual(getQuestionFiles(parseFiles([])), []);
  for (const [url, expected] of [
    ['/uploads/local.png', 'https://example.invalid/uploads/local.png'],
    ['uploads/local.png', 'https://example.invalid/uploads/local.png'],
    [
      'https://cdn.example.invalid/image.png',
      'https://cdn.example.invalid/image.png',
    ],
  ]) {
    assert.deepEqual(
      getQuestionFiles(parseFiles([{ name: 'image.png', url }])),
      [{ name: 'image.png', url: expected }],
    );
  }
});

test('captured list and populated search responses parse without locale', () => {
  assert.equal(StrapiQuestionSchema.parse(all).data[0]?.name, question.name);
  assert.deepEqual(StrapiQuestionSchema.parse(search).data[0]?.files, []);
});

test('optional metadata may be absent; nullable fields may be null', () => {
  const minimal = {
    content: question.content,
    links: null,
    name: question.name,
  };
  assert.ok(StrapiQuestionSchema.safeParse(response(minimal)).success);
  assert.ok(
    StrapiQuestionSchema.safeParse(
      response({ ...minimal, files: null, locale: null }),
    ).success,
  );
});

test('media supports partial formats and JSON provider metadata', () => {
  const thumbnail = {
    ext: '.png',
    hash: 'image',
    height: 100,
    mime: 'image/png',
    name: 'image.png',
    path: null,
    size: 1,
    sizeInBytes: 1_000,
    url: '/uploads/thumb.png',
    width: 100,
  };
  for (const metadata of [
    null,
    {
      nested: { flags: [true, 1] },
      ...Object.fromEntries([['public_id', 'image']]),
    },
  ]) {
    const file = {
      formats: { thumbnail },
      name: 'image.png',
      ...Object.fromEntries([['provider_metadata', metadata]]),
      url: '/uploads/image.png',
    };
    assert.ok(
      StrapiQuestionSchema.safeParse(response({ ...question, files: [file] }))
        .success,
    );
    assert.ok(
      StrapiQuestionSchema.safeParse(
        response({
          ...question,
          files: [{ ...file, formats: null, locale: null, publishedAt: null }],
        }),
      ).success,
    );
  }
});

test('required content, links and attachment fields remain validated', () => {
  for (const invalid of [
    { ...question, content: undefined },
    { ...question, content: null },
    { ...question, name: 1 },
    { ...question, links: undefined },
    { ...question, links: { Reference: 123 } },
    { ...question, files: {} },
    { ...question, files: [{ url: '/image.png' }] },
    { ...question, files: [{ name: 'image.png', url: 123 }] },
    {
      ...question,
      files: [
        { formats: { thumbnail: {} }, name: 'image.png', url: '/image.png' },
      ],
    },
    {
      ...question,
      files: [
        {
          name: 'image.png',
          ...Object.fromEntries([['provider_metadata', 'bad']]),
          url: '/image.png',
        },
      ],
    },
  ]) {
    assert.equal(
      StrapiQuestionSchema.safeParse(response(invalid)).success,
      false,
    );
  }
});

test('fetching and commands consume real shapes without network access', async (context) => {
  const previousUrl = process.env['STRAPI_URL'];
  process.env['STRAPI_URL'] = 'https://example.invalid';
  context.after(() => {
    if (previousUrl === undefined) {
      Reflect.deleteProperty(process.env, 'STRAPI_URL');
    } else {
      process.env['STRAPI_URL'] = previousUrl;
    }
  });
  const urls: URL[] = [];
  context.mock.method(globalThis, 'fetch', (input: string | URL) => {
    const url = new URL(input);
    urls.push(url);
    return Promise.resolve(
      Response.json(url.searchParams.has('populate') ? search : all),
    );
  });

  const fetchedAll = await getAllQuestions();
  assert.equal(fetchedAll[0]?.name, question.name);
  const term = 'a&b+#? / ü=filters[name][$eq]';
  const fetchedSearch = await getQuestionsByTerm(term);
  assert.equal(fetchedSearch[0]?.content, question.content);
  const searchUrl = urls[1];
  assert.ok(searchUrl);
  assert.equal(searchUrl.searchParams.get('filters[name][$containsi]'), term);
  assert.equal(searchUrl.searchParams.size, 3);
  assert.equal(searchUrl.searchParams.get('populate'), 'files');

  const replies: unknown[] = [];
  const interaction = {
    editReply: (message: unknown) => {
      replies.push(message);
      return Promise.resolve();
    },
    options: { getString: () => term },
  } as unknown as ChatInputCommandInteraction;
  await list(interaction);
  assert.equal(replies[0], `1. ${question.name}`);
  await getCommonCommand('question').execute(interaction);
  const reply = replies[1] as {
    components: unknown[];
    content: string;
    files: unknown[];
  };
  assert.ok(reply.content.includes(question.content));
  assert.equal(reply.components.length, 1);
  assert.deepEqual(reply.files, []);
});

test('non-success HTTP responses are rejected before reading their body', async (context) => {
  const previousUrl = process.env['STRAPI_URL'];
  process.env['STRAPI_URL'] = 'https://example.invalid';
  context.after(() => {
    if (previousUrl === undefined) {
      Reflect.deleteProperty(process.env, 'STRAPI_URL');
    } else {
      process.env['STRAPI_URL'] = previousUrl;
    }
  });
  context.mock.method(globalThis, 'fetch', () =>
    Promise.resolve({
      json: () => {
        throw new Error('Body must not be parsed');
      },
      ok: false,
      status: 503,
    }),
  );
  await assert.rejects(getAllQuestions(), httpFailure);
  await assert.rejects(getQuestionsByTerm('test'), httpFailure);
});
