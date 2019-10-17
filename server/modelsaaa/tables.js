import client from './database/dbconnect';

class TablesController {
  async createUsersTable(req, res) {
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users(user_id SERIAL PRIMARY KEY,
          first_name VARCHAR(20) not null,
          last_name VARCHAR(20) not null,
          email VARCHAR(40) not null,
          about VARCHAR(250),
          age integer,
          phone_number VARCHAR(250),
          reminder boolean not null,
          profile_image VARCHAR(255),
          profile_image_id VARCHAR(255),
          password VARCHAR(255) not null,
          createdAt timestamp not null,
          updatedAt timestamp not null
        )`);
      return res.status(201).json({
        message: 'USERS TABLE CREATED SUCCESSFULLY.',
      });
    } catch (error) {
      res.status(500).json({
        message: 'USERS TABLE FAILED TO CREATE.',
        error: error.toString(),
      });
    }
  }

  async createEntriesTable(req, res) {
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS entries(entry_id SERIAL PRIMARY KEY,
          title VARCHAR(100) not null,
          description VARCHAR(1000) not null,
          category_id integer not null,
          favorite boolean not null,
          user_id integer not null,
          createdAt timestamp not null,
          updatedAt timestamp not null
        )`);
      return res.status(201).json({
        message: 'ENTRIES TABLE CREATED SUCCESSFULLY.',
      });
    } catch (error) {
      res.status(500).json({
        message: 'ENTRIES TABLE FAILED TO CREATE.',
        error: error.toString(),
      });
    }
  }

  async createCategoriesTable(req, res) {
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS categories(category_id SERIAL PRIMARY KEY,
          title VARCHAR(100) not null,
          color_id integer not null,
          user_id integer not null
        )`);
      return res.status(201).json({
        message: 'CATEGORIES TABLE CREATED SUCCESSFULLY.',
      });
    } catch (error) {
      res.status(500).json({
        message: 'CATEGORIES TABLE FAILED TO CREATE.',
        error: error.toString(),
      });
    }
  }
}

export default new TablesController();