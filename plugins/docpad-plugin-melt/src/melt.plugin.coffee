fs = require "fs"
_ = require "underscore"

pluginUrl = "#{__dirname}/plugins"
plugins = []
handlers = {}

(fs.readdirSync pluginUrl).forEach (url)->
  plugins.push require(pluginUrl + "/" + url)

meltPlugin =
  name: "melt"

runHandlers = (eventType, opts, next)->

  i = 0
  _this = @
  methods = handlers[eventType]

  runHandler = () ->
    if i is methods.length
      next()
    else
      methods[i++].call _this, opts, runHandler

  if methods and methods.length > 0
    methods[i++].call _this, opts, runHandler
  else
    next();


plugins.forEach (item)->

  for own eventType, method of item.events

    handlers[eventType] or= []

    meltPlugin[eventType] or= ((type) ->

      (opts, next)->
        runHandlers.call @, type, opts, next

    )(eventType)


    handlers[eventType].push method


module.exports = (BasePlugin) ->

  class MeltPlugin extends BasePlugin
  _.extend MeltPlugin.prototype, meltPlugin

  MeltPlugin