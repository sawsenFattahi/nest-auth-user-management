import * as request from 'supertest';

import { setupTestApp } from '@um/modules/users/test-setup';

describe('UsersController (Integration Test)', () => {
  let adminToken: string;
  let userId: string;
  let app;
  let connection;
  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    connection = setup.connection;
    const createUserResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        username: 'admin-example',
        password: 'Password123!',
        name: 'John Doe',
        email: 'admin@example.com',
        role: 'ADMIN',
        address: {
          city: 'New York',
          zip: '10001',
        },
        comment: 'A test user',
      });

    userId = createUserResponse.body.id;

    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      username: 'admin-example',
      password: 'Password123!',
    });

    adminToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await connection.dropDatabase(); // Supprime la base de test
    await connection.close();
    await app.close();
  });

  it('/users (POST) - should create a user', async () => {
    const newUser = {
      username: 'user-example',
      password: 'Password123!',
      name: 'test test',
      email: 'test@example.com',
      role: 'USER',
      address: {
        city: 'New York',
        zip: '10001',
      },
      comment: 'A test user',
    };

    const response = await request(app.getHttpServer()).post('/users').send(newUser).expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(newUser.username);
  });

  it('/users (GET) - should return all users (admin only)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`) // Remplacez par un token valide
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/users/:id (GET) - should return a single user by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', userId);
  });

  it('/users/me (PATCH) - should update current user info', async () => {
    const updates = { name: 'UpdatedName' };
    const response = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${adminToken}`) // Remplacez par un token valide
      .send(updates)
      .expect(200);

    expect(response.body).toHaveProperty('username');
  });

  it('/users/:id (PATCH) - should update a user (admin only)', async () => {
    const updates = { role: 'ADMIN' };

    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updates)
      .expect(200);

    expect(response.body.role).toBe('ADMIN');
  });

  it('/users/:id (DELETE) - should delete a user (admin only)', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
