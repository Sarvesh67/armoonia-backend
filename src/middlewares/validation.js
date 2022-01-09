const jwt = require('jsonwebtoken');
const config = require('../services/config.service');

const jwtvalidation = (req, res, next) => {
	const token = req.headers['x-access-code'];
	if (!token) {
		return res.status(401).json({
			success: false,
			error: 'Access denied. No token found :('
		});
	}   
	try {
		const auth_data = jwt.verify(token, config.app.JWTKEY);
		req.user = auth_data;
		console.log(req.user);
		return next();
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			error: 'Unauthorised user :(',
			stack: err
		});
	}
};

module.exports = { jwtvalidation };