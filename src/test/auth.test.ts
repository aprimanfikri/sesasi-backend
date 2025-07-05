import request from 'supertest';
import app from '../app';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  JWT_SECRET,
  USER_PASSWORD,
  USER_UNVERIFIED_EMAIL,
} from '../utils/env';
import jwt from 'jsonwebtoken';

let token: string;
const jwtInvalidUser = jwt.sign({ id: '123' }, JWT_SECRET, {
  expiresIn: '1h',
});
const jwtExpired = jwt.sign({ id: '123' }, JWT_SECRET, {
  expiresIn: '1s',
});

describe('Register User', () => {
  it('Should return 400 Name must not be more than 50 characters long', async () => {
    const user = {
      name: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do',
      email: `${Date.now().toString()}@gmail.com`,
      password: Date.now().toString(),
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Name must not be more than 50 characters long'
    );
  }, 15000);

  it('Should return 409 Email already in use', async () => {
    const user = {
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already in use');
  }, 15000);

  it('Should return 201 User register successfully', async () => {
    const user = {
      name: Date.now().toString(),
      email: `${Date.now().toString()}@gmail.com`,
      password: Date.now().toString(),
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User register successfully');
  }, 15000);
});

describe('Login User', () => {
  it('Should return 400 Password must be at least 8 characters long', async () => {
    const user = {
      email: ADMIN_EMAIL,
      password: 'asd',
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Password must be at least 8 characters long'
    );
  }, 15000);

  it('Should return 404 Email not found', async () => {
    const user = {
      email: 'test@gmail.com',
      password: ADMIN_PASSWORD,
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Email not found');
  }, 15000);

  it('Should return 400 Invalid Password', async () => {
    const user = {
      email: ADMIN_EMAIL,
      password: 'asdasdasdasd',
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid Password');
  }, 15000);

  it('Should return 403 Email not verified', async () => {
    const user = {
      email: USER_UNVERIFIED_EMAIL,
      password: USER_PASSWORD,
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Email not verified');
  }, 15000);

  it('Should return 200 User login successfully', async () => {
    const user = {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User login successfully');
    token = response.body.data.token;
  }, 15000);
});

describe('Check User', () => {
  it('Should return 401 Authorization token is required', async () => {
    const response = await request(app).get('/api/v1/auth');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authorization token is required');
  }, 15000);

  it('Should return 401 Invalid token format', async () => {
    const response = await request(app)
      .get('/api/v1/auth')
      .set('Authorization', token);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token format');
  }, 15000);

  it('Should return 401 Token signature verification failed', async () => {
    const response = await request(app)
      .get('/api/v1/auth')
      .set('Authorization', `Bearer ${token}s`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token signature verification failed');
  }, 15000);

  it('Should return 401 Invalid user', async () => {
    const response = await request(app)
      .get('/api/v1/auth')
      .set('Authorization', `Bearer ${jwtInvalidUser}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid user');
  }, 15000);

  it('Should return 401 Token expired. Please login again', async () => {
    const response = await request(app)
      .get('/api/v1/auth')
      .set('Authorization', `Bearer ${jwtExpired}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token expired. Please login again');
  }, 15000);

  it('Should return 401 Invalid token format', async () => {
    const response = await request(app)
      .get('/api/v1/auth')
      .set('Authorization', 'Bearer token');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token format');
  }, 15000);

  it('Should return 200 Authenticated successfully', async () => {
    const response = await request(app)
      .get('/api/v1/auth')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Authenticated successfully');
  }, 15000);
});
