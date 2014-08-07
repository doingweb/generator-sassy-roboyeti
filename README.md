# generator-sassy-roboyeti [![Build Status](https://secure.travis-ci.org/doingweb/generator-sassy-roboyeti.png?branch=master)](https://travis-ci.org/doingweb/generator-sassy-roboyeti)

> Scaffolds out a basic static website using [Assemble](http://assemble.io) and [Foundation](http://foundation.zurb.com).

This generator has opinions about your primary tools and workflow, but not the content of your site (except that HTML5 Boilerplate with Foundation's responsive Top Bar is probably a good place to start). Its goal is to let you take advantage of the modern web's best practices, while keeping your development and deployment workflows down to one step.

## Features

### Foundation from Sass

Your `site.scss` file starts out like this:

```css
@import
  "foundation/scss/foundation/functions",
  "foundation-settings",
  "foundation/scss/normalize",
  "foundation-components",

  "styles";
```

Your Foundation variable overrides go in `_foundation-settings.scss`, allowing you to customize almost any aspect of Foundation's behavior while still leaving it updatable.

`_foundation-components.scss` contains imports for the various components of Foundation, most of which are commented out until you need them.

Your own styles can go in `_styles.scss`. Or, you know, wherever you want. [Just a suggestion.](http://codepen.io/chriscoyier/blog/codepens-css#organization-files)

### Connect, watch, live reload

Start up a static web server, rebuild when files change, and automatically refresh your browser, with just one command. Builds for development are minimal, and don't do things like concatenation, minification, etc.

### Minify everything!

CSS, javascript, images, even HTML is minified.

### Custom Modernizr without customizing Modernizr

Just use Modernizr; [`grunt-modernizr`](https://github.com/Modernizr/grunt-modernizr) takes care of putting together a custom build based on what you use.

### Cache busting

Your CSS and javascript are revved and references rewritten, so those pesky caches don't try to tell *you* what's what.

### CDNification

References to javascript available from CDNs are rewritten using [`grunt-google-cdn`](https://github.com/btford/grunt-google-cdn).

### Credentials

Your secrets stay safe, out of your Git repo, in a `credentials.json` file.

## Getting Started

This is a [Yeoman](http://yeoman.io) generator. To get going with Yeoman, see [their Getting Started page](http://yeoman.io/learning/).

### Installing

```sh
$ npm install -g generator-sassy-roboyeti
```

### Generating

To use this generator, create a directory for your project, `cd` into it, and run:

```sh
$ yo sassy-roboyeti
```

#### Prompts

##### Package name

This is just the name that's used by `package.json` and `bower.json` for this project.

##### Site title

The title for the site. Fills in the `site.title` variable used by Assemble in `site.yml`. Used in the `<title>` tag in the site template (`site.hbs`) and the Top Bar's `title-area` (`navigation.hbs`) by default.

##### Google Analytics

Adds the `google-analytics.hbs` partial, references it in `site.hbs`, and adds the `googleAnalyticsTrackingID` variable in `site.yml`.

##### S3 deployment

You can deploy to S3 by supplying the bucket's name, region, and access key details. See [Amazon's instructions for hosting static websites in S3](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).

## Tasks

### Developing your site

```sh
$ grunt server
```

Performs a minimal build, starts up the Connect server, and starts watching files for changes. When changes happen, that part is rebuilt and the page is reloaded in your browser.

### Deploying to S3

```sh
$ grunt deploy
```

Performs a production build, gzips HTML, CSS, and javascript, then uploads all site files to the designated S3 bucket.

### Just building

You can also just perform a build, if you'd like.

#### Minimal build

```sh
$ grunt build:server
```

Builds the site with Assemble, keeping unconcatenated, unminified assets and their references. Useful for debugging and taking up space and bandwidth.

#### Production build

```sh
$ grunt build:dist
```

Performs a complete build with all the concatenation, minification, CDNification, and revving at our disposal. The only thing it doesn't do is gzip.

## Why "Sassy Roboyeti"?

The design workflow is focused around Sass, the static site generator is Assemble, which is [an activity I associate with robots](http://www.wired.com/2013/10/watch-incredible-self-assembling-robots-out-of-mit/), and [the yeti is Foundation's mascot](http://www.jamesstone.co/blog/zurbians-and-yetis-a-brief-history/).

## License

MIT
