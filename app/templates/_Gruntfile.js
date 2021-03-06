'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);

	grunt.initConfig({

    paths: {
      src: 'src',
      dist: 'dist',
      tmp: '.tmp',
      assets: '<%%= paths.dist %>/assets',
      content: '<%%= paths.src %>/content',
      data: '<%%= paths.src %>/data',
      templates: '<%%= paths.src %>/templates',
      bower: 'bower_components'
    },

		credentials: grunt.file.readJSON('credentials.json'),

    watch: {
      assemble: {
        files: ['<%%= paths.src %>/{content,data,templates}/**/*.{md,hbs,yml,json}'],
        tasks: ['assemble']
      },
      sass: {
        files: ['<%%= paths.src %>/css/**/*.scss'],
        tasks: ['sass:server']
      },
      js: {
        files: ['<%%= paths.src %>/js/**/*.js'],
        tasks: ['concurrent:js']
      },
      livereload: {
        options: {
          livereload: '<%%= connect.options.livereload %>'
        },
        files: [
          '<%%= paths.dist %>/**/*.html',
          '<%%= paths.assets %>/css/{,*/}*.css',
          '<%%= paths.assets %>/js/{,*/}*.js',
          '<%%= paths.assets %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      dist: {
        options: {
          open: true,
          base: [
            '<%%= paths.dist %>'
          ]
        }
      }
    },

    assemble: {
      options: {
        layoutdir: '<%%= paths.templates %>/layouts',
        layout: 'site.hbs',
        partials: '<%%= paths.templates %>/partials/*.hbs',
        assets: '<%%= paths.assets %>',
        data: '<%%= paths.data %>/*.{json,yml}',
        helpers: ['<%%= paths.templates %>/helpers/*.js'],
        marked: {
          gfm: true
        },
        plugins: ['assemble-middleware-sitemap', 'assemble-contrib-permalinks'],
        sitemap: {
          dest: '<%%= paths.dist %>/'
        },
        permalinks: {
          preset: 'pretty'
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= paths.content %>/',
          src: '**/*.{md,hbs}',
          dest: '<%%= paths.dist %>/'
        }]
      }
    },

    imagemin: {
      images: {
        files: [{
          expand: true,
          cwd: '<%%= paths.content %>/images/',
          src: '**/*.{png,jpg,gif}',
          dest: '<%%= paths.assets %>/images/'
        }]
      }
    },

		modernizr: {
      dist: {
        devFile: '<%%= paths.bower %>/modernizr/modernizr.js',
        outputFile: '<%%= paths.assets %>/js/modernizr.js'
      }
		},

    sass: {
      options: {
        includePaths: ['<%%= paths.bower %>']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          '<%%= paths.assets %>/css/site.css': '<%%= paths.src %>/css/site.scss'
        }
      },
      server: {
        options: {
          sourceMap: true
        },
        files: {
          '<%%= paths.assets %>/css/site.css': '<%%= paths.src %>/css/site.scss'
        }
      }
    },

    concurrent: {
      js: [
        'copy:bower',
        'copy:js',
        'modernizr'
      ],
      assets: [
        'copy:bower',
        'copy:js',
        'modernizr',
        'imagemin'
      ]
    },

    clean: {
      dist: '<%%= paths.dist %>/**',
      tmp: '<%%= paths.tmp %>',
      bowerAssets: '<%%= paths.dist %>/bower_components',
      js: ['<%%= paths.assets %>/js/*', '!<%%= paths.assets %>/js/modernizr.js']
    },

		useminPrepare: {
			home: '<%%= paths.dist %>/index.html',
			options: {
				dest: '<%%= paths.dist %>'
			}
		},

    filerev: {
      css: {
        src: '<%%= paths.assets %>/css/*.css'
      },
      js: {
        src: '<%%= paths.assets %>/js/*.js'
      }
    },

		usemin: {
      html: ['<%%= paths.dist %>/**/*.html']
		},

    copy: {
      bower: {
        files: [{
          expand: true,
          cwd: '<%%= paths.bower %>/',
          src: [
            'jquery/**',
            'foundation/**'
          ],
          dest: '<%%= paths.dist %>/bower_components/'
        }]
      },
      js: {
        files: [{
          expand: true,
          cwd: '<%%= paths.src %>/js/',
          src: ['*.js'],
          dest: '<%%= paths.assets %>/js/'
        }]
      }
    },

    cdnify: {
      dist: {
        html: ['<%%= paths.dist %>/**/*.html']
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: '<%%= paths.dist %>/',
          src: '**/*.html',
          dest: '<%%= paths.dist %>'
        }]
      }
    }<% if (useS3) { %>,

    compress: {
      public: {
        options: {
          mode: 'gzip'
        },
        files: [{
          expand: true,
          cwd: '<%%= paths.dist %>/',
          src: ['**/*.{html,css,js}'],
          dest: '<%%= paths.tmp %>/gzip/'
        }]
      }
    },

		aws_s3: {
			public: {
        options: {
          bucket: '<%%= credentials.aws.bucket %>',
          region: '<%%= credentials.aws.region %>',
          accessKeyId: '<%%= credentials.aws.key %>',
          secretAccessKey: '<%%= credentials.aws.secret %>'
        },
        files: [
          {
            expand: true,
            cwd: '<%%= paths.tmp %>/gzip/',
            src: ['**/*.{html,css,js}'],
            dest: './',
            params: {
              'ContentEncoding': 'gzip'
            }
          }, {
            expand: true,
            cwd: '<%%= paths.dist %>/',
            src: ['**', '!**/*.{html,css,js}'],
            dest: './'
          }
        ]
			}
		}<% } %>
	});

  grunt.loadNpmTasks('assemble');
	require('load-grunt-tasks')(grunt);

  grunt.registerTask('build:dist', [
    'clean:dist',
    'clean:tmp',
    'assemble',
    'concurrent:assets',
    'sass:dist',
    'useminPrepare',
    'concat',
    'clean:js',
    'uglify',
    'filerev',
    'usemin',
    'cdnify',
    'htmlmin',
    'clean:bowerAssets'
  ]);<% if (useS3) { %>

  grunt.registerTask('deploy', [
    'build:dist',
    'compress',
    'aws_s3'
  ]);<% } %>

  grunt.registerTask('build:server', [
    'clean:dist',
    'clean:tmp',
    'assemble',
    'concurrent:assets',
    'sass:server'
  ]);

  grunt.registerTask('server', [
    'build:server',
    'connect',
    'watch'
  ]);

  grunt.registerTask('default', [
    'build:dist'
  ]);
};
