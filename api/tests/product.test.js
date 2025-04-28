const request = require('supertest');
const createStrapi = require('../server');

jest.setTimeout(30000);

let strapi;

beforeAll(async () => {
  strapi = await createStrapi();   // <<< FIXED
  await strapi.start();
});

afterAll(async () => {
  await strapi.stop();
});

describe('Product API Endpoints', () => {
  it('should fetch all products', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products')
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should fetch a single product by ID', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products')
      .expect(200);

    const products = res.body.data;

    if (products.length > 0) {
      const productId = products[0].id;

      const res2 = await request(strapi.server.httpServer)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(res2.body).toBeDefined();
      expect(res2.body.data).toHaveProperty('id', productId);
    }
  });

  it('should return 404 for non-existing product', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products/999999')
      .expect(404);

    expect(res.body).toBeDefined();
  });

  it('should fetch products with price <= 100', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products?filters[price][$lte]=100')
      .expect(200);
  
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  
    res.body.data.forEach((product) => {
      expect(product.attributes.price).toBeLessThanOrEqual(100);
    });
  });

  it('should fetch products with category = neckties', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products?filters[categories][title][$eq]=neckties')
      .expect(200);
  
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  
    res.body.data.forEach((product) => {
      expect(product.attributes.categories.data[0].attributes.title).toBe('neckties');
    });
  });

  it('should fetch products sorted by price ascending', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products?sort=price:asc')
      .expect(200);
  
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  
    const prices = res.body.data.map(p => p.attributes.price);
    const sortedPrices = [...prices].sort((a, b) => a - b);
  
    expect(prices).toEqual(sortedPrices);
  });

  it('should return 404 for a very high random non-existing product ID', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products/999999999')
      .expect(404);
  
    expect(res.body).toBeDefined();
  });

  it('should fetch products and include pagination meta', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products')
      .expect(200);
  
    expect(res.body).toBeDefined();
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.pagination).toBeDefined();
  });

  it('should handle invalid filter gracefully', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products?filters[price][$invalidOperator]=100')
      .expect(400);
  
    expect(res.body).toBeDefined();
  });

});
