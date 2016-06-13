fs = require "fs"
YAML = require "js-yaml"
_ = require "underscore"
nvaRoot = null
main = null
navRoot = null

getObj = (fileName)->
  YAML.load(fs.readFileSync("#{navRoot}/#{fileName}", "utf8"))

initNav = ()->
  main = getObj "main.yml"
  if !main
    throw new Error("no main.yml for nav")
    return

  loopNav = (data)->

    if typeof data is "object"
      _.each data, (item, _key)->
        data[_key] = loopNav(item)
      data

    else if typeof data is "string" and data.indexOf("load:") is 0
      url = data.split("load:")[1]
      try
        newData = getObj url
        loopNav(newData)
      catch error
        console.warn(error)
        console.warn("This is happening because it's trying to load a yaml file that doesn't exist in the nav folder. Please check the line \"load:\" in your nav yaml files")

    else
      data

  loopNav main

module.exports =

  events:

    extendTemplateData: ({templateData}, next) ->

      navRoot = "#{@docpad.config.rootPath}/src/navs"
      templateData.nav = initNav()
      next()

    renderBefore: ({collection, templateData}, next)->

      collection.models.forEach (item)->
        if item.attributes.fullDirPath is navRoot
          templateData.nav = initNav()
      next()

