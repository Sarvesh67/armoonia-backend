/* eslint-disable no-undef */
require('dotenv').config();

/* const db = {
	dialect: 'postgres',
	host: process.env.NODE_ENV === 'docker' ? 'armoonia-db' : process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWD,
	database: process.env.DB_DATABASE
};

const app = {
	host: process.env.HOST,
	port: process.env.PORT
}; */

/* const config = {
	env: process.env.NODE_ENV,
	db: db,
	app: app
}; */

const config = Object.freeze(
	new (function () {
		this.env = process.env.NODE_ENV || 'development';
		this.db = {
			dialect: 'postgres',
			host: this.env === 'docker' ? 'armoonia-db' : process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT || 5432,
			username: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASSWD || 'eatsleepcode',
			database: process.env.DB_DATABASE || 'armoonia'
		};
		this.app = {
			host: process.env.HOST || 'localhost',
			port: process.env.PORT || 5001,
			JWTKEY: process.env.JWTKEY || 'SecretJwtKey'
		};
	})()
);

module.exports = config;

if (require.main == module) {
	// Print out the env settings.
	console.log(config);
}
