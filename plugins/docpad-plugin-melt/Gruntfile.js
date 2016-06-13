module.exports = function( grunt ) {

  grunt.initConfig( {
    pkg: grunt.file.readJSON( 'package.json' ),
    exec: {
      compile: {
        cmd: "coffee -c -o out/ src/"
      }
    },
    watch: {
      files: ["**/*.coffee"],
      tasks: ["exec:compile"],
      options: {
        debounceDelay: 250
      }
    }
  } );

  grunt.loadNpmTasks( 'grunt-exec' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );

  grunt.registerTask( 'default', ["exec:compile","watch"] );
  grunt.registerTask( "compile", ["exec:compile"] );

};