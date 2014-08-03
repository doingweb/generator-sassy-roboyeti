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
      name: 'useGoogleAnalytics',
      message: 'Would you like to use Google Analytics?',
      type: 'confirm',
      default: true
    }, {
      name: 'googleAnalyticsCode',
      message: 'What is your Google Analytics Tracking ID?',
      default: 'UA-XXXXXXXX-X',
      when: usingGoogleAnalytics
    }, {
      name: 'useS3',
      message: 'Will you be deploying to Amazon S3?',
      type: 'confirm',
      default: true
    }, {
      name: 's3Bucket',
      message: 'What is the S3 bucket\'s name?',
      when: usingS3
    }, {
      name: 's3Region',
      message: 'In which region is the bucket?',
      type: 'list',
      choices: [
        'us-east-1',
        'us-west-2',
        'us-west-1',
        'eu-west-1',
        'ap-southeast-1',
        'ap-southeast-2',
        'ap-northeast-1',
        'sa-east-1'
      ],
      default: 'us-east-1',
      when: usingS3
    }, {
      name: 's3AccessKeyId',
      message: 'Which access key ID should we use?',
      when: usingS3
    }, {
      name: 's3AccessKeySecret',
      message: 'And what is that access key\'s secret?',
      when: usingS3
    }];

    this.prompt(prompts, function (props) {
      this.siteTitle = props.siteTitle;

      this.useGoogleAnalytics = props.useGoogleAnalytics;
      this.googleAnalyticsCode = props.googleAnalyticsCode;

      this.useS3 = props.useS3;
      this.s3Bucket = props.s3Bucket;
      this.s3Region = props.s3Region;
      this.s3AccessKeyId = props.s3AccessKeyId;
      this.s3AccessKeySecret = props.s3AccessKeySecret;

      done();
    }.bind(this));

    function usingGoogleAnalytics (answers) {
      return answers.useGoogleAnalytics;
    }

    function usingS3 (answers) {
      return answers.useS3;
    }
  },

  configuring: function () {
    this.copy('gitignore', '.gitignore');
  },

  writing: function () {
    this.template('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');

    this.template('_Gruntfile.js', 'Gruntfile.js');

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
    this.template('src/templates/layouts/site.hbs');
    this.copy('src/templates/partials/navigation.hbs');
    this.copy('src/templates/partials/browse-happy.hbs');
    this.copy('src/templates/partials/scripts.hbs');

    if (this.useGoogleAnalytics) {
      this.copy('src/templates/partials/google-analytics.hbs');
    }

    if (this.useS3) {
      this.template('credentials.json');
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  }
});

module.exports = SassyRoboyetiGenerator;
