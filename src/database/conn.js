const { Sequelize, Op, DataTypes } = require('sequelize');
const config = require('../services/config.service');

const db = {};

db.sequelize = Sequelize;

db.conn = new Sequelize({
	dialect: config.db.dialect,
	host: config.db.host,
	username: config.db.username,
	password: config.db.password,
	port: config.db.port,
	database: config.db.database,
	pool: {
		max: 10,
		acquire: 10000,
		maxUses: 3,
		min: 1
	}
});

db.connectDb = () => {
	return db.conn.authenticate().then(console.log('Postgres connection succesful on port: ' + config.db.port));
};

db.op = Op;
db.DataTypes = DataTypes;

// Define models here

// Define relationships here

module.exports = db;
