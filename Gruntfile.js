module.exports = function (grunt) {

    "use strict";

    // Project configuration.
    grunt.initConfig({
        jshint: {
            dist: {
                src: [
                    "assets/js/*.js"
                ],
                options: {
                    jshintrc: "assets/js/.jshintrc"
                }
            },
            test: {
                src: [
                    "test/qunit/*.js",
                    "test/mocha/*.js"
                ],
                options: {
                    jshintrc: "test/.jshintrc"
                }
            },
            other: {
                src: [
                    "Gruntfile.js",
                    "configs/*",
                    "controllers/*",
                    "models/*",
                    "utils/*"
                ],
                options: {
                    jshintrc: ".jshintrc"
                }
            }
        }
    });

    // Load grunt tasks from NPM packages
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-qunit");

    // Task
    grunt.registerTask("default", ["jshint"]);
    grunt.registerTask("travis", ["jshint", "qunit"]);
    grunt.registerTask("build", ["default"]);
    grunt.registerTask("test", ["qunit"]);

};