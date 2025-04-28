'use strict';

const { createStrapi } = require('@strapi/strapi');

module.exports = async () => {
  const strapi = await createStrapi();
  await strapi.load();
  return strapi;
};
