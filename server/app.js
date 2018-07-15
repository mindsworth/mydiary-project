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


app.use('/api/v1/entries', entriesRoute);
app.use((req, res, next) => {
  const error = new Error('Request Not Found!');
  error.status = 404;

  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});


export default app;