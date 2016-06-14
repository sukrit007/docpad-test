# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON

vaultUrl = 'http://vault.meltmedia.com/public/resource/'
pkg = require "./package.json"

module.exports =

  useCustomErrors: true
  prompts: false
  checkVersion: false

  # =================================
  # Template Data
  # These are variables that will be accessible via our templates
  # To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

  templateData:
    # Global site settings
    site:

      # The production url of our website
      url: "http://cadmium.local:8080"

      # The default title of our website
      title: "Docpad Test"

      # 404 page we want to use as default
      errorPage: "404.html"

    getYaml: ->
      @yaml or= require "js-yaml"

  collections:
     pages: ->
       @getCollection("html").findAllLive().on "add", (model) ->
         if model.get("fullPath").match(/\/src\/documents\//)
           model.setMetaDefaults
             layout: "default"

  events:

    renderBefore: ({collection, templateData})->

      if @docpad.getEnvironment() isnt "production"
        collection.each (item)->
          item.set("dynamic", true) if !item.get("fullPath").match(/\/src\/files\//)


  plugins:

    jshint:
      ignorePaths: ["lib"]
      ignoreFiles: ["js/app.js"]

    nodesass:
      environments:
        production:
          outputStyle: "compressed"
        development:
          debugInfo: "map"
          renderUnderscoreStylesheets: true
          sourceMap: "src/documents/css/"

    coffeekup:
      environments:
        development:
          coffeecup:
            format: false

    proxy:
      proxies:
        meltmediaApi:
          path: /^\/system\/.+/
          domain: pkg.proxy
    
    vault:
      resources:
        'gazyva_hcp_ind_fl':
          'url': vaultUrl + '61df1d0e-124c-483a-84f3-c026b933beef'

  regenerateDelay: 500

  warnUncompiledPrivatePlugins : false
