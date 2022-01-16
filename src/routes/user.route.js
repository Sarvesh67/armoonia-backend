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
router.get('/likesnft/boolean', validationMiddleware.jwtvalidation, userControllers.user_likes_boolean);
router.get('/followscollection/boolean', validationMiddleware.jwtvalidation, userControllers.user_follows_boolean);
router.get('/nfts/likes', userControllers.nft_array_likes);
router.get('/collections/follows', userControllers.collection_array_follows);
router.get('/nft', userControllers.get_nft);
router.get('/collection', userControllers.get_collection);
router.get('/profile', validationMiddleware.jwtvalidation, userControllers.profile);

module.exports = router;
