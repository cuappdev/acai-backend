import DBConnection from '../../src/db/DBConnection';
import User from '../../src/entities/User';
import UsersRepo from '../../src/repos/UsersRepo';

let user: User;

// Connects to db before running tests and does setup
beforeAll(async () => {
  await DBConnection().catch((e) => {
    // eslint-disable-next-line no-console
    console.log('Error connecting to database');
    process.exit();
  });
});

test('Create User', async () => {
  user = await UsersRepo.createUser('test@gmail.com', 'password', 'First', 'Last',
                                    '(213) 373-4253');
  expect(user.email).toBe('test@gmail.com');
  expect(user.firstName).toBe('First');
  expect(user.lastName).toBe('Last');
  expect(user.phoneNumber).toBe('(213) 373-4253');
});

// Teardown
afterAll(async () => {
  await UsersRepo.deleteUserByID(user.id);
});
