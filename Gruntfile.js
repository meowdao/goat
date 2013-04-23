module.exports = function(grunt) {

	"use strict";

	var gzip = require("gzip-js");

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		build: {
			dist: {
				dest: "dist/goat.js",
				src: [
					"src/intro.js",
					"src/core.js",
					"src/outro.js"
				]
			}
		},
		jshint: {
			dist: {
				src: [ "dist/goat.js" ],
				options: {
					jshintrc: "src/.jshintrc"
				}
			},
			grunt: {
				src: [ "Gruntfile.js" ],
				options: {
					jshintrc: ".jshintrc"
				}
			},
			test: {
				src: [ "test/unit/*.js" ],
				options: {
					jshintrc: "test/.jshintrc"
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
					"dist/goat.min.js": ["dist/goat.js"]
				}
			}
		},
		sass: {
			dist: {
				options: {
					bundleExec: true,
					style: "compressed"
				},
				files: {
					"dist/styles.min.css": [
						"src/styles.scss",
						"src/login.scss"
					]
				}
			},
			dev: {
				options: {
					lineNumbers: true,
					bundleExec: true,
					style: "expanded"
				},
				files: {
					"dist/styles.css": [
						"src/styles.scss",
						"src/login.scss"
					]
				}
			}
		},
		watch: {
			style: {
				files: ["src/*.scss"],
				tasks: ["sass"],
				options: {
					nospawn: true,
					debounceDelay: 500
				}
			},
			script: {
				files: ["src/*.js"],
				tasks: ["build", "jshint"],
				options: {
					nospawn: true,
					debounceDelay: 500
				}
			}
		},
		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: "src/",
						src: [
							"login.html"
						],
						dest: "dist/"
					}
				]
			}
		},
		compare_size: {
			files: [
				"dist/goat.js",
				"dist/goat.min.js",
				"dist/styles.css",
				"dist/styles.min.css"
			],
			options: {
				compress: {
					gz: function( contents ) {
						return gzip.zip( contents, {} ).length;
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
	grunt.loadNpmTasks("grunt-update-submodules");


	grunt.registerTask("build", "Build goat.js", function () {
		var tasks = [],
			done = this.async(),
			child_process = require("child_process");

		function assemble() {
			var compiled = "",
				config =  grunt.config("build");

			grunt.util._.values(config).forEach(function( subtask ) {
				compiled = "";
				subtask.src.forEach(function( filepath ) {
					compiled += grunt.file.read( filepath ) + grunt.util.linefeed;
				});
				compiled = compiled
					.replace( /@([A-Z\.]+)/g, function ($0, $1) {
						if ($1 === "DATE") {
							// YYYY-MM-DD
							return (new Date()).toISOString().replace(/T.*/, "");
						} else {
							return grunt.config( "pkg." + $1.toLowerCase() );
						}
					});
				grunt.file.write( subtask.dest, compiled );
				grunt.log.ok( "File written to " + subtask.dest );
			});
		}

		if (grunt.task.current.args.indexOf("jquery") > -1) { // ! this.args doesn't work
			tasks.push(function(callback){
				grunt.log.writeln( "Rebuilding jQuery...");
				child_process.exec("cd vendor/jquery && grunt custom:-deprecated,-event-alias,-sizzle", function (error, stdout, stderr) {
					var log = "log/build.std";
					if (stdout.length > 0) {
						//grunt.log.writeln(stdout);
						grunt.file.write( log + "out.log", stdout );
					}
					if (stderr.length > 0) {
						//grunt.log.error(stderr);
						grunt.file.write( log + "err.log", stderr );
					}
					callback(error);
				});
			});
		}

		grunt.util.async.parallel(tasks, function(error) {
			assemble();
			done(error);
		});
	});

	// Default task(s).
	grunt.registerTask("default", ["update_submodules", "build", "jshint", "uglify", "sass", "copy", "compare_size"]);
	grunt.registerTask("travis", ["build", "jshint", "uglify", "sass", "compare_size"]);
	grunt.registerTask("test", ["update_submodules", "qunit"]);

};