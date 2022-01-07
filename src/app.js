/*eslint no-undef: "error"*/
/*eslint-env node*/

const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const routes = require('./routes');
const db = require('./database/db');
const config = require('./services/config.service');

async function Server() {
	const app = express();

	// Load middlewares here

	// Set security HTTP headers
	app.use(helmet());

	// Parse json request body
	app.use(express.json());

	// Parse urlencoded request body
	app.use(express.urlencoded({ extended: true }));

	// Sanitize request data
	app.use(xss());

	// enable cors
	app.use(cors());
	app.options('*', cors());

	// Load routes here
	app.use('/', routes);

	// Load error handler

	app.listen(config.app.port, () => {
		console.log(`Listening on port ${config.app.port}. \nWelcome to Armoonia Backend!`);
	});

	app.on('error', (e) => {
		throw e;
	});
}

function Database() {
	// Test connectivity
	return db.connectDb();
}

if (require.main === module) {
	// Run Express App
	Server().catch((e) => {
		console.log(e);
	});

	// Run Database
	Database().catch((e) => {
		console.log(e);
	});
}
