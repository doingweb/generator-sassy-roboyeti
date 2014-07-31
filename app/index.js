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
      name: 'siteTitle',
      message: 'What would you like the title of your site to be?',
      default: 'A very new sassy-roboyeti site'
    }, {
      type: 'confirm',
      name: 'useGoogleAnalytics',
      message: 'Would you like to use Google Analytics?',
      default: true
    }, {
      name: 'googleAnalyticsCode',
      message: 'What is your Google Analytics Tracking ID?',
      default: 'UA-XXXXXXXX-X',
      when: function (answers) {
        return answers.useGoogleAnalytics;
      }
    }];

    this.prompt(prompts, function (props) {
      this.siteTitle = props.siteTitle;
      this.useGoogleAnalytics = props.useGoogleAnalytics;
      this.googleAnalyticsCode = props.googleAnalyticsCode;

      done();
    }.bind(this));
  },

  configuring: function () {
    this.copy('gitignore', '.gitignore');
  },

  default: function () {
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');

    this.copy('_Gruntfile.js', 'Gruntfile.js');

    this.copy('src/content/index.hbs');
    this.mkdir('src/content/images');

    this.copy('src/css/_foundation-components.scss');
    this.copy('src/css/_foundation-settings.scss');
    this.copy('src/css/_styles.scss');
    this.copy('src/css/site.scss');

    this.template('src/data/site.yml');

    this.copy('src/js/init-foundation.js');

    this.mkdir('src/plugins');

    this.mkdir('src/templates/helpers');
    this.copy('src/templates/layouts/site.hbs');
    this.copy('src/templates/partials/navigation.hbs');
    this.copy('src/templates/partials/browse-happy.hbs');
    this.copy('src/templates/partials/scripts.hbs');
    if (this.useGoogleAnalytics) {
      this.copy('src/templates/partials/google-analytics.hbs');
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  }
});

module.exports = SassyRoboyetiGenerator;
