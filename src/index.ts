require('dotenv').config();

import * as express from 'express';
import registerRoutes from './routes';

const app = express();
registerRoutes(app);
app.listen(process.env.PORT);
