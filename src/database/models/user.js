const db = require('../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'users',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		name: {
			type: DataTypes.TEXT
		},
		address: {
			type: DataTypes.TEXT,
			unique: true
		},
		email: {
			type: DataTypes.TEXT,
			unique: true
		},
		website: {
			type: DataTypes.TEXT
		},
		twitter: {
			type: DataTypes.TEXT
		},
		about: {
			type: DataTypes.TEXT
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
