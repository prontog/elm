module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
//        uglify: {
//            options: {
//                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//            },
//            build: {
//                src: 'src/<%= pkg.name %>.js',
//                dest: 'build/<%= pkg.name %>.min.js'
//            }
//        },
        stripmq: {
            all: {
                files: {                    
                    // Takes the input file `app.css`, and generates `app-old-ie.css`.
                    'out/styles/side-menu-old-ie.css': ['out/styles/side-menu.css']
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    // Load the plugin that provides the "stripmq" task.
    grunt.loadNpmTasks('grunt-stripmq');

    // Default task(s).
    grunt.registerTask('default', ['stripmq']);

};