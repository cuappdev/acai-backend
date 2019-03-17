// @flow
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import Transaction from '../entities/Transaction';
import User from '../entities/User';

const isProduction = process.env.NODE_ENV === 'production';

const entities = [
  Transaction,
  User,
];

const connectionOptions: ConnectionOptions = {
  entities,
  type: 'postgres',
  host: process.env.DB_HOST,
  port: isProduction ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  extra: {
    ssl: isProduction,
  },
};

const dbConnection = (): Promise<Connection> => createConnection(connectionOptions);

export default dbConnection;
