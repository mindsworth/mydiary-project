import pg from 'pg';
import dotenv from 'dotenv';
import dbConfig from "./config";

dotenv.config();
const client = new pg.Client(dbConfig);

client.connect().then(() => {
  console.log('Connection Successful.');
}).catch(() => {
  console.log('Connection Not Successful.');
});

export default client;