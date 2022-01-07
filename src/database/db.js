const conn = require('./conn');
const models = require('./models/model');

var db = Object.assign({ public: models }, conn);

// Define relations here
db.public.user.hasMany(db.public.nft, { foreignKey: 'liked_user_id', onDelete: 'CASCADE', as: 'liked_nft'});

db.public.user.hasMany(db.public.nft, { foreignKey: 'favourited_user_id', onDelete: 'CASCADE', as: 'favourited_nft'});

module.exports = db;
