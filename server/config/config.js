require('dotenv').config()

module.exports = {
	development: {
		username: process.env.PG_USER,
		password: process.env.PG_PASSWORD,
		database: process.env.PG_DATABASE,
		host: process.env.PG_HOST,
		dialect: 'postgres',
		port: process.env.DB_PORT
	},
	test: {
		username: process.env.PG_USER,
		password: process.env.PG_PASSWORD,
		database: process.env.TEST_PG_DATABASE,
		host: process.env.PG_HOST,
		dialect: 'postgres',
		port: process.env.DB_PORT
	},
	production: {
		username: process.env.PG_USER,
		password: process.env.PG_PASSWORD,
		database: process.env.PG_DATABASE,
		host: process.env.PG_HOST,
		dialect: 'postgres',
		port: process.env.DB_PORT
	}
}
