/* global describe, before, after, it */

var should = require('should'); //eslint-disable-line
var lib = require('firenze');
var config = require('../config');

describe('Adapter', function () {
  before(function () {
    this.db = new lib.Database(config);
    this.Post = require('../models/Post')(this.db);
    this.Author = require('../models/Author')(this.db);
  });

  after(function (done) {
    this.db.close(done);
  });

  it('should load fixtures for a single Model', function (done) {
    var post = new this.Post();
    var data = require('../fixtures/posts');
    this.db.getAdapter().loadFixture(post, data).then(function () {
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should load fixtures for multiple models', function (done) {
    this.db.getAdapter().loadAllFixtures([
      {
        model: new this.Post(),
        rows: require('../fixtures/posts')
      },
      {
        model: new this.Author(),
        rows: require('../fixtures/authors')
      }
    ]).then(function () {
      done();
    }).catch(function (error) {
      throw error;
    });
  });
});
