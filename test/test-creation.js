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

  it('titles the site', function (done) {
    var siteTitle = 'this is the site title';

    helpers.mockPrompt(this.app, {
      'siteTitle': siteTitle
    });

    this.app.run({}, function () {
      assert.fileContent('src/data/site.yml', new RegExp('^title: ' + siteTitle + '$', 'm'));

      done();
    });
  });

  // TODO: Break this into multiple tests under a describe.
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
      assert.fileContent([
        ['src/data/site.yml', new RegExp('^googleAnalyticsTrackingID: ' + gaCode + '$', 'm')],
        ['src/templates/layouts/site.hbs', /^\s*\{\{> google-analytics \}\}\s*$/m]
      ]);

      done();
    });
  });

  // TODO: Break this into multiple tests under a describe.
  it('can optionally deploy to S3', function (done) {
    var
      s3Bucket = 'bucket',
      s3Region = 'region',
      s3AccessKeyId = 'accesskeyid',
      s3AccessKeySecret = 'accesskeysecret';
    helpers.mockPrompt(this.app, {
      'useS3': true,
      's3Bucket': s3Bucket,
      's3Region': s3Region,
      's3AccessKeyId': s3AccessKeyId,
      's3AccessKeySecret': s3AccessKeySecret
    });

    var expectedFiles = baseFiles.concat([
      'credentials.json'
    ]);

    this.app.run({}, function () {
      helpers.assertFile(expectedFiles);

      assert.fileContent('Gruntfile.js', /^\s*compress: \{\s*$/m);
      assert.fileContent('Gruntfile.js', /^\s*aws_s3: \{\s*$/m);
      assert.fileContent('Gruntfile.js', /^\s*grunt\.registerTask\('deploy',.*$/m);

      var credentials = this.app.dest.readJSON('credentials.json');
      var pkg = this.app.dest.readJSON('package.json');

      assert.textEqual(credentials.aws.bucket, s3Bucket);
      assert.textEqual(credentials.aws.region, s3Region);
      assert.textEqual(credentials.aws.key, s3AccessKeyId);
      assert.textEqual(credentials.aws.secret, s3AccessKeySecret);
      assert.ok(pkg.dependencies['grunt-contrib-compress']);
      assert.ok(pkg.dependencies['grunt-aws-s3']);

      done();
    }.bind(this));
  });
});
