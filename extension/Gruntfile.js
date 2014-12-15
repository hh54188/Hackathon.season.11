module.exports = function(grunt) {

    grunt.initConfig({
        // How to run:
        // grunt watch
        watch: {
            scripts: {
                files: ['./dist/*.js', './dist/*.css', '!./dist/content.js', '!./dist/content.css'],
                tasks: ['default'],
                options : { verbose : true }
            },
        },
        concat: {
            default_js: {
                src: ['./dist/inject.js',
                        './dist/jquery-2.0.2.js', 
                        './dist/semantic.min.js',
                        './dist/uibootstrap.js',
                        './dist/msg.js',
                        './dist/docker.js',
                        './dist/modal.js'],
                
                dest: './dist/content.js'
            },
            default_css: {
                src: ['./dist/semantic-patch.css',
                        './dist/semantic.css',
                        './dist/custom.css'],

                dest: './dist/content.css'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    // How to run:
    // grunt default
    grunt.registerTask('default', ['concat:default_js', 'concat:default_css']);

};