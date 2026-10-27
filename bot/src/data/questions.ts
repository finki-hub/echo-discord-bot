import { getStrapiUrl } from '../config/environment.js';
import { StrapiQuestionSchema } from '../schemas/QuestionSchema.js';

export const getQuestionsByTerm = async (term: string) => {
  const strapiUrl = getStrapiUrl();
  const url = new URL(`${strapiUrl}/api/questions`);
  url.searchParams.set('sort', 'name:asc');
  url.searchParams.set('populate', 'files');
  url.searchParams.set('filters[name][$containsi]', term);
  const questions = await fetch(url);
  if (!questions.ok) {
    throw new Error(`Question API request failed (${questions.status})`);
  }
  const parsedData = await questions.json();
  const parsedQuestions = StrapiQuestionSchema.parse(parsedData);

  return parsedQuestions.data;
};

export const getAllQuestions = async () => {
  const strapiUrl = getStrapiUrl();
  const questions = await fetch(`${strapiUrl}/api/questions?sort=name:asc`);
  if (!questions.ok) {
    throw new Error(`Question API request failed (${questions.status})`);
  }
  const parsedData = await questions.json();
  const parsedQuestions = StrapiQuestionSchema.parse(parsedData);

  return parsedQuestions.data;
};
