const db = require('../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'nfts',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		contract: {
			type: DataTypes.TEXT,
			unique: 'contract_token'
		},
		token: {
			type: DataTypes.TEXT,
			unique: 'contract_token'
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
