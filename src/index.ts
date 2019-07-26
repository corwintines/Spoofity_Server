import * as express from 'express';
import { SERVER_PORT } from './const';
import registerRoutes from './routes';

const app = express();
registerRoutes(app);
app.listen(SERVER_PORT);
