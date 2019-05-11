import requestPromiseNative from 'request-promise-native';

import { SerializedUser } from '../../src/common/types';
import DBConnection from '../../src/db/DBConnection';
import UsersRepo from '../../src/repos/UsersRepo';
import { APIResponse, del, get, post, put } from './lib';

let user: SerializedUser;

// Connects to db before running tests and does setup
beforeAll(async () => {
  await DBConnection().catch((e) => {
    // eslint-disable-next-line no-console
    console.log('Error connecting to database');
    process.exit();
  });
});

test('Register a user', async () => {
  const body = {
    email: 'test@gmail.com',
    password: 'password',
    firstName: 'First',
    lastName: 'Last',
    phoneNumber: '(213) 373-4253',
  };

  await requestPromiseNative(post('/register/', body)).then((res: APIResponse) => {
    user = res.data;
    expect(res.success).toBeTruthy();
    expect(user.email).toBe(body.email);
    expect(user.firstName).toBe(body.firstName);
    expect(user.lastName).toBe(body.lastName);
    expect(user.phoneNumber).toBe(body.phoneNumber);
  });
});

test('Login', async () => {
  const body = {
    email: 'test@gmail.com',
    password: 'password',
  };

  await requestPromiseNative(post('/login/', body)).then((res: APIResponse) => {
    expect(res.success).toBeTruthy();
    expect({ ...res.data, session: {} }).toMatchObject({ ...user, session: {} });
  });
});

// Teardown
afterAll(async () => {
  await UsersRepo.deleteUserByID(user.id);
});
