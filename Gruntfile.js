/*
 * boilerplate-h5bp
 * https://github.com/assemble/boilerplate-h5bp
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('.assemblerc.yml'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    process: require('./src/js/sanitize.js'),

    watch: {
      options: {
        livereload: true,
        interrupt: true,
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['watchcontexthelper:gruntfile'],
        options: {
          nospawn: true,
        },
      },
      sass: {
        files: ['<%= site.src %>/sass/**/*.{scss,sass}'],
        tasks: ['watchcontexthelper:sass'],
        options: {
          nospawn: true
        },
      },
      js: {
        files: ['<%= site.src %>/js/**/*.js'],
        tasks: ['watchcontexthelper:js'],
        options: {
          nospawn: false
        },
      },
      img: {
        files: ['<%= site.src %>/images/**/*'],
        tasks: ['watchcontexthelper:img'],
        options: {
          nospawn: true
        },
      },
      html: {
        files: ['<%= site.src %>/html/**/*.hbs'],
        tasks: ['watchcontexthelper:html'],
        options: {
          nospawn: false
        },
      },
    },

    // Lint JavaScript
    jshint: {
      all: ['<%= site.src %>/js/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        assets: '<%= site.assets %>',
        layouts: '<%= site.layouts %>',
        layout: '<%= site.layout %>'
      },
      development: {
        options: {
          production: false,
          partials: ['<%= site.includes %>/**/*.hbs']
        },
        files: [
          {
            expand: true,
            cwd: '<%= site.pages %>', //ask assemble to compile the pages
            src: ['**/*.hbs'],
            dest: '<%= site.dest %>/'
          }
        ]
      },
      production: {
        options: {
          production: true,
          partials: ['<%= site.includes %>/**/*.hbs']
        },
        files: [
          {
            expand: true,
            cwd: '<%= site.pages %>', //ask assemble to compile the pages
            src: ['**/*.hbs'],
            dest: '<%= site.dest %>/'
          }
        ]
      }
    },

    // Prettify test HTML pages from Assemble task.
    prettify: {
      all: {
        files: [
          {expand: true, cwd: '<%= site.dest %>', src: ['*.html'], dest: '<%= site.dest %>/', ext: '.html'}
        ]
      }
    },

    uglify: {
      // concat and minify scripts
      scripts: {
        options: {
          mangle: false
        },
        files: {
          '<%= site.dest %>/js/main.min.js': ['<%= site.src %>/js/main.js']
        }
      }
    },

    sass: {
      main: {
        files: {
          '<%= site.dest %>/css/main.css': '<%= site.src %>/sass/main.scss'
        },
      },
    },

    concat: {
      js: {
        src: [
          // '<%= vendor %>/bootstrap-sass-twbs/assets/javascripts/bootstrap/carousel.js',
          '<%= site.src %>/js/main.js'
        ],
        dest: '<%= site.dest %>/js/main.js'
      },
    },

    // Copy H5BP files to new project, using replacement
    // patterns to convert files into templates.
    copy: {
      img: {
        files: [
          { expand: true, cwd: '<%= site.src %>/images/', src: '**/*', dest: '<%= site.dest %>/images/' }
        ],
      },
      "js-vendor": {
        files: [
          { expand: true, cwd: '<%= vendor %>/jquery/dist/', src: 'jquery.js', dest: '<%= site.dest %>/js/vendor' },
          { expand: true, cwd: '<%= vendor %>/modernizr/', src: 'modernizr.js', dest: '<%= site.dest %>/js/vendor' }
        ],
      }
    },

    // Before generating new files remove files from previous build.
    clean: {
      dist: ['<%= site.dest %>'],
      html: ['<%= site.dest %>/*.html'],
      css: ['<%= site.dest %>/css/'],
      js: ['<%= site.dest %>/js/'],
      // "js-vendor": ['<%= site.dest %>/js/vendor'],
      img: ['<%= site.dest %>/images/']
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-assemble');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-prettify');
  // grunt.loadNpmTasks('grunt-verb');

  grunt.registerTask('watchcontexthelper', function (target){
    switch (target) {
      case 'gruntfile':
        var child;

        var showDone = function(){
          console.log('Done');
        }

        if (grunt.watchcontext === 'production') {
          child = grunt.util.spawn({ grunt: true, args: ['production'] }, showDone);
        } else {
          child = grunt.util.spawn({ grunt: true, args: ['development'] }, showDone);
        }

        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
        break;
      case 'js':
        (grunt.watchcontext === 'production') ?
        grunt.task.run(['clean:js', 'concat', 'uglify', 'clean:devjs']) :
        grunt.task.run(['clean:js', 'concat']);
        break;
      case 'img':
        (grunt.watchcontext === 'production') ?
        grunt.task.run(['clean:img', 'copy:img']) :
        grunt.task.run(['clean:img', 'copy:img']);
        break;
      case 'html':
        (grunt.watchcontext === 'production') ?
        grunt.task.run(['clean:html', 'assemble:production']) :
        grunt.task.run(['clean:html', 'assemble:development']);
        break;
      case 'sass':
        (grunt.watchcontext === 'production') ?
        grunt.task.run(['clean:css', 'sass', 'cssmin', 'clean:devcss']) :
        grunt.task.run(['clean:css', 'sass']);
        break;
    }
  });

  // Default tasks to be run.
  grunt.registerTask('default', [
    'clean:dist',
    'copy:img',
    // 'copy:js-vendor',
    'concat',
    'sass',
    'assemble:development'
  ]);

  grunt.registerTask('development', [
    'default'
  ]);

  grunt.registerTask('production', [
    'clean:dist',
    'copy:img',
    // 'copy:js-vendor',
    'uglify',
    'sass',
    'assemble:production'
    //'prettify'
  ]);

  // Linting and tests.
  grunt.registerTask('test', ['clean', 'jshint']);
};
