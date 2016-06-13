# Vault Plugin
# Inspired by docpad Feedr plugin
# Originaly by: Bevry Pty Ltd <us@bevry.me> (http://bevry.me)
# See: https://github.com/bevry/docpad-extras/tree/master/plugins/feedr

# Export Plugin
module.exports = (BasePlugin) ->
  # Requires
  balUtil = require('bal-util')
  request = require('request')
  _ = require('underscore')
  path = require('path')
  fs = require('fs')

  # Define Plugin
  class VaultPlugin extends BasePlugin
    # Plugin Name
    name: 'vault'

    # Render Before
    # Read the feeds here
    extendTemplateData: ({templateData}, next) ->
      # Prepare
      vault = @
      resources = @config.resources or {}
      templateData.vault =
        resources: {}

      # Tasks
      tasks = new balUtil.Group (err) ->
        return next?(err)

      # Resources
      _.each resources, (resourceData, resourceName) ->
        tasks.push ->
          vault.readResource resourceName, resourceData, (err, body) ->
            return tasks.complete(err)  if err
            templateData.vault.resources[resourceName] = body
            return tasks.complete(err)

      # Async
      tasks.async()

    # Read Resource
    readResource: (resourceName, resourceData, next) ->

      # Prepare
      resourceData.path = "/tmp/docpad-vault-#{resourceName}"

      # Write the Resource
      writeResource = (body) ->
        # Store the parsed data in the cache somewhere
        fs.writeFile resourceData.path, body, (err) ->
          # Check
          return next?(err)  if err

          # Return the parsed data
          return next?(null, body)

      # Get the file via reading the cached copy
      viaCache = ->
        # Check the the file exists
        path.exists resourceData.path, (exists) ->
          # Check it exists
          return next?()  unless exists

          # It does exist, so let's continue to read the cached fie
          fs.readFile resourceData.path, (err, data) ->
            # Check
            return next?(err)  if err

            # Parse the cached data
            body = data.toString()

            # Rreturn the parsed cached data
            return next?(null, body)

      # Get the resource via doing a new request
      viaRequest = ->
        request resourceData.url, (err, response, body) ->

          # If the request fails then we should revert to the cache
          return viaCache()  if err

          # Trim the requested data
          body = body.trim()

          # Store the data on disk
          writeResource(body)

      # Check if we should get the data from the cache or do a new request
      balUtil.isPathOlderThan resourceData.path, 1000*60*5, (err, older) ->
        # Check
        return next?(err)  if err

        # The file doesn't exist, or exists and is old
        if older is null or older is true
          # Refresh
          viaRequest()
        # The file exists and relatively new
        else
          # Get from cache
          viaCache()

      # Chain
      @