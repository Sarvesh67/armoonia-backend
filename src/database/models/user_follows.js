const db = require('../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'userFollows',
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
		collection_id: {
			type: DataTypes.BIGINT
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
