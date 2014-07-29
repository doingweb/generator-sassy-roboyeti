/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('sassy-roboyeti generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('sassy-roboyeti:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      '.gitignore',
      'package.json',
      'bower.json',
      'Gruntfile.js',
      'credentials.json',
      'src/content/index.hbs',
      'src/content/images',
      'src/css/site.scss',
      'src/css/_foundation-components.scss',
      'src/css/_foundation-settings.scss',
      'src/css/_styles.scss',
      'src/data/site.yml',
      'src/js/init-foundation.js',
      'src/plugins',
      'src/templates/helpers',
      'src/templates/layouts/site.hbs',
      'src/templates/partials/navigation.hbs',
      'src/templates/partials/browse-happy.hbs',
      'src/templates/partials/scripts.hbs',
      'src/templates/partials/google-analytics.hbs'
    ];

    helpers.mockPrompt(this.app, {
      'someOption': true
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
