module.exports = function(grunt) {


    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-jslint");
    grunt.loadNpmTasks("grunt-open");

    grunt.initConfig({

        // Dev Server
        port: 7860,

        // App Structure
        files: {
            html: {
                src: "app/index.html",
                dev: "out/index.html",
                build: "build/index.html"
            },
            partials: {
                src: "app/partials/*",
                dev: "out/partials/",
                build: "build/partials/"
            },
            css: {
                src: ["app/css/style.css"],
                dev: "out/css/screen.css",
                build: "build/css/screen.css"
            },
            js: {
                app: {
                    main: "app/js/progress.js",
                    src: ["app/js/*.js","app/js/**/*.js","app/js/templates/*.html"],
                    dev: "out/js/bundle.js",
                    build: "build/js/bundle.js"
                },
                test: {
                    src: ["test/spec/*.js","test/spec/**/*.js"],
                    dst: "test/spec.js",
                    runner: "test/_SpecRunner.html"
                }
            },
            json: {
                src: "app/data/books.json",
                dev: "out/data/books.json",
                build: "build/data/books.json"
            }
        },

        // Tasks
        browserify: {
            dev: {
                files: {
                    "<%= files.js.app.dev %>": "<%= files.js.app.main %>"
                },
                options: {
                    debug: true,
                    paths: ["./node_modules", "./script/app"],
                    transform: ['stringify']
                }
            },
            build: {
                files: {
                    "<%= files.js.app.build %>": "<%= files.js.app.main %>"
                },
                options: {
                    debug: true,
                    paths: ["./node_modules", "./script/app"],
                    transform: ['stringify']
                }
            }
        },

        //
        concat: {
            css: {
                files: {
                    "<%= files.css.dev %>": "<%= files.css.src %>",
                    "<%= files.css.build %>": "<%= files.css.src %>"
                }
            }
        },
        copy: {
            html: {
                files: {
                    "<%= files.html.dev %>": "<%= files.html.src %>",
                    "<%= files.html.build %>": "<%= files.html.src %>"
                }
            },
            partials: {
                files: [
                  {
                    src: ["app/partials/*"],
                    dest: "out/partials",
                    expand: true,
                    flatten: true
                  }
                ]
            },
            json: {
                files: {
                    "<%= files.json.dev %>": "<%= files.json.src %>",
                    "<%= files.json.build %>": "<%= files.json.src %>"
                }
            }
        },
        clean: {
            files: ["<%= files.js.test.dst %>"],
            workspaces: ["out"]
        },

        //
        server: {
            base: "<%= process.env.SERVER_BASE || 'out'%>",
            web: {
                port: "<%= port %>"
            }
        },
        open: {
            dev: {
                path: "http://localhost:<%= server.web.port %>"
            }
        },

        jshint: {
            src: ["<%= files.js.app.src %>"]
        },
        jslint: {
            client: {
                src: ["<%= files.js.app.src %>"],
                directives: {
                    node: true, // browserify
                    nomen: true
                }
            }
        },

        //
        watch: {
            options: {
                livereload: true
            },
            html: {
                files: ["<%= files.html.src %>"],
                tasks: ["copy:html"]
            },
            partials: {
                files: ["<%= files.partials.src %>"],
                tasks: ["copy:partials"]
            },
            json: {
                files: ["<%= files.json.src %>"],
                tasks: ["copy:json"]
            },
            css: {
                files: ["<%= files.css.src %>"],
                tasks: ["concat"]
            },
            app: {
                files: ["<%= files.js.app.src %>"],
                tasks: ["jshint","jslint","browserify:dev"]
            },
            grunt: {
                files: ["Gruntfile.js"],
                tasks: ["clean", "copy", "concat", "jshint", "jslint", "browserify"]
            }
        }
    });



    grunt.loadTasks("tasks");

    grunt.registerTask("default", ["clean", "copy", "concat", "jshint", "jslint", "browserify", "server", "open", "watch"]);

};