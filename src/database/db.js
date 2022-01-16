const conn = require('./conn');
const models = require('./models/model');

var db = Object.assign({ public: models }, conn);

// Define relations here
db.public.user.belongsToMany(db.public.nft, { through: db.public.userLikes, foreignKey: 'user_id', onDelete: 'CASCADE'});
db.public.nft.belongsToMany(db.public.collection, { through: db.public.userLikes, foreignKey: 'nft_id', onDelete: 'CASCADE'});

db.public.user.belongsToMany(db.public.collection, { through: db.public.userFollows, foreignKey: 'user_id', onDelete: 'CASCADE'});
db.public.collection.belongsToMany(db.public.user, { through: db.public.userFollows, foreignKey: 'collection_id', onDelete: 'CASCADE'});

module.exports = db;
