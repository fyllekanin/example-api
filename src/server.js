import express from 'express';
import * as dotenv from 'dotenv';
import { Database } from './database/database.js';
import { MagicApi } from './api/magic.api.js';

dotenv.config();

const application = express();
const database = new Database();
await database.initialize();

application.use('/api/v1/magic', new MagicApi(database).getApi());

application.listen(process.env.APPLICATION_PORT, () => {
    console.log(`Server started at: ${process.env.APPLICATION_PORT}`);
});
