import { getBotCredentials } from './config/environment.js';
import { client } from './utils/client.js';
import { registerCommands } from './utils/commands.js';
import { attachEventListeners } from './utils/events.js';

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
} else {
  // eslint-disable-next-line e18e/ban-dependencies -- Fallback for older supported Node 20.x runtimes without process.loadEnvFile().
  const { config } = await import('dotenv');

  config();
}

// Initialization

const { applicationId, token } = getBotCredentials();

await attachEventListeners();
await registerCommands(token, applicationId);

// Login

await client.login(token);
