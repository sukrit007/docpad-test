# Docpad Test

> Docpad Test

## Running

First, clone the gazyva repository, change your directory to the project root, and checkout the desired branch:

```
git clone git@github.com:sukrit007/docpad-test.git
cd docpad-test
git checkout branch-name-goes-here
```

### Required tools

If you don't have [nvm](https://github.com/creationix/nvm) installed, please go to the link and install it to your local


### Setup

```
npm install
```

### Running

```
npm start
```

Or if you prefer, and have [Grunt](http://gruntjs.com/) installed globally:
```
grunt run
```

You should see output like the following:

```
Running "clean:out" (clean) task
>> 0 paths cleaned.

Running "node_version" task
Using node 0.10.31
(Project requires node >=0.10.0-0 <0.11.0-0)

Running "exec:run" (exec) task
info: Welcome to DocPad v6.44.0
info: Plugins: cleanurls, coffeekup, concatenation, eco, handlebars, jshint, melt, nodesass, partials, proxy, redirect, vault, winston, yamljs
info: Environment: development
info: DocPad listening to http://localhost:9778/ on directory /Users/someuser/git/docpad-test/out
info: Generating...
info: Generated all n files in n seconds
info: The action completed successfully
```

If you do not see the above, you may need to install [DocPad](http://docpad.org/) globally. To do so, run the following:

```
npm install -g docpad
docpad run
```

You should see output like the following:

```
info: Welcome to DocPad v6.44.0
info: Plugins: cleanurls, coffeekup, concatenation, eco, handlebars, jshint, melt, nodesass, partials, proxy, redirect, vault, winston, yamljs
info: Environment: development
info: DocPad listening to http://localhost:9778/ on directory /Users/someuser/git/docpad-test/out
info: Generating...
info: Generated all 26 files in 0.213 seconds
info: The action completed successfully
```

Afterwhich, you can kill DocPad (Ctrl+C) and then simply use `npm start` as described above.

You should now be able to access the site by going to the following URL:

```
http://localhost:9778/
```

Notice that this URL is also displayed in the console output after executing `npm start`.


## Other commands

These require Grunt to be installed globally (`npm install -g grunt-cli`)

`grunt prepare`: install [Bower](http://bower.io/) packages and private dependencies

`grunt build`: build site (without running server)

`grunt deploy`: deploy site to meltdev (see `package.json` for URL)

`grunt production`: run site in production mode

`grunt run-server`: run node server

`grunt githooks`: bind the test command as a pre-commit githook

`grunt test`: run [Chai](http://chaijs.com/) tests using [Mocha](http://mochajs.org/)


## Release

This project uses the [Git Flow](https://confluence.meltdev.com/display/DEV/Git+Flow) process for getting changes into the project.
