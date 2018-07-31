import "babel-polyfill";
import client from './dbconnect';

(async () => {
  try {
    await client.query('DROP TABLE IF EXISTS users');
    await client.query(`
        CREATE TABLE IF NOT EXISTS users(user_id SERIAL PRIMARY KEY,
          first_name VARCHAR(20) not null,
          last_name VARCHAR(20) not null,
          email VARCHAR(40) not null,
          about VARCHAR(250) null,
          age VARCHAR(250) null,
          password VARCHAR(255) not null,
          createdAt timestamp not null,
          updatedAt timestamp not null
        )`);

    await client.query('DROP TABLE IF EXISTS entries');
    await client.query(`
        CREATE TABLE IF NOT EXISTS entries(entry_id SERIAL PRIMARY KEY,
          title VARCHAR(100) not null,
          description VARCHAR(1000) not null,
          category_id VARCHAR(250) not null,
          user_id VARCHAR(250) not null,
          createdAt timestamp not null,
          updatedAt timestamp not null
        )`);

    await client.query('DROP TABLE IF EXISTS categories');
    await client.query(`
        CREATE TABLE IF NOT EXISTS categories(category_id SERIAL PRIMARY KEY,
          title VARCHAR(100) not null,
          color_id VARCHAR(10) not null
        )`);

    client.end();

    console.log("Tables successfully created!");
  } catch (error) {
    console.log(error);
  }
})();