
docpad-plugin-melt
==================

This plugin loads other sub plugins



## Install

This plugin is a private plugin so there it's not registered in NPM
To use this plugin, you have to add it to the dependencies of package.json of your project.



## Sub plugins

### Navigation
This plugins creates "navigation" object to the templateData of docpad. It's a tree object of the entire document. Each node is the page document.


### Util

This plugins does:
- Check the environment and add appropriate JS/CSS files to docpad blocks
- Set docpad configurations to optimize the site


### How to work with this project

First pull down the project

''git clone git@github.com:meltmedia/docpad-plugin-melt.git''

install npm modules

''npm install''

compile the app

''grunt compile''

run the watcher

''grunt''


You can link this project to existing docpad project for testing




