'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var SassyRoboyetiGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Sassy Roboyeti generator!'));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

      done();
    }.bind(this));
  },

  configuring: function () {
    this.copy('gitignore', '.gitignore');
    this.copy('credentials.json');
  },

  default: function () {
    this.copy('_Gruntfile.js', 'Gruntfile.js');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');

    this.copy('src/content/index.hbs');
    this.mkdir('src/content/images');

    this.copy('src/css/_foundation-components.scss');
    this.copy('src/css/_foundation-settings.scss');
    this.copy('src/css/_styles.scss');
    this.copy('src/css/site.scss');

    this.copy('src/data/site.yml');

    this.copy('src/js/init-foundation.js');

    this.mkdir('src/plugins');

    this.mkdir('src/templates/helpers');
    this.copy('src/templates/layouts/site.hbs');
    this.copy('src/templates/partials/navigation.hbs');
    this.copy('src/templates/partials/browse-happy.hbs');
    this.copy('src/templates/partials/scripts.hbs');
    this.copy('src/templates/partials/google-analytics.hbs');
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  }
});

module.exports = SassyRoboyetiGenerator;
