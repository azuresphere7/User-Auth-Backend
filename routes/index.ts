import * as express from 'express';
import user from './user';

const router: express.Router = express.Router();

router.use('/user', user);

export default router;