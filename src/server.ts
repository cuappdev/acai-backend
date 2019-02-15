import Api from './Api';

const app = new Api();
const server = app.getServer(false);

/**
 * Start Express server.
 */
app.express.listen(3000, () => {
  console.log(
    'App is running...',
  );
  console.log('  Press CTRL-C to stop\n');
});

export { server };
