import http from 'http';
import app from './app';

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});

app.use((req, res) => {
  res.status(200).json({
    message: 'Page Not FOund.',
  });
});
