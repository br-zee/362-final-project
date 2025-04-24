module.exports = {
    async beforeCreate(event) {
      const incoming = event.params.data;
  
      if (incoming.document_id) {
        const existing = await strapi.db.query('api::product.product').findOne({
          where: { document_id: incoming.document_id },
        });
  
        if (existing) {
          // cancel create, do an update instead
          throw new Error(`Duplicate document_id found: ${incoming.document_id}. Use update instead.`);
        }
      }
    },
  
    async beforeUpdate(event) {
      const incoming = event.params.data;
  
      // Optional: Could check if another entry with the same document_id exists
    },
  };
  