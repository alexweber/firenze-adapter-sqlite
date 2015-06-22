var Sqlite = require('../index');

module.exports = {
  adapter: Sqlite,
  database: process.env.FIRENZE_DB || 'firenze'
};
