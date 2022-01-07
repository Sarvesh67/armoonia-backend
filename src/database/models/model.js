const user = require('./user');
const nft = require('./nft');

const db = {
	user: user,
	nft: nft
};

Object.freeze(db);

module.exports = db;
