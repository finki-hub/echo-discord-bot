import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { getStrapiUrl } from '../config/environment.js';
import { type Question } from '../schemas/QuestionSchema.js';

export const getQuestionText = (question: Question) =>
  `
__## ${question.name.trim()}__
${question.content.trim()}`.trim();

export const getQuestionButtons = (question: Question) => {
  if (question.links === null) {
    return [];
  }

  const links = Object.entries(question.links);
  const components = [];

  for (let index = 0; index < links.length; index += 5) {
    const row = new ActionRowBuilder<ButtonBuilder>();

    const buttons = links.slice(index, index + 5).map(([name, url]) =>
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setEmoji('🔗')
        .setLabel(name)
        .setURL(url.startsWith('http') ? url : `https://${url}`),
    );

    row.addComponents(buttons);
    components.push(row);
  }

  return components;
};

export const getQuestionFiles = (question: Question) => {
  if (question.files === null) {
    return [];
  }

  const strapiUrl = getStrapiUrl();

  return question.files.map((file) => ({
    name: file.name,
    url: `${strapiUrl}${file.url}`,
  }));
};
