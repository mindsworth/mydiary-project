import client from './database/dbconnect';

class TablesController {
  async createUsersTable(req, res) {
    try {
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
      return res.status(201).json({
        message: 'USERS TABLE CREATED SUCCESSFULLY.',
      });
    } catch (error) {
      res.status(500).json({
        message: 'USERS TABLE FAILED TO CREATE.',
        error,
      });
    }
  }

  async createEntriesTable(req, res) {
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS entries(entry_id SERIAL PRIMARY KEY,
          title VARCHAR(100) not null,
          description VARCHAR(1000) not null,
          category_id VARCHAR(250) not null,
          user_id VARCHAR(250) not null,
          createdAt timestamp not null,
          updatedAt timestamp not null
        )`);
      return res.status(201).json({
        message: 'ENTRIES TABLE CREATED SUCCESSFULLY.',
      });
    } catch (error) {
      res.status(500).json({
        message: 'ENTRIES TABLE FAILED TO CREATE.',
        error,
      });
    }
  }

  async createCategoriesTable(req, res) {
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS categories(category_id SERIAL PRIMARY KEY,
          title VARCHAR(100) not null,
          color_id VARCHAR(10) not null
        )`);
      return res.status(200).json({
        message: 'CATEGORIES TABLE CREATED SUCCESSFULLY.',
      });
    } catch (error) {
      res.status(500).json({
        message: 'CATEGORIES TABLE FAILED TO CREATE.',
        error,
      });
    }
  }
}

export default new TablesController();