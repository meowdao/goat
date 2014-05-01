module.exports = function (grunt) {

    "use strict";

    var gzip = require("gzip-js");

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        build: {
            dist: {
                dest: "dist/js/goat.js",
                src: [
                    "assets/js/intro.js",
                    "assets/js/core.js",
                    "assets/js/outro.js"
                ]
            }
        },
        jshint: {
            dist: {
                src: [
                    "dist/assets/goat.js",
                    "assets/js/*.js",
                    "!assets/js/intro.js",
                    "!assets/js/outro.js"
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
        uglify: {
            dist: {
                options: {
                    beautify: {
                        ascii_only: true
                    },
                    preserveComments: "some",
                    banner: "/*! <%= pkg.title %> \n @DATE: <%= grunt.template.today('yyyy-mm-dd') %> \n @VERSION: <%= pkg.version %> \n @AUTHOR: <%= pkg.author.name %> (<%= pkg.author.email %>) \n @LICENCE: <%= pkg.license.type %> \n */\n"
                },
                files: {
                    "dist/js/goat.min.js": ["dist/js/goat.js"],
                    "dist/js/translator.min.js": ["assets/js/translator.js"],
                    "dist/js/common.min.js": ["assets/js/common.js"]
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
                    "dist/css/form.min.css": "assets/css/form.scss",
                    "dist/css/normalize.min.css": "vendors/normalize.css/normalize.css"
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
                    "dist/css/form.min.css": "assets/css/form.scss",
                    "dist/css/normalize.min.css": "vendors/normalize.css/normalize.css"
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
            },
            css: {
                files: [
                    {
                        expand: true,
                        cwd: "assets/css/",
                        src: [
                            "reset.css"
                        ],
                        dest: "dist/css/"
                    }
                ]
            },
            jquery: {
                files: [
                    {
                        expand: true,
                        cwd: "vendors/jquery/dist/",
                        src: [
                            "jquery.min.js",
                            "jquery.min.map"
                        ],
                        dest: "dist/js/"
                    }
                ]
            },
            jqueryui: {
                files: [
                    {
                        expand: true,
                        cwd: "vendors/jquery-ui/ui/minified/",
                        src: [
                            "jquery-ui.custom.min.js"
                        ],
                        dest: "dist/js/"
                    },
                    {
                        expand: true,
                        cwd: "vendors/jquery-ui/ui/minified/i18n/",
                        src: [
                            "jquery.ui.datepicker-ru.min.js"
                        ],
                        dest: "dist/js/cultures/"
                    },
                    {
                        expand: true,
                        cwd: "vendors/jquery-ui/themes/ui-lightness",
                        src: [
                            "jquery-ui.min.css",
                            "*/**"
                        ],
                        dest: "dist/css/"
                    }
                ]
            },
            globalize: {
                files: [
                    {
                        expand: true,
                        cwd: "vendors/globalize/lib/",
                        src: [
                            "globalize.js"
                        ],
                        dest: "dist/js/"
                    },
                    {
                        expand: true,
                        cwd: "vendors/globalize/lib/cultures/",
                        src: [
                            "globalize.culture.en-US.js",
                            "globalize.culture.ru-RU.js"
                        ],
                        dest: "dist/js/cultures/"
                    },
                    {
                        expand: true,
                        cwd: "assets/js/cultures",
                        src: [
                            "*.js"
                        ],
                        dest: "dist/js/cultures/"
                    }
                ]
            }
        },
        compare_size: {
            files: [
                "dist/goat.min.js",
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
        }
    });

    // Load grunt tasks from NPM packages
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-compare-size");

    grunt.registerTask("build", "Build goat.js", function () {
        var tasks = [],
            done = this.async();

        function assemble () {
            var compiled = "",
                config = grunt.config("build");

            grunt.util._.values(config).forEach(function (subtask) {
                compiled = "";
                subtask.src.forEach(function (filepath) {
                    compiled += grunt.file.read(filepath) + grunt.util.linefeed;
                });
                compiled = compiled
                    .replace(/@([A-Z\.]+)/g, function ($0, $1) {
                        if ($1 === "DATE") {
                            // YYYY-MM-DD
                            return (new Date()).toISOString().replace(/T.*/, "");
                        } else {
                            return grunt.config("pkg." + $1.toLowerCase());
                        }
                    });
                grunt.file.write(subtask.dest, compiled);
                grunt.log.ok("File written to " + subtask.dest);
            });
        }

        grunt.util.async.parallel(tasks, function (error) {
            assemble();
            done(error);
        });
    });

    // Default task(s).
    grunt.registerTask("default", ["build", "jshint", "uglify", "sass", "copy", "compare_size"]);
    grunt.registerTask("travis", ["build", "jshint", "uglify", "sass", "compare_size"]);
    grunt.registerTask("test", ["qunit"]);

};