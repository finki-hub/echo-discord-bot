import { type ClientEvents, Events } from 'discord.js';

import {
  handleAutocompleteCommand,
  handleChatInputCommand,
} from '../interactions/handlers.js';

export const name = Events.InteractionCreate;

export const execute = async (...[interaction]: ClientEvents[typeof name]) => {
  if (interaction.isChatInputCommand()) {
    await handleChatInputCommand(interaction);
  } else if (interaction.isAutocomplete()) {
    await handleAutocompleteCommand(interaction);
  }
};
