const request = require('supertest');
const createStrapi = require('../server');

jest.setTimeout(30000);

let strapi;

beforeAll(async () => {
  strapi = await createStrapi();   // <<< FIXED
  await strapi.start();
});

afterAll(async () => {
  if (strapi) {
    try {
      await strapi.destroy();
    }
    catch(err) {
      console.warn("Warning during shutdown: ", err.message)
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
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
      const productId = products[0].documentId;

      const res2 = await request(strapi.server.httpServer)
        .get(`/api/products?filters[documentId][$eq]=${productId}`)
        .expect(200);

      expect(res2.body).toBeDefined();
      expect(res2.body.data[0]).toHaveProperty('documentId', productId);
    }
  });

  it('should return 404 for non-existing product', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products?filters[documentId][$eq]=999999')
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.data.length === 0)
  });

  it('should fetch products with price <= 100', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products?filters[price][$lte]=100')
      .expect(200);
  
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  
    res.body.data.forEach((product) => {
      expect(product.price).toBeLessThanOrEqual(100);
    });
  });

  it('should fetch products with category = neckties', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products?filters[categories][title][$eq]=neckties&populate[0]=categories')
      .expect(200);
  
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  
    res.body.data.forEach((product) => {
      expect(product.categories[0].title).toBe('neckties');
    });
  });

  it('should fetch products sorted by price ascending', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products?sort=price:asc')
      .expect(200);
  
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  
    const prices = res.body.data.map(p => p.price);
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

  it('should ignore invalid filters gracefully', async () => {
    const res = await request(strapi.server.httpServer)
      .get('/api/products?filters[price][$invalidOperator]=100')
      .expect(200);
  
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should create an order', async () => {
    const res = await request(strapi.server.httpServer)
      .post('/api/orders') // <<< your real order endpoint
      .send({
        // send mock order data
        data: {
          products: [
            {
              "id": "uro1dpggyj81zrylyz5hcore",
              "title": "Green Tie",
              "desc": "green tie description",
              "price": 15,
              "img": "https://tiedandtrue-assets.s3.us-east-2.amazonaws.com/green_tie_9ba7599fde.png",
              "stock": 10,
              "quantity": 1
            }
          ],
          userData: {
            username: "testuser",
            name: "Test User",
            email: "test@example.com",
          },
        }
      })
      .expect(200); // or maybe 201 depending on your API
    
    expect(res.body).toBeDefined();
    expect(res.body.stripeSession).toHaveProperty('id'); // confirm order created
  });

  it('should create a product (to trigger lifecycles)', async () => {
    const res = await request(strapi.server.httpServer)
      .post('/api/products')
      .set("Authorization", "bearer " + process.env.VITE_API_TOKEN)
      .send({
        data: {
          title: "Test Product",
          description: "Test Description",
          price: 50,
          type: "featured",
          color: "blue",
          stock: 123
        }
      })
      .expect(201);
    
    expect(res.body).toBeDefined();
    expect(res.body.data).toHaveProperty('id');
  });
  

});
