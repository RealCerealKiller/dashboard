module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      haml: {
        files: ['src/templates/**/*.haml'],
        tasks: ['newer:haml', 'ngtemplates', 'concat'],
        options: {
          spawn: false,
          livereload: true,
        },
      },

      js: {
        files: ['src/javascripts/**/*.js'],
        tasks: [ 'concat:app', 'babel', 'browserify', 'concat:dist'],
        options: {
          spawn: false,
          livereload: true,
        },
      },

      css: {
        files: ['src/stylesheets/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
          livereload: true,
        },
      }
    },

    sass: {
      dist: {
        options: {
         style: 'expanded'
       },
        files: {
          'public/stylesheets/app.css': 'src/stylesheets/main.css.scss'
        }
      }
    },

    haml: {
      dist: {
        expand: true,
        ext: '.html',
        extDot: 'last',
        src: ['src/templates/**/*.haml'],
        dest: 'src/templates/generated/',
        rename: function (dest, src) {
          return dest + src.replace(".html", "");
        }
      },
    },

    ngtemplates:  {
      templates: {
        cwd: 'src/templates/generated/src/',
        src: ['**/*.html'],
        dest: 'public/javascripts/templates.js',
        options: {
          module: 'app'
        }
      }
    },

     concat: {
       options: {
         separator: ';',
       },
       app: {
         src: [
           'src/javascripts/**/*.js',
         ],
         dest: 'public/javascripts/app.js',
       },

       lib: {
         src: [
           'bower_components/angular/angular.js',
           'bower_components/angular-ui-router/release/angular-ui-router.js',
           'bower_components/lodash/dist/lodash.min.js',
           'bower_components/restangular/dist/restangular.js'
         ],
         dest: 'public/javascripts/lib.js',
       },

       dist: {
         src: ['public/javascripts/lib.js', 'public/javascripts/transpiled.js', 'public/javascripts/templates.js'],
         dest: 'public/javascripts/compiled.js',
       },
     },

     babel: {
          options: {
              sourceMap: true,
              presets: ['es2016']
          },
          dist: {
              files: {
                  'public/javascripts/transpiled.js': 'public/javascripts/app.js'
              }
          }
      },

      browserify: {
        dist: {
          files: {
            'public/javascripts/transpiled.js': 'public/javascripts/transpiled.js'
          },
          options: {
          }
        }
      },

     ngAnnotate: {
       options: {
          singleQuotes: true,
        },

        neeto: {
          files: {
            'public/javascripts/compiled.js': 'public/javascripts/compiled.js',
          },
        }
      },

     uglify: {
       compiled: {
         src: ['public/javascripts/compiled.js'],
         dest: 'public/javascripts/compiled.min.js'
       }
    }
  });

  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-haml2html');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', [
    'haml', 'ngtemplates', 'sass', 'concat:app', 'babel', 'browserify',
    'concat:lib', 'concat:dist', 'ngAnnotate', 'uglify'
  ]);
};
