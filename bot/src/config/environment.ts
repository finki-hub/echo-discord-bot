import { errors } from '../translations/errors.js';

export const getBotCredentials = () => {
  const token = process.env['TOKEN'];
  const applicationId = process.env['APPLICATION_ID'];

  if (!token) {
    throw new Error(errors.noToken);
  }

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
