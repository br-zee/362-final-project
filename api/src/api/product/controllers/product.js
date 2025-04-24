'use strict';

/**
 * product controller
 */

// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::product.product');


const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 24);

module.exports = {
  async create(ctx) {
    const incomingData = ctx.request.body?.data;
    const documentId = incomingData?.document_id || nanoid();

    // If not passed, set it
    incomingData.document_id = documentId;

    // Try to find an existing product with that document_id
    const existing = await strapi.db.query('api::product.product').findOne({
      where: { document_id: documentId },
    });

    if (existing) {
      // Update instead
      const updated = await strapi.entityService.update('api::product.product', existing.id, {
        data: incomingData,
      });
      return ctx.send(updated);
    } else {
      // No existing — proceed with create
      const created = await strapi.entityService.create('api::product.product', {
        data: incomingData,
      });
      return ctx.send(created);
    }
  }
};
