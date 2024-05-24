import debug from 'debug';
import { start } from './lib/express';
import config from './config';
import { get } from './config/tools';

const log = debug('app:main');

(async () => {
  const app = await start();
  app.listen(config.port, config.host, () => {
    log(`ENV                 : %s`, config.env);
    log(`MONGODB             : %s`, get('DATABASE_URL'));
    log(`Server listening on : %s`, `${config.publicUrl}`);
  });
})();
