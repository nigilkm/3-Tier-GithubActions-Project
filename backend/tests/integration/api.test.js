const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const createApp = require('../../src/app');

let mongod;
let app;

beforeAll(async () => {
  // Spin up an in-memory Mongo instance so integration tests don't need
  // a real database tier - but still exercise real mongoose queries.
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('GET /health', () => {
  test('returns 200 ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Items API (integration)', () => {
  test('GET /api/items returns empty array initially', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/items creates an item', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Keyboard', quantity: 3 });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Keyboard');
    expect(res.body._id).toBeDefined();
  });

  test('POST /api/items rejects invalid payload', async () => {
    const res = await request(app).post('/api/items').send({ quantity: -5 });
    expect(res.status).toBe(400);
  });

  test('GET /api/items/:id returns a single item', async () => {
    const created = await request(app).post('/api/items').send({ name: 'Mouse', quantity: 1 });
    const res = await request(app).get(`/api/items/${created.body._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Mouse');
  });

  test('GET /api/items/:id returns 404 for unknown id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/items/${fakeId}`);
    expect(res.status).toBe(404);
  });

  test('PUT /api/items/:id updates an item', async () => {
    const created = await request(app).post('/api/items').send({ name: 'Monitor', quantity: 2 });
    const res = await request(app)
      .put(`/api/items/${created.body._id}`)
      .send({ quantity: 9 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(9);
  });

  test('DELETE /api/items/:id removes an item', async () => {
    const created = await request(app).post('/api/items').send({ name: 'Cable', quantity: 4 });
    const del = await request(app).delete(`/api/items/${created.body._id}`);
    expect(del.status).toBe(204);

    const getAfter = await request(app).get(`/api/items/${created.body._id}`);
    expect(getAfter.status).toBe(404);
  });

  test('unknown route returns 404', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
  });
});
