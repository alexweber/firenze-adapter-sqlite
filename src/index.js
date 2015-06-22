import knex from 'knex';
import _ from 'lodash';
import P from 'firenze/lib/Promise';

import Adapter from 'firenze/lib/Adapter';

// ## Install
//
// ```
// $ npm install --save firenze-adapter-sqlite
// ```
//
// ## Usage
//
// You aren't expected to deal with the Adapter directly. Just pass the adapter to Database config when you create an instance.
//
// ```js
// var f = require('firenze');
// var Database = f.Database;
// var SqliteAdapter = require('firenze-adapter-sqlite');
//
// var db = new Database({
//   adapter: SqliteAdapter,
//   filename: 'my_database.db'
// });
// ```
//
// ## Schema
//
// When defining a Model's schema, you need to pass option for each column's `type`.
//
// Here are the supported types from this adapter:
//
// * increments
// * integer
// * bigInteger
// * text
// * string
// * float
// * decimal
// * boolean
// * date
// * dateTime
// * uuid
//
// Example:
//
// ```js
// var Post = db.createModelClass({
//   schema: {
//     id: {
//       type: 'increments'
//     }
//   }
// });
// ```
//
export default class Sqlite extends Adapter {
  constructor(options) {
    super(options);

    this.options = options;

    let config = {
      client: 'sqlite3',
      connection: {
        filename: this.options.filename
      }
    };

    this.knex = knex(config);
  }

  getConnection() {
    return this.knex;
  }

  closeConnection(cb = null) {
    if (!cb) {
      cb = function () { };
    }
    return this.getConnection().destroy(cb);
  }

  create(q, obj) {
    return q.insert(obj);
  }
}
