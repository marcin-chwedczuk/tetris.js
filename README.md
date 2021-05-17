# tetris.js
JavaScript clone of popular tetris game

### Building

For building this project you will need NodeJS and Gulp.

Check that you have NodeJS 16.x installed on your system 
(Gulp is quite slow to add support for newer NodeJS versions, 
so make sure that you use exactly 16.x):
```
$ node --version
v16.0.0

$ npm --version
7.10.0
```

Install Gulp if you don't have it yet:
```
$ npm install --global gulp-cli
$ cd tetris.js
$ gulp --version
CLI version: 2.3.0
Local version: 4.0.2
```

Build and start the application:
```
$ npm install
$ gulp clean serve
```
Enjoy! :tada:

To create release build run:
```
RELEASE=1 gulp clean build test
```

For debug build (with source map, non minimized JS) just unset `RELEASE` variable:
```
RELEASE= gulp clean build test
```

### Gameplay

![tetris gameplay](doc/screen_a.png)


