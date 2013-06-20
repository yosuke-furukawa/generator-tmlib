module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      dev: {
        options: {
          script: 'app.js',
          port: 3000,
          delay: 1000,
          output: ".+"
        }
      }
    },
    bower: {
      install: {
        options: {
          targetDir: './public/vendor',
          layout: 'byType',
          install: false,
          verbose: false,
          cleanTargetDir: false,
          cleanBowerDir: false
        }
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      express: {
        files: [
          'app.js',
          'lib/**',
          'routes/*.js'
        ],
        tasks: ["express:dev"],
        options: {
          nospawn: true
        }
      },
      bower: {
        files: ['bower.json'],
        tasks: ['bower:install']
      },
      js: {
        files: ['public/javascripts/*.js'],
      },
      css: {
        files: ['public/stylesheets/*.css'],
      },
      jade: {
        files: ['views/*.jade'],
      }
    },
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.registerTask('default', ['bower:install', 'express:dev', 'watch']);
};
