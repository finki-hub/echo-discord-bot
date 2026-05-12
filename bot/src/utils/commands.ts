import { Collection, REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';

import { messages } from '../translations/messages.js';
import { type Command } from '../types/Command.js';
import { logger } from './logger.js';

const commands = new Collection<string, Command>();

const loadCommand = async (file: string) =>
  import(`../commands/${file}`) as Promise<Command>;

const refreshCommands = async () => {
  const commandFiles = readdirSync('./dist/commands').filter((file) =>
    file.endsWith('.js'),
  );

  commands.clear();

  for (const file of commandFiles) {
    const command = await loadCommand(file);
    commands.set(command.data.name, command);
  }
};

const isCommandsEmpty = () => commands.entries().next().done;

const getCommands = async () => {
  if (isCommandsEmpty()) {
    await refreshCommands();
  }

  return commands;
};

export const getCommand = async (commandName: string) => {
  if (isCommandsEmpty()) {
    await refreshCommands();
  }

  return commands.get(commandName);
};

export const registerCommands = async (
  token: string,
  applicationId: string,
) => {
  const rest = new REST().setToken(token);
  const commandsData = [];

  for (const [, command] of await getCommands()) {
    commandsData.push(command.data.toJSON());
  }

  await rest.put(Routes.applicationCommands(applicationId), {
    body: commandsData,
  });

  logger.info(messages.commandsRegistered);
};
