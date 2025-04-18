import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { getQuestionsByTerm } from '../data/questions.js';
import { commands } from '../translations/commands.js';
import { errors } from '../translations/errors.js';
import { type Command } from '../types/Command.js';
import {
  getQuestionButtons,
  getQuestionFiles,
  getQuestionText,
} from '../utils/questions.js';

export const getCommonCommand = (name: keyof typeof commands): Command => ({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription(commands[name])
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('Question Name')
        .setRequired(true)
        .setAutocomplete(true),
    ),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const keyword = interaction.options.getString('question', true);
    const [question] = await getQuestionsByTerm(keyword);

    if (question === undefined) {
      await interaction.editReply(errors.questionNotFound);

      return;
    }

    const messageContent = getQuestionText(question);
    const messageButtons = getQuestionButtons(question);
    const files = getQuestionFiles(question);

    try {
      await interaction.editReply({
        components: messageButtons,
        content: messageContent,
        files: files.map((file) => ({
          attachment: file.url,
          name: file.name,
        })),
      });
    } catch {
      await interaction.editReply(errors.questionNotDefinedCorrectly);
    }
  },
});
