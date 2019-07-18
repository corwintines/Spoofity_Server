require('dotenv').config();

import * as express from 'express';

const app = express();
app.listen(process.env.PORT);
