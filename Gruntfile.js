module.exports = function (grunt) {

    "use strict";

    var gzip = require("gzip-js");

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        build: {
            dist: {
                dest: "dist/goat.js",
                src: [
                    "assets/javascripts/intro.js",
                    "assets/javascripts/core.js",
                    "assets/javascripts/outro.js"
                ]
            }
        },
        jshint: {
            dist: {
                src: [
                    "dist/goat.js",
                    "assets/javascripts/*.js"
                ],
                options: {
                    jshintrc: "assets/javascripts/.jshintrc"
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
                    "utils/*",
                    "!utils/text.js"
                ],
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
                    "dist/goat.min.js": ["dist/goat.js"],
                    "dist/translator.min.js": ["assets/javascripts/translator.js"],
                    "dist/common.min.js": ["assets/javascripts/common.js"]
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
                    "dist/stylesheet/styles.min.css": "assets/stylesheets/styles.scss",
                    "dist/stylesheet/form.min.css": "assets/stylesheets/form.scss",
                    "dist/stylesheet/reset.min.css": "assets/stylesheets/reset.css"
                }
            },
            dev: {
                options: {
                    lineNumbers: true,
                    bundleExec: true,
                    style: "expanded"
                },
                files: {
                    "dist/stylesheet/styles.min.css": "assets/stylesheets/styles.scss",
                    "dist/stylesheet/form.min.css": "assets/stylesheets/form.scss",
                    "dist/stylesheet/reset.min.css": "assets/stylesheets/reset.css"
                }
            }
        },
        watch: {
            style: {
                files: ["assets/stylesheets/*.scss"],
                tasks: ["sass"],
                options: {
                    nospawn: true,
                    debounceDelay: 500
                }
            },
            script: {
                files: ["assets/javascripts/*.js"],
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
                        cwd: "assets/images",
                        src: [
                            "*",
                            "*/**"
                        ],
                        dest: "dist/"
                    }
                ]
            },
            css: {
                files: [
                    {
                        expand: true,
                        cwd: "assets/stylesheet/",
                        src: [
                            "reset.css"
                        ],
                        dest: "dist/stylesheet/"
                    }
                ]
            },
            jquery: {
                files: [
                    {
                        expand: true,
                        cwd: "vendors/jquery/",
                        src: [
                            "jquery.min.js"
                        ],
                        dest: "dist/"
                    }
                ]
            },
            globalize: {
                files: [
                    {
                        expand: true,
                        cwd: "vendors/globalize/lib/",
                        src: [
                            "globalize.min.js"
                        ],
                        dest: "dist/"
                    },
                    {
                        expand: true,
                        cwd: "vendors/globalize/lib/cultures/",
                        src: [
                            "globalize.culture.en-US.js",
                            "globalize.culture.ru-RU.js"
                        ],
                        dest: "dist/cultures/"
                    },
                    {
                        expand: true,
                        cwd: "assets/javascripts/cultures",
                        src: [
                            "*.js"
                        ],
                        dest: "dist/cultures/"
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
            done = this.async(),
            child_process = require("child_process");

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

        if (grunt.task.current.args.indexOf("jquery") > -1) { // ! this.args doesn't work
            tasks.push(function (callback) {
                grunt.log.writeln("Rebuilding jQuery...");
                child_process.exec("cd vendor/jquery && grunt custom:-deprecated,-event-alias,-sizzle", function (error, stdout, stderr) {
                    var log = "log/build.std";
                    if (stdout.length > 0) {
                        //grunt.log.writeln(stdout);
                        grunt.file.write(log + "out.log", stdout);
                    }
                    if (stderr.length > 0) {
                        //grunt.log.error(stderr);
                        grunt.file.write(log + "err.log", stderr);
                    }
                    callback(error);
                });
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