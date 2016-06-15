var
  fs = require("fs"),
  path = require("path"),
  exec = require("child_process").exec,
  spawn = require("child_process").spawn,

  existsSync = fs.existsSync || path.existsSync,
  red = '\033[31m',
  magenta = '\033[35m',
  cyan = '\033[36m',
  blue = '\033[34m',
  yellow = '\033[33m',
  white = '\033[37m',
  reset = '\033[0m',

  okColor = cyan,
  textColor = white,
  errorColor = red,

  nodeVersionPreset = [
    "0.6.0",
    "0.8.23",
    "0.10.31",
    "4.4.4"
  ],
  expectedNodeVersion,
  command = process.argv.pop(),
  pacakgeJSON,
  nvmPath,
  userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
  nvmFolders = [userHome + "/.nvm", userHome + "~/nvm"],
  currentPath,
  taskIndex = 0,
  tasks = [

    {
      description: "installing grunt-cli to your current node version",
      runOnce: true,
      method: function (next) {
        exec(
          "npm install -g grunt-cli",
          { cwd: currentPath },
          function (error, stdout, stderr) {
            log(stdout);
            if (error) {
              log(error);
              log(errorColor + "something went wrong. Please talk to JS devs");
            } else {
              next();
            }

          });
      }
    },

    {
      description: "loading the package.json",
      method: function (next) {

        fs.readFile(currentPath + "package.json", "utf-8", function (err, data) {
          if (err) {
            throw err;
          }

          pacakgeJSON = JSON.parse(data);
          console.log("done!");
          next();
        });
      }
    },

    {
      description: "checking if nvm is installed",
      method: function (next) {

        var exists = false;
        nvmFolders.forEach(function (path) {

          if (existsSync(path)) {
            exists = true;
            nvmPath = path;
            return false;
          }
        });

        if (exists) {
          console.log("done! nvm is installed :D");
          next();
        } else {
          console.log("done! nvm isn't installed :( please install it - https://github.com/creationix/nvm");
        }
      }
    },

    {
      description: "finding the right node version",
      method: function (next) {


        function findRightNodeVersion(callback) {

          exec("npm install semver", function () {

            var semver = require("semver");

            exec("source " + nvmPath + "/nvm.sh && nvm ls", {
              cwd: currentPath
            }, function (error, stdout, stderr) {

              if (error) {
                return log(errorColor + error);
              }

              var
                versions = stdout.match(/v\d.\d+.\d+/gi),
                checkingVersions;

              if (versions && versions.length) {
                checkingVersions = versions.concat(nodeVersionPreset);
              } else {
                checkingVersions = nodeVersionPreset;
              }

              expectedNodeVersion = semver.maxSatisfying(checkingVersions, pacakgeJSON.engines.node);

              if (expectedNodeVersion) {
                log(textColor + "the expected node version is " + okColor + expectedNodeVersion);
                log("done!");
                callback();
              } else {
                log(errorColor + "Can't find the right node version. Please talk to JS devs");
              }

            });
          });
        }

        findRightNodeVersion(function () {
          next();
        });


      }
    },

    {
      description: "removing \"node_modules\" if it exists",
      method: function (next) {

        exec("rm -rf node_modules",
          { cwd: currentPath },
          function (error, stdout, stderr) {

            if (stderr.length) {
              log("stderr: " + stderr);
            }

            if (error) {
              return log(errorColor + error);
            }

            log('done!');
            next();
          });
      }
    },

    {
      description: "installing the right node version",
      method: function (next) {
        exec(
            "source " + nvmPath + "/nvm.sh" + " && nvm install " + expectedNodeVersion + " && nvm use " + expectedNodeVersion,
          { cwd: currentPath },
          function (error, stdout, stderr) {
            log(stdout);
            if (error) {
              log(errorColor + error);
              log(errorColor + "something went wrong. Please talk to JS devs");
            } else {
              next();
            }

          });
      }
    },

    {
      description: "updating npm",
      method: function (next) {
        exec(
          "source " + nvmPath + "/nvm.sh" + " && nvm use " + expectedNodeVersion + " && npm install -g npm",
          { cwd: currentPath },
          function (error, stdout, stderr) {
            log(stdout);
            if (error) {
              log(errorColor + error);
            } else {
              console.log("done!");
              next();
            }
          });
      }
    },

    {
      description: "reinstalling node modules",
      method: function (next) {

        var
          command = "source " + nvmPath + "/nvm.sh" + " && nvm use " + expectedNodeVersion + " && npm install",
          partialOutput = "",
          child;

        log("running: " + command);

        child = exec(
          command,
          { cwd: currentPath },
          function (error, stdout, stderr) {

            log(partialOutput);
            log(stdout);
            if (error) {
              log(errorColor + "something went wrong. Please talk to JS devs");
            } else {
              log("done!");
              next();
            }

          });

        child.stderr.on('data', function (data) {
          partialOutput += data.toString();
          //wait till each section of the log will be long enough
          if (partialOutput.length > 500) {
            log(partialOutput);
            partialOutput = "";
          }
        });

      }
    }

  ];


function log(str) {
  process.stderr.write(str + reset + "\n");

}

function runNext(allDoneHandler) {

  var task = tasks[taskIndex++];

  if (typeof allDoneHandler === "function") {
    runNext.allDoneHandler = allDoneHandler;
  }

  if (task) {

    if (task.runOnce && task.called) {
      runNext();
    } else {
      log(okColor + "task: " + textColor + task.description);
      task.called = true;
      task.method(runNext);
    }

  } else if (typeof runNext.allDoneHandler === "function") {

    taskIndex = 0;
    var temp = runNext.allDoneHandler;
    runNext.allDoneHandler = null;
    temp();
  }

}


function initAllPlugins(callback) {

  var
    path = __dirname + "/plugins",
    folders;

  function goToNextFolder() {

    if (folders.length > 0) {
      var folderName = folders.pop();
      if (folderName.indexOf("docpad-plugin") === 0) {
        log("\n\n");
        log(okColor + "found \"" + reset + folderName + okColor + "\", start reloading node modules")
        log("------------------------------------------------------------------------");
        currentPath = "plugins/" + folderName + "/";
        runNext(goToNextFolder);
      } else {
        goToNextFolder();
      }
    } else {
      callback();
    }
  }

  if (existsSync(path)) {

    fs.readdir(path, function (err, _folders) {

      if (err) {
        log(okColor + "somehow plugins folder isn't accessible");
        next();
        return;
      }

      folders = _folders;
      goToNextFolder();
    });

  } else {
    log("you don't have any site specific plugins :)");
    callback();
  }
}


function init() {
  currentPath = "./";
  log("\n" + okColor + "Setting up: " + __dirname);
  log("-----------------------------------------------------------");
  runNext(function () {
    log("running " + okColor + "\"grunt prepare\"");
    exec("grunt prepare", function (error, stdout, stderr) {
      if (error) {
        log(errorColor + error);
      }
      log(stdout);
    });
  });
}

init();