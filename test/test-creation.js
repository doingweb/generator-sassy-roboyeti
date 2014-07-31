/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('sassy-roboyeti generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('sassy-roboyeti:app', [
        '../../app'
      ]);
      this.app.options['skip-install'] = true;

      done();
    }.bind(this));
  });

  var baseFiles = [
    '.gitignore',
    'package.json',
    'bower.json',
    'Gruntfile.js',
    'src/content/index.hbs',
    'src/content/images',
    'src/css/_foundation-components.scss',
    'src/css/_foundation-settings.scss',
    'src/css/_styles.scss',
    'src/css/site.scss',
    'src/data/site.yml',
    'src/js/init-foundation.js',
    'src/plugins',
    'src/templates/helpers',
    'src/templates/layouts/site.hbs',
    'src/templates/partials/navigation.hbs',
    'src/templates/partials/browse-happy.hbs',
    'src/templates/partials/scripts.hbs'
  ];

  it('creates the base files', function (done) {
    helpers.mockPrompt(this.app, {
      'useGoogleAnalytics': false
    });

    var expected = baseFiles;

    this.app.run({}, function () {
      helpers.assertFile(expected);

      done();
    });
  });

  // TODO: What other options?

  it('prompts for the site title', function (done) {
    var siteTitle = 'this is the site title';

    helpers.mockPrompt(this.app, {
      'siteTitle': siteTitle
    });

    this.app.run({}, function () {
      assert.fileContent('src/data/site.yml', new RegExp('^title: ' + siteTitle + '$', 'm'));

      done();
    });
  });

  it('can optionally use Google Analytics', function (done) {
    var gaCode = 'UA-12345678-1';

    helpers.mockPrompt(this.app, {
      'useGoogleAnalytics': true,
      'googleAnalyticsCode': gaCode
    });

    var expectedFiles = baseFiles.concat([
      'src/templates/partials/google-analytics.hbs'
    ]);

    this.app.run({}, function () {
      helpers.assertFile(expectedFiles);
      assert.fileContent('src/data/site.yml', new RegExp('^googleAnalyticsTrackingID: ' + gaCode + '$', 'm'));
      assert.fileContent('src/templates/layouts/site.hbs', /\{\{> google-analytics \}\}/);

      done();
    });
  });
});
