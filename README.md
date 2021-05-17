# tetris.js
JavaScript clone of the popular Tetris game.

### Building

NodeJS 16.x and Gulp are required to build this application
(Gulp is quite slow to add support for newer NodeJS versions, 
so please make sure that you use exactly 16.x):
```
$ node --version
v16.0.0

$ npm --version
7.10.0
```

Install Gulp if you don't have it installed yet:
```
$ npm install --global gulp-cli
$ cd tetris.js
$ gulp --version
CLI version: 2.3.0
Local version: 4.0.2
```

Build and start the game:
```
$ npm install
$ gulp clean serve
```
Enjoy! :tada:

To create release build (optimized for deployment) run:
```
$ RELEASE=1 gulp clean build test
```

For debug build (with source maps, non minimized JS) just unset `RELEASE` variable:
```
$ RELEASE= gulp clean build test
```

### Gameplay

![tetris gameplay](doc/screen_a.png)


