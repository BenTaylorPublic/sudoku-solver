module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.initConfig({
        run: {
            options: {},
            build: {
                cmd: 'npm',
                args: [
                    'run',
                    'devbuild'
                ]
            }
        },
        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: [],
            },
            src: {
                files: ['src/**/*.ts', 'src/**/*.scss'],
                tasks: ['run:build']
            }
        }
    });

    grunt.registerTask('default', ['watch']);

};