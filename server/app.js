import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import routes from './routes/index';


const app = express();
const router = express.Router();

app.use(logger('dev'));

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());
app.use(cors());

routes(router);
app.use('/api/v1/', router);

app.get('*', (req, res) => res.status(404).json({
  message: 'Request Not Found!',
}));

export default app;