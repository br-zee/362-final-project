'use strict';

module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/products',
        handler: 'product.create', // must match your custom controller
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'PUT',
        path: '/products/:id',
        handler: 'product.update',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
