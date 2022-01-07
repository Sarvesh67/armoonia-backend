const db = require('../database/db');

async function public_force() {
	// Add code for seeding db here
	await db.public.user.create({
		name: 'Sarvesh',
		address: '0xB92021780c1aaD936038dF171196580228B3d385',
		email: 'S@gmail.com'
	});

	await db.public.nft.create({
		contract_token: 'UniqueContractTokenHere'
	});

	return;
}

async function main(testing) {
	/* var schemas = [
          // SchemaName, force_param, force_function(to be executed in case, the force param is true)
          ['public', true, public_force],
          // ['atc', true, atc_force],
          // ['atc', true, atc_force]
      ], force_ret = 0; */
	if (!testing) console.log('Creating the tables');

	//
	await db.conn.sync({ force: testing });

	if (testing) {
		try {
			await public_force();
		} catch (e) {
			console.log(e);
		}
	} else {
		console.log('\n\n\n\n\n');
	}
	return;
}

async function closeConn() {
	await db.conn.close();
	return;
}

if (require.main == module) {
	// For testing keep param true, will force sync all tables.
	main(true)
		.then(() => {
			console.log('Tables succesfully created!');
			closeConn()
				.then(() => console.log('Connection terminated succesfully!'))
				.catch((e) => {
					throw e;
				});
		})
		.catch((e) => {
			// console.log(e);
			throw e;
		});
	// eslint-disable-next-line no-undef
	process.exit[0];
}