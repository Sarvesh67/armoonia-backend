const db = require('../database/db');
// const { Op } = require('sequelize');
const { ethers } = require('ethers'); 
const jwt = require('jsonwebtoken');
const config = require('../services/config.service');
const crypto = require('crypto');
const { v4 : uuidv4 } = require('uuid');
const console = require('console');
const nonces = {};

const TestController = (req, res) => {
	return res.status(200).json('Test Controller succesful!');
};

const getNonce = async (req, res) => {
	// Get nonce - Return a hash and its corresponding id.
	try {
		const nonce = crypto.randomBytes(16).toString('hex');
		const nonce_id = uuidv4();
		nonces[nonce_id] = nonce;
		console.log(nonces);
		return res.status(200).json({
			success: true,
			nonce: nonce,
			nonce_id: nonce_id
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const login = async (req, res) => {
	// Login - Return jwt token and add/query user. Frontend sends signature.
	try {
		const signature = req.headers.signature;
		const nonce_id = req.headers['nonce-id'];
		if(!signature || !nonce_id) {
			return res.status(400).json({
				success: false,
				msg: 'Bad request. Signature or nonce id missing :('
			});
		}
		const message = nonces[nonce_id];
		console.log(message);
		delete nonces[nonce_id]; // Thus, the nonce id can be redeemed only once.
		const sig = ethers.utils.splitSignature(signature);
		const address = ethers.utils.verifyMessage(message, sig);
		console.log('address: ', address);
		const [user, created] = await db.public.user.findOrCreate({
			where: { address: address },
		});

		const auth_payload = {
			id: user.id,
			address: user.address
		};

		// Create jwt here
		const token = jwt.sign(auth_payload, config.app.JWTKEY, {
			expiresIn: '1h'
		});

		return res.status(200).json({
			success: true,
			created: created,
			msg: created ? 'New user created!' : 'User successfully logged in!',
			user: user,
			token: token
		});
	} catch(e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const update = async (req, res) => {
	// Update - Return 200 on successful update.
	try {
		const { id } = req.user;
		const update = req.body;
		if (!update) {
			return res.status(400).json({
				success: false,
				error: 'Update body missing.',
			});
		}
		const [, [updateduser]] = await db.public.user.update(update, {
			where: { id: id },
			returning: true,
		});
		return res.status(200).json({
			success: true,
			user: updateduser
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const read = async (req, res) => {
	// Read - Query user details from wallet address.
	try {
		const address = req.params.address;
		const user = await db.public.user.findOne({
			where: { address: address }
		});
		if(!user) {
			return res.status(400).json({
				success: false,
				msg: 'User not present :('
			});
		}
		return res.status(200).json({
			success: true,
			user: user
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const like_nft = async (req, res) => {
	try {
		// Add a 'like nft' between user and nft
		const { id } = req.user;
		const {contract, token} = req.body;

		if (!(contract && token)) {
			return res.status(400).json({
				success: false,
				msg: 'No contract token found :('
			});
		}

		const [nft, ] = await db.public.nft.findOrCreate({
			where: { 
				contract: contract,
				token: token
			}
		});

		await db.public.userLikes.create({
			user_id: id,
			nft_id: nft.id
		});

		return res.status(200).json({
			success: true,
			msg: 'NFT liked successfully!',
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const follow_collection = async (req, res) => {
	try {
		// Add a 'follow collection' between user and collections.
		const { id } = req.user;
		const { contract } = req.body;

		if (!contract) {
			return res.status(400).json({
				success: false,
				msg: 'No contract id found :('
			});
		}

		const [collection, ] = await db.public.collection.findOrCreate({
			where: { 
				contract: contract,
			}
		});

		const collection_saved = await db.public.collection.create({
			user_id: id,
			collection_id: collection.id
		});

		return res.status(200).json({
			success: true,
			msg: 'NFT liked successfully!',
			nft: collection_saved
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const user_likes_boolean = async (req, res) => {
	try {
		const { contract, token } = req.body;
		const { id } = req.user;
		const nft = await db.public.nft.findOne({
			where: {
				contract: contract,
				token: token
			}
		});

		const nftliked = await db.public.userLikes.findOne({
			where: {
				user_id: id,
				nft_id: nft.id
			}
		});
		return res.status(200).json({
			success: true,
			likes: nftliked ? true : false
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const user_follows_boolean = async (req, res) => {
	try {
		const { contract } = req.body;
		const { id } = req.user;
		const collection = await db.public.collection.findOne({
			where: {
				contract: contract
			}
		});

		const collectionfollows = await db.public.userFollows.findOne({
			where: {
				user_id: id,
				collection_id: collection.id
			}
		});
		return res.status(200).json({
			success: true,
			follows: collectionfollows ? true : false
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const collection_array_follows = async (req, res) => {
	try {
		const collections = req.body;
		const collections_saved = await db.public.collection.bulkCreate(collections, {
			updateOnDuplicate: true
		});
		const collectionarr = [];
		collections_saved.forEach(collection => {
			collectionarr.push(db.public.userFollows.findAll({
				where: {
					collection_id: collection.id
				}
			}).then(follows => {
				return follows.length;
			}));
		});
		const follow_arr = await Promise.all(collectionarr);

		return res.status(200).json({
			success: true,
			follow_arr: follow_arr
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const nft_array_likes = async (req, res) => {
	try {
		const nfts = req.body;
		const nfts_saved = await db.public.collection.bulkCreate(nfts, {
			updateOnDuplicate: true
		});
		const nftarr = [];
		nfts_saved.forEach(nft => {
			nftarr.push(db.public.userLikes.findAll({
				where: {
					nft_id: nft.id
				}
			}).then(likes => {
				return likes.length;
			}));
		});
		const likes_arr = await Promise.all(nftarr);

		return res.status(200).json({
			success: true,
			likes_arr: likes_arr
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const get_nft = async (req, res) => {
	try {
		const { contract, token } = req.body;
		
		if (!(contract && token)) {
			return res.status(400).json({
				success: false,
				msg: 'No contract token found :('
			});
		}

		const [nft, ] = await db.public.nft.findOrCreate({
			where: { 
				contract: contract,
				token: token
			},
			include: [
				{
					model: db.public.user
				}
			]
		}); 

		const nft_saved = {
			contract: nft.contract,
			token: nft.token,
			likes: nft.users.length()
		};

		return res.status(200).json({
			success: true,
			nft: nft_saved
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const get_collection = async (req, res) => {
	try {
		const { contract } = req.body;
		
		if (!contract) {
			return res.status(400).json({
				success: false,
				msg: 'No contract found :('
			});
		}

		const [collection, ] = await db.public.collection.findOrCreate({
			where: { 
				contract: contract			},
			include: [
				{
					model: db.public.user
				}
			]
		}); 

		const collection_saved = {
			contract: collection.contract,
			follows: collection.users.length()
		};

		return res.status(200).json({
			success: true,
			collection: collection_saved
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const profile = async (req, res) => {
	try {
		const { id } = req.user;
		const includeMetadata = {
			include: [
				{
					model: db.public.nft
				},
				{
					model: db.public.collection
				}
			]
		};
		const user = await db.public.user.findByPk(id, includeMetadata);
		if(!user) {
			return res.status(400).json({
				success: false,
				msg: 'User not present :('
			});
		}
		return res.status(200).json({
			success: true,
			user: user
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

module.exports = { TestController, getNonce, login, update, read, like_nft, profile, follow_collection, user_likes_boolean, user_follows_boolean, collection_array_follows, nft_array_likes, get_nft, get_collection };
