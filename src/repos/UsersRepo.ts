import { createHash } from 'crypto';
import { getConnectionManager, Repository } from 'typeorm';
import User, { SerializedUser } from '../entities/User';

const db = (): Repository<User> => getConnectionManager().get().getRepository(User);

type CreateUserFields = {
  customerId: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
};

const createUser = async (fields: CreateUserFields): Promise<SerializedUser> => {
  try {
    const { password, ...rest } = fields;
    const passwordHash = createHash('sha256').update(password).digest('hex');
    const user = db().create({ ...rest, passwordHash });
    await db().save(user);
    return user.serialize();
  } catch (e) {
    throw Error('Unable to create user');
  }
};

const getUserById = async (id: string): Promise<SerializedUser> => {
  try {
    return (await db().findOne({id})).serialize();
  } catch (e) {
    throw Error('Unable to find user');
  }
};

const authUser = async (email: string, password: string): Promise<SerializedUser> => {
  try {
    const passwordHash = createHash('sha256').update(password).digest('hex');
    const user = await db().findOne({ email, passwordHash });
    return user.serialize();
  } catch (e) {
    throw Error('Could not authenticate user');
  }
};

export default {
  createUser,
  getUserById,
  authUser,
};
