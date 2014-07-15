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
        less: {
            production: {
                options: {
                    paths: ["assets/css"],
                    compress: true
                },
                files: {
                    "dist/css/common.min.css": "assets/css/common.less",
                    "dist/css/styles.min.css": "assets/css/styles.less",
                    "dist/css/form.min.css": "assets/css/form.less",
                    "dist/css/fonts.min.css": "assets/css/fonts.css",
                    "dist/css/normalize.min.css": "dist/vendors/normalize.css/normalize.css"
                }
            },
            development: {
                options: {
                    paths: ["assets/css"],
                    compress: false
                },
                files: {
                    "dist/css/common.min.css": "assets/css/common.less",
                    "dist/css/styles.min.css": "assets/css/styles.less",
                    "dist/css/form.min.css": "assets/css/form.less",
                    "dist/css/fonts.min.css": "assets/css/fonts.css",
                    "dist/css/normalize.min.css": "dist/vendors/normalize.css/normalize.css"
                }
            }
        },
        watch: {
            style: {
                files: ["assets/css/*.less"],
                tasks: ["less"],
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
            main: {
                options: {
                    baseUrl: "assets/js",
                    name: "main",
                    out: "dist/js/main.min.js",
                    optimize: "uglify2",
                    preserveLicenseComments: false,
                    generateSourceMaps: true,
                    paths: {
                        // libs
                        "jquery": "empty:",
                        "jquery-ui": "empty:",
                        "globalize": "empty:",

                        // plugins
                        "json": "../../dist/vendors/requirejs-plugins/src/json",
                        "text": "../../dist/vendors/requirejs-text/text",

                        // i18n
                        "cldr": "../../dist/vendors/cldrjs/dist/cldr"
                    },
                    exclude: ["text", "json", "cldr"]
                }
            },
            requirejs: {
                options: {
                    name: "dist/vendors/requirejs/require",
                    out: "dist/vendors/requirejs/require.min.js"
                }
            }
        }
    });

    // Load grunt tasks from NPM packages
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-compare-size");
    grunt.loadNpmTasks("grunt-contrib-requirejs");


    // Default task(s).
    grunt.registerTask("default", ["requirejs", "jshint", "less", "copy", "compare_size"]);
    grunt.registerTask("travis", ["requirejs", "jshint", "less", "compare_size"]);
    grunt.registerTask("test", ["qunit"]);

};