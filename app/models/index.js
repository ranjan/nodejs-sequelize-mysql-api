const env = process.env.NODE_ENV || 'development';
const config = require("../config/config.js")[env];
const pool = require("../config/config.js")['pool'];
const { Sequelize, DataTypes, Op } = require("sequelize");
console.log(config)
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: false,

    poll: {
      max: pool.max,
      min: pool.min,
      acquire: pool.acquire,
      idle: pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

db.books = require("./book.model.js")(sequelize, Sequelize, DataTypes);
db.user = require("./user.model.js")(sequelize, Sequelize, DataTypes);

module.exports = db;
