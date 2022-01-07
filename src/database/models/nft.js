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
		contract_token: {
			type: DataTypes.TEXT,
			unique: true
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
