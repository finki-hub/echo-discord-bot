import { errors } from '../translations/errors.js';

export const loadOptionalEnvFile = () => {
  try {
    process.loadEnvFile();
  } catch (error) {
    if (
      typeof error !== 'object' ||
      error === null ||
      !('code' in error) ||
      error.code !== 'ENOENT'
    ) {
      throw error;
    }
  }
};

export const getBotCredentials = () => {
  const token = process.env['TOKEN'];

  if (!token) {
    throw new Error(errors.noToken);
  }

  const applicationId = process.env['APPLICATION_ID'];

  if (!applicationId) {
    throw new Error(errors.noApplicationId);
  }

  return {
    applicationId,
    token,
  };
};

export const getStrapiUrl = () => {
  const url = process.env['STRAPI_URL'];

  if (!url) {
    throw new Error(errors.noStrapiUrl);
  }

  return url;
};
