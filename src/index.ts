import * as express from 'express';
import * as cors from 'cors';
import { SERVER_PORT } from './const';
import registerRoutes from './routes';

const app = express();
app.use(
  cors({
    origin: '*'
  })
);

registerRoutes(app);

app.listen(SERVER_PORT, () => {
  console.log('Listening on port', SERVER_PORT);
});
