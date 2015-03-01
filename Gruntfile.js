/* jshint sub:true
*/

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.copyright %>;\n' +
            '* Licensed <%= pkg.licenses[0].type %> - <%= pkg.licenses[0].url %>*/\n'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                loopfunc: true,
                globals: {
                    node: true,
                    exports: true,
                    require: true,
                    describe: true,
                    it: true,
                    beforeEach: true,
                    before: true,
                    expect: true
                }
            },
            uses_defaults: [
                'Gruntfile.js',
                'tidy-flow.js',
                'tidy-flow_spec.js'
            ]
        },
        uglify: {
            dist: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: ['tidy-flow.js'],
                dest: 'tidy-flow.min.js'
            }
        },
        jasmine: {
            ua_parse: {
                src: 'tidy-flow.js',
                options: {
                    specs: ['tidy-flow_spec.js'],
                    outfile: 'tidyFlowSpec.html'
                }
            }
        },
        connect: {
            server: {
                options: {
                port: 8080,
                keepalive: true,
                base: {
                    path: __dirname,
                        options: {
                            index: 'tidy-flow_test.html',
                            maxAge: 300000
                        }
                    }
                }
            }
        }
    });

    // Load the plugin.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-connect');
    // Default task(s).

    grunt.registerTask('test', ['jshint', 'jasmine']);
    grunt.registerTask('default', ['test', 'concat', 'uglify']);
    grunt.registerTask('publish', ['test', 'concat', 'uglify']);
    grunt.registerTask('server', ['connect']);
};