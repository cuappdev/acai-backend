import Api from './Api';

const app = new Api();
const server = app.getServer(false);
const PORT: number = +process.env.PORT || 80;
const SERVER_ADDRESS: string = '0.0.0.0';
/**
 * Start Express server.
 */
app.express.listen(PORT, () => {
  console.log(
    `App is running on ${SERVER_ADDRESS}:${PORT}...`,
  );
  console.log('Press CTRL-C to stop\n');
});

export { server };
