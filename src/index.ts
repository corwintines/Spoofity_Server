import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import passport from './services/passport';

import registerRoutes from './routes';

import { SERVER_PORT } from './const';

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*'
  })
);
app.use(passport.initialize());

registerRoutes(app);

app.listen(SERVER_PORT, () => {
  console.log('Listening on port', SERVER_PORT);
});
