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

// const pg = require('pg');
// require('dotenv').config();
// const client = new pg.Client();

// client.connect().then(() => {
//   console.log('Connection Successful.');
// }).catch((error) => {
//   console.log('Connection Not Successful.');
// });

// // const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
// // const values = ['brianc', 'brian.m.carlson@gmail.com']

// // // callback
// // client.query(text, values, (err, res) => {
// //     if (err) {
// //         console.log(err.stack)
// //     } else {
// //         console.log(res.rows[0])
// //         // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
// //     }
// // })

// module.exports = client;