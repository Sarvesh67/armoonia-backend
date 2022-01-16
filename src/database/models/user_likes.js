const db = require('../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'userLikes',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.BIGINT
		},
		nft_id: {
			type: DataTypes.BIGINT
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
