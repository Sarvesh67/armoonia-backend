const user = require('./user');
const nft = require('./nft');
const collection = require('./collection');
const userLikes = require('./user_likes');
const userFollows = require('./user_follows');

const db = {
	user: user,
	nft: nft,
	collection: collection,
	userLikes: userLikes,
	userFollows: userFollows
};

Object.freeze(db);

module.exports = db;
