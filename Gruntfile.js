/* global module */
/* jshint camelcase: false */
var docpad = './node_modules/.bin/docpad';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        ignores: ['src/files/lib/**/*.js', 'test/lib/**/*.js'],
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      out: ['out'],
      bower: ['.tmp_bower']
    },

    connect: {
      server: {
        options: {
          port: 0, // auto port
          base: 'out',
          useAvailablePort: true
        }
      },
      https: {
        options: {
          port: 9778,
          protocol: 'https',
          base: 'out',
          keepalive: true
        }
      }
    },

    mocha: {
      index: [ 'test/index.html' ],
      options: {
        log: true
      }
    },

    bower: {
      install: {
        options: {
          targetDir: './src/files/lib/bower',
          layout: 'byComponent',
          install: true,
          verbose: false,
          cleanTargetDir: true,
          cleanBowerDir: true
        }
      }
    },

    uglify: {
      options: {
        compress: {
          drop_console: true
        }
      },
      production: {
        files: {
          'out/js/app.js': [
            'src/files/lib/**/jquery.js',
            'src/files/lib/**/*.js',
            'src/files/js/**/*.js',
            '!src/files/lib/**/+(es5-shim|json3|html5shiv).js'
          ]
        }
      }
    },

    watch: {
      scripts: {
        files: 'src/files/js/**/*.js',
        tasks: ['uglify:production'],
        options: {
          atBegin: true
        }
      }
    },

    concurrent: {
      production: ['exec:production', 'watch:scripts']
    },

    githooks: {
      all: {
        'pre-commit': 'test'
      }
    },

    exec: {
      run: {
        cmd: docpad + ' run'
      },

      runServer: {
        cmd: docpad + ' server --env=production'
      },

      buildSite: {
        cmd: docpad + ' generate --env=production'
      },

      production: {
        cmd: docpad + ' server --env=production'
      },

      prepareTest: {
        cmd: 'cd test/lib && rm -rf bower && cd .. && ../node_modules/.bin/bower install'
      }
    },

    cadmium_commit: {
      domain: '<%= pkg.proxy %>',
      message: 'grunt_deploy'
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-node-version');
  grunt.loadNpmTasks('grunt-dependency-installer');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-commit-plugin');

  grunt.registerTask('prepare', ['clean:bower', 'bower:install', 'dependency_installer', 'exec:prepareTest']);
  grunt.registerTask('build', ['clean:out', 'node_version', 'exec:buildSite' ]);
  grunt.registerTask('test', ['jshint', 'connect:server', 'mocha']);
  grunt.registerTask('run', ['clean:out', 'node_version', 'exec:run']);
  grunt.registerTask('production', ['clean:out', 'node_version', 'uglify:production', 'concurrent:production']);

  grunt.registerTask('https', ['build', 'connect:https']);
  grunt.registerTask('deploy', ['test', 'build', 'uglify:production', 'cadmium_commit']);
  grunt.registerTask('default', ['run']);
};
