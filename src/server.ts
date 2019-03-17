import dotenv from 'dotenv';
import 'reflect-metadata';
import API from './API';
import DBConnection from './db/DBConnection';

const app = new API();
const server = app.getServer(false);
const PORT: number = +process.env.PORT || 5000;
const SERVER_ADDRESS: string = '0.0.0.0';

dotenv.config(); // establish env variables

DBConnection().then(async (connection: any) => {
  app.express.listen(PORT, () => {
    console.log(
      `App is running on ${SERVER_ADDRESS}:${PORT}...`,
    );
    console.log('Press CTRL-C to stop\n');
  });
}).catch((error: any) => console.log(error));

export { server };
