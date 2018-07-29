import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const client = new pg.Client();

client.connect().then(() => {
  console.log('Connection Successful.');
}).catch(() => {
  console.log('Connection Not Successful.');
});

export default client;