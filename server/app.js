import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import routes from './routes/index';
// import entriesRoute from './routes/enteries';


const app = express();
const router = express.Router();

app.use(logger('dev'));

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());
routes(router);
// app.get('/api/v1', (req, res) => res.status(200).json({
//   message: 'Welcome to myDiary app for everyone.',
// }));

app.use('/api/v1/', router);

app.get('*', (req, res) => res.status(404).json({
  message: 'Request Not Found!',
}));

export default app;