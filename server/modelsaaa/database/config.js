import dotenv from 'dotenv';

dotenv.config();

const config = {
  production: {
    connectionString: process.env.DATABASE_URL,
  },
  development: {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: 5432,
  },
  test: {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.TEST_PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: 5432,
  },
};

export default config[process.env.NODE_ENV];