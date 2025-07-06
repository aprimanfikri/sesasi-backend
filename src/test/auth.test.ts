import request from 'supertest';
import app from '../app';
import {
  ADMIN_EMAIL,
  ADMIN_EMAIL_TWO,
  ADMIN_PASSWORD,
  JWT_SECRET,
  USER_PASSWORD,
  USER_UNVERIFIED_EMAIL,
  USER_VERIFIED_EMAIL,
} from '../utils/env';
import jwt from 'jsonwebtoken';

let tokenOne: string;
let tokenTwo: string;

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
    tokenOne = response.body.data.token;
  }, 15000);

  it('Should return 200 User login successfully', async () => {
    const user = {
      email: ADMIN_EMAIL_TWO,
      password: ADMIN_PASSWORD,
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User login successfully');
    tokenTwo = response.body.data.token;
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
      .set('Authorization', tokenOne);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token format');
  }, 15000);

  it('Should return 401 Token signature verification failed', async () => {
    const response = await request(app)
      .get('/api/v1/auth')
      .set('Authorization', `Bearer ${tokenOne}s`);
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
    await new Promise((resolve) => setTimeout(resolve, 1100));

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
      .set('Authorization', `Bearer ${tokenOne}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Authenticated successfully');
  }, 15000);
});

describe('Update Account', () => {
  it('Should return 400 Name must not be more than 50 characters long', async () => {
    const user = {
      name: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do',
      email: ADMIN_EMAIL,
    };
    const response = await request(app)
      .patch('/api/v1/auth')
      .set('Authorization', `Bearer ${tokenOne}`)
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Name must not be more than 50 characters long'
    );
  }, 15000);

  it('Should return 409 Email already in use', async () => {
    const user = {
      name: 'Lorem ipsum',
      email: USER_VERIFIED_EMAIL,
    };
    const response = await request(app)
      .patch('/api/v1/auth')
      .set('Authorization', `Bearer ${tokenOne}`)
      .send(user);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already in use');
  }, 15000);

  it('Should return 200 Account updated successfully', async () => {
    const user = {
      name: 'Lorem ipsum',
      email: ADMIN_EMAIL,
    };
    const response = await request(app)
      .patch('/api/v1/auth')
      .set('Authorization', `Bearer ${tokenOne}`)
      .send(user);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Account updated successfully');
  }, 15000);
});

describe('Update Password', () => {
  it('Should return 400 Password must be at least 8 characters long', async () => {
    const user = {
      password: '',
      newPassword: '12345678',
      newConfirmPassword: '12345678',
    };
    const response = await request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', `Bearer ${tokenOne}`)
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Password must be at least 8 characters long'
    );
  }, 15000);

  it('Should return 400 New password and confirm password must be the same', async () => {
    const user = {
      password: 'password1234',
      newPassword: '12345678',
      newConfirmPassword: '123456789',
    };
    const response = await request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', `Bearer ${tokenOne}`)
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'New password and confirm password must be the same'
    );
  }, 15000);

  it('Should return 400 Invalid Password', async () => {
    const user = {
      password: 'password1234',
      newPassword: '12345678',
      newConfirmPassword: '12345678',
    };
    const response = await request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', `Bearer ${tokenOne}`)
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid Password');
  }, 15000);

  it('Should return 400 New password must be different from current password', async () => {
    const user = {
      password: ADMIN_PASSWORD,
      newPassword: ADMIN_PASSWORD,
      newConfirmPassword: ADMIN_PASSWORD,
    };
    const response = await request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', `Bearer ${tokenOne}`)
      .send(user);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'New password must be different from current password'
    );
  }, 15000);

  it('Should return 200 Password updated successfully', async () => {
    const user = {
      password: ADMIN_PASSWORD,
      newPassword: 'newpassword123',
      newConfirmPassword: 'newpassword123',
    };
    const response = await request(app)
      .patch('/api/v1/auth/password')
      .set('Authorization', `Bearer ${tokenTwo}`)
      .send(user);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password updated successfully');
  }, 15000);
});
