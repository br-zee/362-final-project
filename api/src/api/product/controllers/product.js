'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    console.log(data)
    strapi.log.info(data);

    if (data.document_id) {
      const existing = await strapi.db.query('api::product.product').findOne({
        where: { document_id: data.document_id },
      });

      if (existing) {
        // Update instead of creating a new entry
        const updated = await strapi.entitySersvice.update('api::product.product', existing.id, {
          data,
        });
        return updated;
      }
    } 

    // Fallback to default create behavior
    const response = await super.create(ctx);
    return response;
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    console.log(data);
    strapi.log.info('✏️ Updating product ID:', id);
  
    return await super.update(ctx);
  }
}));
