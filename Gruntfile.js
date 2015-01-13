module.exports = function(grunt) {
  require('time-grunt')(grunt);

  var pkg = grunt.file.readJSON('package.json');
  var isPlugin = /Plugin$/.test( pkg.name );
  pkg.pubDir = 'pub/System/' + pkg.name;
  pkg.dataDir = 'data/System';
  pkg.libDirBase = 'lib/Foswiki/' + (isPlugin ? 'Plugins/': 'Contrib/');
  pkg.libDir = pkg.libDirBase + pkg.name;

  try {
    var bowerrc = grunt.file.readJSON('.bowerrc');
    pkg.bower = bowerrc.directory;
  } catch( e ) {
    pkg.bower = 'bower_components'
  }

  grunt.initConfig({
    pkg: pkg,

    jshint: {
      options: {
        browser: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        reporter: require('jshint-stylish'),
        globals: {
          jQuery: true
        },
      },
      beforeconcat: ['<%= pkg.pubDir %>/scripts/modac.codemirror.js']
    },

    sass: {
      dev: {
        options: {
          outputStyle: 'nested',
        },
        files: {
          "<%= pkg.pubDir %>/styles/modac.codemirror.css": "<%= pkg.pubDir %>/styles/modac.codemirror.scss"
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          "<%= pkg.pubDir %>/styles/modac.codemirror.min.css": "<%= pkg.pubDir %>/styles/modac.codemirror.scss"
        }
      }
    },

    uglify: {
      dist: {
        options: {
          compress: true,
          mangle: true,
          preserveComments: false
        },
        files: [{
          '<%= pkg.pubDir %>/scripts/modac.codemirror.min.js': [
            '<%= pkg.pubDir %>/scripts/modac.codemirror.js'
          ],
          '<%= pkg.pubDir %>/scripts/codemirror.min.js': [
            '<%= pkg.bower %>/codemirror/lib/codemirror.js',
            '<%= pkg.bower %>/codemirror/mode/xml/xml.js',
            '<%= pkg.bower %>/codemirror/mode/javascript/javascript.js',
            '<%= pkg.bower %>/codemirror/mode/css/css.js',
            '<%= pkg.bower %>/codemirror/mode/htmlmixed/htmlmixed.js',
            '<%= pkg.bower %>/codemirror/mode/javascript/javascript.js',
            '<%= pkg.bower %>/codemirror/addon/selection/active-line.js',
            '<%= pkg.bower %>/codemirror/addon/selection/mark-selection.js',
            '<%= pkg.bower %>/codemirror/addon/mode/simple.js',
            '<%= pkg.bower %>/codemirror/addon/mode/overlay.js',
            '<%= pkg.bower %>/codemirror/addon/edit/closebrackets.js',
            '<%= pkg.bower %>/codemirror/addon/edit/matchbrackets.js',
            '<%= pkg.bower %>/codemirror/addon/edit/closetag.js',
            '<%= pkg.bower %>/codemirror/addon/edit/matchtags.js',
            '<%= pkg.bower %>/codemirror/addon/fold/xml-fold.js',
            '<%= pkg.bower %>/codemirror/addon/display/rulers.js',
            '<%= pkg.bower %>/codemirror/addon/hint/show-hint.js',
            '<%= pkg.bower %>/codemirror/addon/hint/anymword-hint.js',
            '<%= pkg.bower %>/codemirror/keymap/vim.js',
            '<%= pkg.bower %>/codemirror-emmet/dist/emmet.js'
          ],
        }]
      }
    },

    watch: {
      options: {
        interrupt: true,
      },
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['build']
      },
      sass: {
        files: ['<%= pkg.pubDir %>/styles/modac.codemirror.scss'],
        tasks: ['sass']
      },
      uglify: {
        files: ['<%= pkg.pubDir %>/scripts/modac.codemirror.js'],
        tasks: ['jshint','uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('build', ['sass', 'jshint', 'uglify']);
}
