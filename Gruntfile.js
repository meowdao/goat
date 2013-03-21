module.exports = function(grunt) {

	"use strict";

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		opt: {
			folder: {
				src: "src",
				build: "dist",
				test: "test"
			}
		},
		build: {
			all: {
				dest: "<%= opt.folder.build %>/goat.js",
				src: [
					"<%= opt.folder.src %>/intro.js",
					"<%= opt.folder.src %>/core.js",
					"<%= opt.folder.src %>/outro.js"
				]
			}
		},
		uglify: {
			all: {
				options: {
					beautify: {
						ascii_only: true
					},
					banner: "/*! <%= pkg.title %> \n @DATE: <%= grunt.template.today('yyyy-mm-dd') %> \n @VERSION: <%= pkg.version %> \n @AUTHOR: <%= pkg.author.name %> (<%= pkg.author.email %>) \n @LICENCE: <%= pkg.license.type %> \n */\n"
				},
				files: {
					"build/goat.min.js": ["<%= opt.folder.build %>/goat.js"]
				}
			}
		},
		jshint: {
			dist: {
				src: [ "<%= opt.folder.build %>/goat.js" ],
				options: {
					jshintrc: "<%= opt.folder.src %>/.jshintrc"
				}
			},
			grunt: {
				src: [ "Gruntfile.js" ],
				options: {
					jshintrc: ".jshintrc"
				}
			}
		},
		compare_size: {
			// sizecache == dist // cann't be set :( it's
			files: [
				"<%= opt.folder.build %>/goat.js",
				"<%= opt.folder.build %>/goat.min.js"
			]
		},
		qunit: {
			all: ["test/index.html"]
		}
	});

	// Load grunt tasks from NPM packages
	grunt.loadNpmTasks("grunt-compare-size");
	grunt.loadNpmTasks("grunt-update-submodules");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-qunit");

	grunt.registerMultiTask("build", "Build goat.js", function() {
			var compiled = "";

			this.data.src.forEach(function( filepath ) {
				compiled += grunt.file.read( filepath );
			});

			compiled = compiled
				.replace( /@([A-Z\.]+)/g, function ($0, $1) {
					if ($1 === "DATE") {
						var date = new Date();
						// YYYY-MM-DD
						return [
							date.getFullYear(),
							( "0" + ( date.getMonth() + 1 ) ).slice( -2 ),
							( "0" + date.getDate() ).slice( -2 )
						].join( "-" );
					} else {
						return grunt.config( "pkg." + $1.toLowerCase() );
					}
				});

			// Write source to file
			grunt.file.write( this.data.dest, compiled );

			grunt.log.ok( "File written to " + this.data.dest );
		}
	);

	// Default task(s).
	grunt.registerTask("default", ["update_submodules", "build", "jshint", "uglify", "compare_size"]);
	grunt.registerTask("test", ["update_submodules", "qunit"]);

};