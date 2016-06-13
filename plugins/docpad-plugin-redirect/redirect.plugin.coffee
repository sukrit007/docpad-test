module.exports = (BasePlugin) ->
  _ = require "underscore"
  fs = require "fs"

  # Define Plugin
  class Redirect extends BasePlugin

      # Plugin name
    name: "redirect"
    server: null

    setRedirect: (data)->
      data = JSON.parse(data)
      server = @server
      _.each data, (d)->
        server.get  d.path, (req, res)->
          res.redirect d.url

    serverExtend: ({server})->
      _this = @
      @server = server
      fs.readFile "#{@docpad.config.srcPath}/files/META-INF/redirect.json", "utf8", (err, data) ->
        return if err isnt null
        _this.setRedirect(data)
