module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        exec:{
          prepare:{
            command:"cordova prepare",
            stdout:true,
            stderror:true
          }
        },
        watch:{
          files:['www/**/*.*'],
          tasks:['exec:prepare']
        },
        macreload: {
          chrome: {
            browser: 'chrome'
          }
        }
    });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-macreload');

    grunt.registerTask('default', ['watch', 'macreload']);

};