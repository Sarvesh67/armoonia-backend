const config = require('../services/config.service');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

async function genjwt(id) {
	const user = await db.public.user.findByPk(id);
	const auth_payload = {
		id: user.id,
		address: user.address
	};

	// Create jwt here
	const token = jwt.sign(auth_payload, config.app.JWTKEY, {
		expiresIn: '1h'
	});
	return token;
}

if (require.main == module) {
	genjwt(1).then(token => {
		console.log(token);
	});
}