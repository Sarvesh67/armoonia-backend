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
	// Add a 'like nft' between user and nft
	const { id } = req.user;
	const contract_token = req.body.contract_token;

	if (!contract_token) {
		return res.status(400).json({
			success: false,
			msg: 'No contract token found :('
		});
	}

	const [nft, ] = await db.public.nft.findOrCreate({
		where: { contract_token: contract_token }
	});

	const nftsaved = await nft.update({
		liked_user_id: id
	});

	return res.status(200).json({
		success: true,
		msg: 'NFT liked successfully!',
		nft: nftsaved
	});
};

const favourite_nft = async (req, res) => {
	// Add a 'like nft' between user and nft
	const { id } = req.user;
	const contract_token = req.body.contract_token;

	if (!contract_token) {
		return res.status(400).json({
			success: false,
			msg: 'No contract token found :('
		});
	}

	const [nft, ] = await db.public.nft.findOrCreate({
		where: { contract_token: contract_token }
	});

	const nftsaved = await nft.update({
		favourited_user_id: id
	});

	return res.status(200).json({
		success: true,
		msg: 'NFT favourited successfully!',
		nft: nftsaved
	});
};

const profile = async (req, res) => {
	try {
		const { id } = req.user;
		const includeMetadata = {
			include: [
				{
					model: db.public.nft,
					as: 'liked_nft'
				},
				{
					model: db.public.nft,
					as: 'favourited_nft'
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

module.exports = { TestController, getNonce, login, update, read, like_nft, favourite_nft, profile };
