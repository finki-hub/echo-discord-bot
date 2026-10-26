import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getBotCredentials,
  getStrapiUrl,
  loadOptionalEnvFile,
} from '../src/config/environment.js';

test('environment-only startup tolerates only a missing optional .env file', (context) => {
  const previousEnv = process.env;
  process.env = {
    ...previousEnv,
    APPLICATION_ID: '123',
    STRAPI_URL: 'https://example.invalid',
    TOKEN: 'synthetic',
  };
  context.after(() => {
    process.env = previousEnv;
  });
  const loader = context.mock.method(process, 'loadEnvFile', () => {
    throw Object.assign(new Error('Missing optional file'), { code: 'ENOENT' });
  });

  assert.doesNotThrow(loadOptionalEnvFile);
  assert.equal(loader.mock.callCount(), 1);
  assert.deepEqual(getBotCredentials(), {
    applicationId: '123',
    token: 'synthetic',
  });
  assert.equal(getStrapiUrl(), 'https://example.invalid');
});

test('existing .env is loaded before reading configuration', (context) => {
  const previousEnv = process.env;
  process.env = { ...previousEnv };
  context.after(() => {
    process.env = previousEnv;
  });
  const loader = context.mock.method(process, 'loadEnvFile', () => {
    process.env['TOKEN'] = 'synthetic-file-token';
    process.env['APPLICATION_ID'] = '456';
    process.env['STRAPI_URL'] = 'https://file.example.invalid';
  });

  loadOptionalEnvFile();
  assert.equal(loader.mock.callCount(), 1);
  assert.deepEqual(getBotCredentials(), {
    applicationId: '456',
    token: 'synthetic-file-token',
  });
  assert.equal(getStrapiUrl(), 'https://file.example.invalid');
});

test('unreadable, malformed and unexpected environment loading failures propagate unchanged', (context) => {
  const failures = [
    Object.assign(new Error('Unreadable'), { code: 'EACCES' }),
    Object.assign(new Error('Invalid configuration'), {
      code: 'ERR_INVALID_ARG_VALUE',
    }),
    new SyntaxError('Malformed configuration'),
  ];
  const loader = context.mock.method(process, 'loadEnvFile');
  for (const failure of failures) {
    loader.mock.mockImplementation(() => {
      throw failure;
    });
    assert.throws(loadOptionalEnvFile, (error: unknown) => error === failure);
  }
});
