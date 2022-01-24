const express = require('express');
const validationMiddleware = require('../middlewares/validation');
const userControllers = require('../controllers/user.controller');

const router = express.Router();

router.get('/', (req, res) => {
	return res.status(200).json('Welcome to the user routes!');
});

router.get('/getnonce', userControllers.getNonce);
router.post('/login', userControllers.login);
router.get('/read/:address', userControllers.read);
router.put('/update', validationMiddleware.jwtvalidation, userControllers.update);
router.post('/likenft', validationMiddleware.jwtvalidation, userControllers.like_nft);
router.post('/followcollection', validationMiddleware.jwtvalidation, userControllers.follow_collection);
router.post('/likesnft/boolean/:address', validationMiddleware.jwtvalidation, userControllers.user_likes_boolean);
router.post('/followscollection/boolean/:address', validationMiddleware.jwtvalidation, userControllers.user_follows_boolean);
router.post('/nfts/likes', userControllers.nft_array_likes);
router.post('/collections/follows', userControllers.collection_array_follows);
router.post('/nft', userControllers.get_nft);
router.post('/collection', userControllers.get_collection);
router.get('/profile', validationMiddleware.jwtvalidation, userControllers.profile);

module.exports = router;
