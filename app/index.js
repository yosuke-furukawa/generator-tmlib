'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var ExpressioGenerator = module.exports = function ExpressioGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(ExpressioGenerator, yeoman.generators.Base);

ExpressioGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome = "This is a generator for Express & Socket.io!!";

  console.log(welcome);

  var prompts = [
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
      message: 'You can write description about your app.',
      default: '',
      warning: ''
    },
  ];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.appname = props.appname;
    this.version = props.version;
    this.description = props.description;
    this.githubUrl = "http://github.com";
    cb();
  }.bind(this));
};

ExpressioGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/templates');

  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
};

ExpressioGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
