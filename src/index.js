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

  // ## Finders
  //
  // Examples below assumes you have an instance of Collection already:
  //
  // ```js
  // var posts = new Posts();
  // ```
  //
  // ### first
  //
  // Gives you the first matched result:
  //
  // ```js
  // posts.find('first', {
  //   conditions: {
  //     id: 1
  //   }
  // }).then(function (post) {
  //   // post is now an instance of Post model
  //   var title = post.get('title');
  // });
  // ```
  //
  // ### all
  //
  // Gives you all matched results:
  //
  // ```js
  // posts.find('all', {
  //   conditions: {
  //     published: true
  //   }
  // }).then(function (models) {
  //   models.forEach(function (model) {
  //     var title = model.get('title');
  //   });
  // });
  // ```
  // ### list
  //
  // Gives you a list of key/value paired object of matched results:
  //
  // ```js
  // posts.find('list', {
  //   conditions: {},
  //   fields: [
  //     'id',
  //     'title'
  //   ]
  // }).then(function (list) {
  //   // list is now:
  //   //
  //   // {
  //   //   1: 'Hello World',
  //   //   2: 'About'
  //   // }
  // });
  // ```
  //
  // ### count
  //
  // Gives you the total count of matched results:
  //
  // ```js
  // posts.find('count').then(function (count) {
  //   // count is an integer here
  // });
  // ```
  //
}
