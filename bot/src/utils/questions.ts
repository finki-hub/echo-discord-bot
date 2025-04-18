import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { getStrapiUrl } from '../config/environment.js';
import { type Question } from '../schemas/QuestionSchema.js';

export const getQuestionText = (question: Question) =>
  `
__## ${question.name.trim()}__
${question.content.trim()}`.trim();

export const getQuestionButtons = (question: Question) => {
  const components = [];

  if (question.links === null) {
    return [];
  }

  const links = Object.entries(question.links);

  for (let index1 = 0; index1 < links.length; index1 += 5) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    const buttons = [];

    for (let index2 = index1; index2 < index1 + 5; index2++) {
      const link = links[index2];

      if (link === undefined) {
        break;
      }

      const [name, url] = link;

      const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setEmoji('🔗')
        .setLabel(name)
        .setURL(url.startsWith('http') ? url : `https://${url}`);

      buttons.push(button);
    }

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
