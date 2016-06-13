doctype 'xml'
prodUrl = @site.url


urlset xmlns:'http://www.sitemaps.org/schemas/sitemap/0.9', ->

  iterator = (items) ->

    items.forEach (item) ->

      if item.navPath or item.external
        if item.children
          iterator item.children
          return
        else
          return

      url ->
        loc prodUrl + '/' + item.path
        changefreq 'weekly'

      if item.children
        iterator item.children

  iterator @nav
