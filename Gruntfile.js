module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        config: {
    			src: 'src',
    			dist: 'dist'
    		},

        // babel: {
        //     options: {
        //         presets: ['react']
        //     },
        //     dist: {
        //         files: [{
        //             expand: true,
        //             src: ['src/**/*.js'],
        //             dest: 'dist',
        //             ext: '.js'
        //         }]
        //     }
        // },
        browserify: {
            dist: {
                src: ['src/index.js'],
                dest: 'dist/js/<%= pkg.name %>.js'
            },
            options: {
      				transform: [["babelify", { presets: ['react','es2015'] }]]
      			}
        },
        less: {
    			dev: {
    				files: {
    					'<%= config.dist %>/css/<%= pkg.name %>.<%= pkg.css_version %>.css': '<%= config.src %>/less/*.less'
    				}
    			},
    			prod: {
    				options: {
    					cleancss: true,
    					compress:true
    				},
    				files: {
              '<%= config.dist %>/css/<%= pkg.name %>.<%= pkg.css_version %>.css': '<%= config.src %>/less/*.less'
    				}
    			}
    		},
        uglify: {
            my_target: {
                files: {
                    'dist/js/<%= pkg.name %>.<%= pkg.version %>.min.js': ['<%= browserify.dist.dest %>']
    				    }
    			  }
    		},
        eslint: {
            options: {
                jsx: true
            },
            target: ['src/**/*.js']
        },
        watch: {
            js: {
              files: 'src/**/*.js',
              tasks: ['bw']
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['browserify', 'less', 'uglify']);

};
