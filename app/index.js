'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var GitHubApi = require('github');
var template_setting = require('./template_setting');
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
    this.spawnCommand('bower', ['cache-clean'])
      .on('exit', function(err) {
        if (err) console.log(err);
        var skip_install = options['skip-install'];
        var grunt_bower_task = function() {
          if (!skip_install) {
            this.spawnCommand('grunt', ['bower:install'])
            .on('exit', function (err) {
              if (err) console.log(err);
            });
          }
        }.bind(this);
        this.installDependencies({ skipInstall: skip_install, callback: grunt_bower_task});
      }.bind(this));
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(TmlibGenerator, yeoman.generators.Base);

TmlibGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome = "This is a generator for tmlib. tmlib can make javascript easy!";

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
    {
      name: 'template_engine',
      message: 'What is your favorite template engine? [jade, ejs, swig, hogan]',
      default: 'jade',
      warning: ''
    },
    {
      name: 'use_heroku',
      message: 'Use Heroku? [Y/n]',
      default: 'n',
      warning: ''
    },
  ];

  this.prompt(prompts, function (props) {
    this.appname = props.appname;
    this.version = props.version;
    this.description = props.description;
    this.yourname = props.yourname;
    this.template_engine = template_setting(props.template_engine);
    this.use_heroku = props.use_heroku == "Y" ? true : false;
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
  this.copy('_bowerrc', '.bowerrc');
  this.directory('public', 'public');
  this.mkdir('public/vendor');
  this.mkdir('views');
  var viewPath = 'views/*.'+this.template_engine.extension;
  var viewFiles = this.expandFiles(viewPath, {dot: true, cwd: this.sourceRoot()});
  viewFiles.forEach(function(viewFile) {
    this.copy(viewFile, viewFile);
  }.bind(this));
  this.mkdir('lib');
  this.template('lib/socket.io-server.js', 'lib/socket.io-server.js');
  this.directory('routes', 'routes');
  this.template('app.js', 'app.js');
  this.copy('Gruntfile.js', 'Gruntfile.js');
  if (this.use_heroku) this.copy('Procfile', 'Procfile');
};

TmlibGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.copy('gitignore', '.gitignore');
};
