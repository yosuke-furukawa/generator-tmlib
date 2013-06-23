/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('tmlib generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('tmlib:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      '.jshintrc',
      '.editorconfig',
      '.gitignore',
      'app.js',
      'Gruntfile.js',
      'package.json',
      'bower.json',
      'views/index.swig',
      'public/javascripts/main.js',
      'lib/socket.io-server.js',
      'routes/index.js',
      'routes/user.js',
      'public/stylesheets/style.css',
    ];

    helpers.mockPrompt(this.app, {
      'appname': 'abc',
      'version': '0.0.1',
      'yourname': 'yosuke-furukawa',
      'description': 'test',
      'template_engine': 'swig'
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
