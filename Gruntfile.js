module.exports = function (grunt) {

    "use strict";

    var gzip = require("gzip-js");

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
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
                src: [ "test/unit/*.js" ],
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
                    "utils/*"                ],
                options: {
                    jshintrc: ".jshintrc"
                }
            }
        },
        sass: {
            dist: {
                options: {
                    //sourcemap: true
                    bundleExec: true,
                    style: "compressed"
                },
                files: {
                    "dist/css/common.min.css": "assets/css/common.scss",
                    "dist/css/styles.min.css": "assets/css/styles.scss",
                    "dist/css/form.min.css": "assets/css/form.scss"
                }
            },
            dev: {
                options: {
                    lineNumbers: true,
                    bundleExec: true,
                    style: "expanded"
                },
                files: {
                    "dist/css/common.min.css": "assets/css/common.scss",
                    "dist/css/styles.min.css": "assets/css/styles.scss",
                    "dist/css/form.min.css": "assets/css/form.scss"
                }
            }
        },
        watch: {
            style: {
                files: ["assets/css/*.scss"],
                tasks: ["sass"],
                options: {
                    nospawn: true,
                    debounceDelay: 500
                }
            },
            script: {
                files: ["assets/js/*.js"],
                tasks: ["build", "jshint"],
                options: {
                    nospawn: true,
                    debounceDelay: 500
                }
            }
        },
        copy: {
            images: {
                files: [
                    {
                        expand: true,
                        cwd: "assets/img",
                        src: [
                            "*",
                            "*/**"
                        ],
                        dest: "dist/img/"
                    }
                ]
            }
        },
        compare_size: {
            files: [
                "dist/main.min.js",
                "dist/styles.min.css"
            ],
            options: {
                compress: {
                    gz: function (contents) {
                        return gzip.zip(contents, {}).length;
                    }
                },
                cache: "dist/.sizecache.json"
            }
        },
        qunit: {
            all: ["test/index.html"]
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "assets/js",
                    mainConfigFile: "assets/js/main.js",
                    name: "main",
                    out: "dist/js/main.min.js",
                    optimize: "uglify2",
                    preserveLicenseComments: false,
                    generateSourceMaps: true,
                    paths: {
                        // plugins
                        "json": "../../dist/vendors/requirejs-plugins/src/json",
                        "text": "../../dist/vendors/requirejs-text/text",

                        // your code
                        //"GOAT": "goat",
                        //"Translator": "empty:"

                        // 3rd party libs
                        "jQuery": "empty:",
                        "jQuery-UI": "empty:",
                        "Globalize": "empty:",

                        // i18n
                        "cldr": "../../dist/vendors/cldrjs/dist/cldr"
                    },
                    exclude: ["text","json","cldr"]
                }
            },
            compileRequirejs: {
                options: {
                    name: "dist/vendors/requirejs/require",
                    out: "dist/vendors/requirejs/require.min.js"
                }
            }
        }
    });

    // Load grunt tasks from NPM packages
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-compare-size");
    grunt.loadNpmTasks("grunt-contrib-requirejs");


    // Default task(s).
    grunt.registerTask("default", ["requirejs", "jshint", "sass", "copy", "compare_size"]);
    grunt.registerTask("travis", ["requirejs", "jshint", "sass", "compare_size"]);
    grunt.registerTask("test", ["qunit"]);

};