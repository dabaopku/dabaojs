var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var util = require("gulp-util");
var babel = require("babel-core");

var paths = {
    js: {
        es6: ["client/js/**/**.js", "!client/js/lib/**.js"],
        lib: "client/lib/js",
        output: "server/static/js/"
    }
};


// 3rd party libraries
var libs = [
	"d3"
];

var handelError = function(error) {
    var name = error.name;
    var msg = error.message;
    var logs = [];
    
    logs.push(util.colors.bold.red("\n[Error]"));
    logs.push(name);
    
    do {
        if (name != "Error") {
            break;
        }
        var index = msg.indexOf(":");
        if (index < 0) {
            break;
        }
        var file = msg.slice(0, index);
        msg = msg.slice(index+2);
        logs.push(util.colors.yellow("\n[File]"));
        logs.push(file);
    } while (0);
    
    logs.push(util.colors.yellow("\n[Info]"));
    logs.push(msg);
    
    do {
        if (name != "Error") {
            break;
        }
        var stack = error.stack;
        index = stack.indexOf("\n");
        stack = stack.slice(index + 2);
        logs.push(util.colors.yellow("\n[Stack]\n"));
        logs.push(stack);
    } while (0);

    util.log.apply(null, logs);
    
    this.emit("end");
};

        
// Tasks

gulp.task("script:app", function() {
    var bundler = browserify("client/js/main.js", {debug:true})
        .external(libs)
        .transform(babelify,
        {
            presets: ["es2015", "stage-0", "react"]
        });
        
    return bundler.bundle()
        .on("error", handelError)
        .pipe(source("app.js"))
        .pipe(gulp.dest(paths.js.output));
});


gulp.task("script:lib", function() {
    var bundler = browserify()
        .require(libs);
    
    return bundler.bundle()
        .on("error", handelError)
        .pipe(source("lib.js"))
        .pipe(gulp.dest(paths.js.output));
});


gulp.task("watch", function() {
    gulp.watch(paths.js.es6, [ "script:app"])
        .on("error", handelError);
});


gulp.task("default", ["script:app", "watch"]);
