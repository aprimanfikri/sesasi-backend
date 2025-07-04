import request from 'supertest';
import app from '../app';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../utils/env';

let token: string;
let id: string;

beforeAll(async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  token = response.body.data.token;
});

describe('Get All User', () => {
  it('Should return 200 Users fetched successfully', async () => {
    const response = await request(app)
      .get('/api/v1/user')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Users fetched successfully');
  }, 15000);
});

describe('Create User', () => {
  it('Should return 400 Name must not be more than 50 characters', async () => {
    const user = {
      name: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do',
      email: `${Date.now().toString()}@gmail.com`,
      password: Date.now().toString(),
      role: 'USER',
      isVerified: true,
    };
    const response = await request(app)
      .post('/api/v1/user')
      .send(user)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Name must not be more than 50 characters'
    );
  }, 15000);

  it('Should return 409 Email already in use', async () => {
    const user = {
      name: Date.now().toString(),
      email: ADMIN_EMAIL,
      password: Date.now().toString(),
      role: 'USER',
      isVerified: true,
    };
    const response = await request(app)
      .post('/api/v1/user')
      .send(user)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already in use');
  }, 15000);

  it('Should return 201 User created successfully', async () => {
    const user = {
      name: Date.now().toString(),
      email: `${Date.now().toString()}@gmail.com`,
      password: Date.now().toString(),
      role: 'USER',
      isVerified: true,
    };
    const response = await request(app)
      .post('/api/v1/user')
      .send(user)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    id = response.body.data.user.id;
  }, 15000);
});

describe('Update User', () => {
  it('Should return 404 User not found', async () => {
    const user = {
      name: 'Lorem ipsum',
    };
    const response = await request(app)
      .patch(`/api/v1/user/id`)
      .send(user)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  }, 15000);

  it('Should return 400 Name must not be more than 50 characters', async () => {
    const user = {
      name: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do',
    };
    const response = await request(app)
      .patch(`/api/v1/user/${id}`)
      .send(user)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Name must not be more than 50 characters'
    );
  }, 15000);

  it('Should return 409 Email already in use', async () => {
    const user = {
      email: ADMIN_EMAIL,
    };
    const response = await request(app)
      .patch(`/api/v1/user/${id}`)
      .send(user)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already in use');
  }, 15000);

  it('Should return 200 User updated successfully', async () => {
    const user = {
      email: `${Date.now().toString()}@gmail.com`,
      password: Date.now().toString(),
    };
    const response = await request(app)
      .patch(`/api/v1/user/${id}`)
      .send(user)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User updated successfully');
  }, 15000);
});

describe('Get User By Id', () => {
  it('Should return 404 User not found', async () => {
    const response = await request(app)
      .get(`/api/v1/user/id`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  }, 15000);

  it('Should return 200 User fetched successfully', async () => {
    const response = await request(app)
      .get(`/api/v1/user/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User fetched successfully');
  }, 15000);
});

describe('Delete User', () => {
  it('Should return 404 User not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/user/id`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  }, 15000);

  it('Should return 200 User deleted successfully', async () => {
    const response = await request(app)
      .delete(`/api/v1/user/${id}`)
      .set('Authorization', `Bearer ${token}`);

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted successfully');
  }, 15000);
});
