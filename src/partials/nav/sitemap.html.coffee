render = (items)->

  ul ->
    items.forEach (item, index)->
      if item.navPath
        url = '/' + item.navPath
      else if item.external
        url = item.path
      else
        url = '/' + item.path

      li ->
        a href: url, ->
          if item.title
            text item.title

        if item.children
          render item.children

render @nav
