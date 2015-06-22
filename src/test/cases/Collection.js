/* global describe, before, after, it */

var _ = require('lodash');
var should = require('should'); //eslint-disable-line
var lib = require('firenze');
var config = require('../config');

describe('Collection', function () {
  before(function (done) {
    this.db = new lib.Database(config);
    this.Posts = require('../collections/Posts')(this.db);
    this.Post = require('../models/Post')(this.db);
    this.postsData = require('../fixtures/posts');

    this.db.getAdapter().loadAllFixtures([
      {
        model: new this.Post(),
        rows: this.postsData
      }
    ]).then(function () {
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  after(function (done) {
    this.db.close(done);
  });

  it('should find all results', function (done) {
    var posts = new this.Posts();
    posts.find('all').then(function (models) {
      models.should.be.instanceOf(Array);
      models.should.have.lengthOf(3);

      var firstPost = models[0];
      firstPost.should.have.property('attributes');
      firstPost.attributes.title.should.be.exactly('Hello World');

      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find all results with AND conditions', function (done) {
    var posts = new this.Posts();
    posts.find('all', {
      conditions: {
        'Post.id': 2,
        AND: {
          'Post.title': 'About'
        }
      }
    }).then(function (models) {
      models.should.be.instanceOf(Array);
      models.should.have.lengthOf(1);

      var firstPost = models[0];
      firstPost.should.have.property('attributes');
      firstPost.attributes.title.should.be.exactly('About');

      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find all results with IN conditions', function (done) {
    var posts = new this.Posts();
    posts.find('all', {
      conditions: {
        'Post.id': [
          1,
          2
        ]
      },
      order: {
        'Post.id': 'asc'
      }
    }).then(function (models) {
      models.should.be.instanceOf(Array);
      models.should.have.lengthOf(2);

      var firstPost = models[0];
      firstPost.should.have.property('attributes');
      firstPost.attributes.title.should.be.exactly('Hello World');

      var secondPost = models[1];
      secondPost.should.have.property('attributes');
      secondPost.attributes.title.should.be.exactly('About');

      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find all results with ordering', function (done) {
    var posts = new this.Posts();
    posts.find('all', {
      order: {
        title: 'asc'
      }
    }).then(function (models) {
      models.should.be.instanceOf(Array);

      var firstPost = models[0];
      firstPost.should.have.property('attributes');
      firstPost.get('title').should.be.exactly('About');

      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find all results with pagination', function (done) {
    var posts = new this.Posts();
    posts.find('all', {
      order: {
        title: 'asc'
      },
      limit: 2,
      page: 2
    }).then(function (models) {
      models.should.be.instanceOf(Array);

      var firstPost = models[0];
      firstPost.should.have.property('attributes');
      firstPost.get('title').should.be.exactly('Hello World');

      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find single result', function (done) {
    var posts = new this.Posts();
    posts.find('first', {
      conditions: {
        id: 1
      }
    }).then(function (post) {
      post.get('title').should.equal('Hello World');
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find single result with selected fields', function (done) {
    var posts = new this.Posts();
    posts.find('first', {
      fields: [
        'id',
        'title'
      ],
      conditions: {
        id: 1
      }
    }).then(function (post) {
      _.keys(post.attributes).should.eql([
        'id',
        'title'
      ]);
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find single result with aliased conditions', function (done) {
    var posts = new this.Posts();
    posts.find('first', {
      conditions: {
        'Post.id': 2
      }
    }).then(function (post) {
      post.get('title').should.equal('About');
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find list', function (done) {
    var posts = new this.Posts();
    posts.find('list').then(function (list) {
      list.should.eql({
        1: 'Hello World',
        2: 'About',
        3: 'Contact'
      });
      done();
    }).catch(function (error) {
      throw error;
    });
  });

  it('should find count of results', function (done) {
    var posts = new this.Posts();
    posts.find('count').then(function (count) {
      count.should.equal(3);
      done();
    }).catch(function(error) {
      throw error;
    });
  });

  it('should find count of results, with `greater than (>)` conditions', function (done) {
    var posts = new this.Posts();
    posts.find('count', {
      conditions: {
        'Post.views >': 15
      }
    }).then(function (count) {
      count.should.equal(2);
      done();
    }).catch(function(error) {
      throw error;
    });
  });

  it('should find count of results, with `greater than and equal (>=)` conditions', function (done) {
    var posts = new this.Posts();
    posts.find('count', {
      conditions: {
        'Post.views >=': 20
      }
    }).then(function (count) {
      count.should.equal(2);
      done();
    }).catch(function(error) {
      throw error;
    });
  });

  it('should find count of results, with `less than (<)` conditions', function (done) {
    var posts = new this.Posts();
    posts.find('count', {
      conditions: {
        'Post.views <': 15
      }
    }).then(function (count) {
      count.should.equal(1);
      done();
    }).catch(function(error) {
      throw error;
    });
  });

  it('should find count of results, with `not equal (!=)` conditions', function (done) {
    var posts = new this.Posts();
    posts.find('count', {
      conditions: {
        'Post.title !=': 'Hello World'
      }
    }).then(function (count) {
      count.should.equal(2);
      done();
    }).catch(function(error) {
      throw error;
    });
  });

  it('should find count of results, with NULL conditions', function (done) {
    var posts = new this.Posts();
    posts.find('count', {
      conditions: {
        'Post.note': null
      }
    }).then(function (count) {
      count.should.equal(1);
      done();
    }).catch(function(error) {
      throw error;
    });
  });

  it('should find count of results, with NOT NULL conditions', function (done) {
    var posts = new this.Posts();
    posts.find('count', {
      conditions: {
        'Post.note !=': null
      }
    }).then(function (count) {
      count.should.equal(2);
      done();
    }).catch(function(error) {
      throw error;
    });
  });
});
