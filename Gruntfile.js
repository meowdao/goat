module.exports = function (grunt) {

    "use strict";

    // Project configuration.
    grunt.initConfig({
        jshint: {
            dist: {
                src: [
                    //"assets/js/*.js"
                ],
                options: {
                    jshintrc: "assets/js/.jshintrc"
                }
            },
            test: {
                src: [
                    "test/*.js"
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
                    "!controllers/user.abstract.js",
                    "models/*",
                    "utils/*",
                    "!utils/mail.js"
                ],
                options: {
                    jshintrc: ".jshintrc"
                }
            }
        }
    });

    // Load grunt tasks from NPM packages
    grunt.loadNpmTasks("grunt-contrib-jshint");

    // Task
    grunt.registerTask("default", ["jshint"]);
    grunt.registerTask("travis", ["jshint", "qunit"]);
    grunt.registerTask("build", ["default"]);
    grunt.registerTask("test", ["qunit"]);

};