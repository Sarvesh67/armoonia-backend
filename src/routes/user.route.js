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
router.post('/favouritenft', validationMiddleware.jwtvalidation, userControllers.favourite_nft);
router.get('/profile', validationMiddleware.jwtvalidation, userControllers.profile);

module.exports = router;
