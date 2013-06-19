'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var GitHubApi = require('github');
var github = new GitHubApi({
  version: '3.0.0'
});

var githubUserInfo = function (name, cb) {
  github.user.getFrom({
    user: name
  }, function (err, res) {
    if (err) {
      throw err;
    }
    cb(JSON.parse(JSON.stringify(res)));
  });
};

var TmlibGenerator = module.exports = function TmlibGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(TmlibGenerator, yeoman.generators.Base);

TmlibGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome = "This is a generator for tmlib. tmlib can make games easily!";

  console.log(welcome);

  var prompts = [
    {
      name: 'yourname',
      message: 'What is your github name?',
      default: 'someuser',
      warning: ''
    },
    {
      name: 'appname',
      message: 'What is your applicaiton name?',
      default: 'My Apps',
      warning: ''
    },
    {
      name: 'version',
      message: 'What version?',
      default: '0.0.0',
      warning: ''
    },
    {
      name: 'description',
      message: 'Description about your app',
      default: '',
      warning: ''
    },
  ];

  this.prompt(prompts, function (props) {
    this.appname = props.appname;
    this.version = props.version;
    this.description = props.description;
    this.yourname = props.yourname;
    cb();
  }.bind(this));
};

TmlibGenerator.prototype.userInfo = function userInfo() {
  var done = this.async();

  githubUserInfo(this.yourname, function (res) {
    this.yourname = res.name;
    this.email = res.email;
    this.githubUrl = res.html_url;
    done();
  }.bind(this));
};

TmlibGenerator.prototype.app = function app() {
  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.directory('public', 'public');
  this.mkdir('public/vendor');
  this.mkdir('public/javascripts');
  this.directory('views', 'views');
  this.directory('lib', 'lib');
  this.directory('routes', 'routes');
  this.copy('app.js', 'app.js');
  this.copy('Gruntfile.js', 'Gruntfile.js');
};

TmlibGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.copy('gitignore', '.gitignore');
};
