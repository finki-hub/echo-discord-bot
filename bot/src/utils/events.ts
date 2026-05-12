import { type ClientEvents } from 'discord.js';
import { readdirSync } from 'node:fs';

import { type ClientEvent } from '../types/ClientEvent.js';
import { client } from './client.js';

const loadEvent = async (file: string) =>
  import(`../events/${file}`) as Promise<ClientEvent<keyof ClientEvents>>;

export const attachEventListeners = async () => {
  const eventFiles = readdirSync('./dist/events').filter((file) =>
    file.endsWith('.js'),
  );

  for (const file of eventFiles) {
    const event = await loadEvent(file);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
};
