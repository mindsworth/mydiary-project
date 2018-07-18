import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';

import entriesRoute from './routes/enteries';

const app = express();


app.use(logger('dev'));

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

app.get('/api/v1', (req, res) => res.status(200).json({
  message: 'Welcome to myDiary app for everyone.',
}));

app.use('/api/v1/entries', entriesRoute);

app.get('*', (req, res) => res.status(404).json({
  message: 'Request Not Found!',
}));

export default app;