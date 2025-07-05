import request from 'supertest';
import app from '../app';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  USER_PASSWORD,
  USER_VERIFIED_EMAIL,
  USER_VERIFIED_EMAIL_TWO,
} from '../utils/env';

let adminToken: string;
let userTokenOne: string;
let userTokenTwo: string;
let idApproved: string;
let idRejected: string;
let idRevised: string;

beforeAll(async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  adminToken = response.body.data.token;
  const responseOne = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: USER_VERIFIED_EMAIL, password: USER_PASSWORD });
  userTokenOne = responseOne.body.data.token;
  const responseTwo = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: USER_VERIFIED_EMAIL_TWO, password: USER_PASSWORD });
  userTokenTwo = responseTwo.body.data.token;
});

describe('Get All Permissions', () => {
  it('Should return 200 Permissions fetched successfully', async () => {
    const response = await request(app)
      .get('/api/v1/permission')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Permissions fetched successfully');
  }, 15000);
});

describe('Get All Permissions By User', () => {
  it('Should return 200 Permissions fetched successfully', async () => {
    const response = await request(app)
      .get('/api/v1/permission/user')
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Permissions fetched successfully');
  }, 15000);
});

describe('Create Permission', () => {
  it('Should return 400 Title must not be more than 50 characters long', async () => {
    const permission = {
      title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do',
      description: 'Lorem ipsum',
      startDate: new Date(),
      endDate: new Date(),
    };
    const response = await request(app)
      .post('/api/v1/permission')
      .send(permission)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Title must not be more than 50 characters long'
    );
  }, 15000);

  it('Should return 409 Permission already exist', async () => {
    const permission = {
      title: 'Cuti Tahunan',
      description: 'Mengajukan cuti untuk urusan keluarga',
      startDate: '2025-07-10T00:00:00.000Z',
      endDate: '2025-07-12T00:00:00.000Z',
    };
    const response = await request(app)
      .post('/api/v1/permission')
      .send(permission)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Permission already exist');
  }, 15000);

  it('Should return 201 Permission created successfully', async () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const permission = {
      title: 'Cuti',
      description: 'Lorem ipsum',
      startDate,
      endDate,
    };
    const response = await request(app)
      .post('/api/v1/permission')
      .send(permission)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Permission created successfully');
    idApproved = response.body.data.permission.id;
  }, 15000);

  it('Should return 201 Permission created successfully', async () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const permission = {
      title: 'Cuti',
      description: 'Lorem ipsum',
      startDate,
      endDate,
    };
    const response = await request(app)
      .post('/api/v1/permission')
      .send(permission)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Permission created successfully');
    idRejected = response.body.data.permission.id;
  }, 15000);

  it('Should return 201 Permission created successfully', async () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const permission = {
      title: 'Cuti',
      description: 'Lorem ipsum',
      startDate,
      endDate,
    };
    const response = await request(app)
      .post('/api/v1/permission')
      .send(permission)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Permission created successfully');
    idRevised = response.body.data.permission.id;
  }, 15000);
});

describe('Update Permission Status', () => {
  it('Should return 404 Permission not found', async () => {
    const response = await request(app)
      .patch(`/api/v1/permission/test/status`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Permission not found');
  }, 15000);

  it('Should return 400 Verificator comment must be at least 3 characters long', async () => {
    const response = await request(app)
      .patch(`/api/v1/permission/${idApproved}/status`)
      .send({ status: 'REVISED', verificatorComment: '' })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Verificator comment must be at least 3 characters long'
    );
  }, 15000);

  it('Should return 200 Permission updated successfully', async () => {
    const response = await request(app)
      .patch(`/api/v1/permission/${idApproved}/status`)
      .send({ status: 'APPROVED', verificatorComment: 'Get Well Soon' })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Permission updated successfully');
  }, 15000);

  it('Should return 200 Permission updated successfully', async () => {
    const response = await request(app)
      .patch(`/api/v1/permission/${idRejected}/status`)
      .send({ status: 'REJECTED', verificatorComment: 'Get Well Soon' })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Permission updated successfully');
  }, 15000);

  it('Should return 200 Permission updated successfully', async () => {
    const response = await request(app)
      .patch(`/api/v1/permission/${idRevised}/status`)
      .send({ status: 'REVISED', verificatorComment: 'Get Well Soon' })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Permission updated successfully');
  }, 15000);
});

describe('Update Permission', () => {
  it('Should return 404 Permission not found', async () => {
    const response = await request(app)
      .patch(`/api/v1/permission/test`)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Permission not found');
  }, 15000);

  it('Should return 403 You are not authorized to update this permission', async () => {
    const response = await request(app)
      .patch(`/api/v1/permission/${idApproved}`)
      .set('Authorization', `Bearer ${userTokenTwo}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'You are not authorized to update this permission'
    );
  }, 15000);

  it('Should return 400 Permission already approved or rejected', async () => {
    const response = await request(app)
      .patch(`/api/v1/permission/${idApproved}`)
      .set('Authorization', `Bearer ${userTokenOne}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Permission already approved or rejected'
    );
  }, 15000);

  it('Should return 400 Permission already approved or rejected', async () => {
    const response = await request(app)
      .patch(`/api/v1/permission/${idRejected}`)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Permission already approved or rejected'
    );
  }, 15000);

  it('Should return 200 Permission updated successfully', async () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const permission = {
      title: 'Cuti Revisi',
      description: 'Lorem ipsum',
      startDate,
      endDate,
    };
    const response = await request(app)
      .patch(`/api/v1/permission/${idRevised}`)
      .send(permission)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Permission updated successfully');
  }, 15000);
});

describe('Get Permission By Id', () => {
  it('Should return 404 Permission not found', async () => {
    const response = await request(app)
      .get(`/api/v1/permission/test`)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Permission not found');
  }, 15000);

  it('Should return 403 You are not authorized to access this permission', async () => {
    const response = await request(app)
      .get(`/api/v1/permission/${idApproved}`)
      .set('Authorization', `Bearer ${userTokenTwo}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'You are not authorized to access this permission'
    );
  }, 15000);

  it('Should return 200 Permission fetched successfully', async () => {
    const response = await request(app)
      .get(`/api/v1/permission/${idApproved}`)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Permission fetched successfully');
  }, 15000);
});

describe('Delete Permission', () => {
  it('Should return 404 Permission not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/permission/test`)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Permission not found');
  }, 15000);

  it('Should return 403 You are not authorized to update this permission', async () => {
    const response = await request(app)
      .delete(`/api/v1/permission/${idApproved}`)
      .set('Authorization', `Bearer ${userTokenTwo}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'You are not authorized to delete this permission'
    );
  }, 15000);

  it('Should return 400 Permission already approved or rejected', async () => {
    const response = await request(app)
      .delete(`/api/v1/permission/${idApproved}`)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Permission already approved or rejected'
    );
  }, 15000);

  it('Should return 400 Permission already approved or rejected', async () => {
    const response = await request(app)
      .delete(`/api/v1/permission/${idRejected}`)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Permission already approved or rejected'
    );
  }, 15000);

  it('Should return 200 Permission deleted successfully', async () => {
    const response = await request(app)
      .delete(`/api/v1/permission/${idRevised}`)
      .set('Authorization', `Bearer ${userTokenOne}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Permission deleted successfully');
  }, 15000);
});
