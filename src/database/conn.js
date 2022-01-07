/* eslint-disable no-undef */
const { Sequelize, Op, DataTypes } = require('sequelize');
const config = require('../services/config.service');

const db = {};

db.sequelize = Sequelize;

if (process.env.NODE_ENV === 'production') {
	db.conn = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres',
		protocol: 'postgres',
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false
			}
		}
	});
} else {
	db.conn = new Sequelize(config.db);
}

db.connectDb = () => {
	return db.conn.authenticate().then(console.log('Postgres connection succesful on port: ' + config.db.port));
};

db.op = Op;
db.DataTypes = DataTypes;

// Define models here

// Define relationships here

module.exports = db;
