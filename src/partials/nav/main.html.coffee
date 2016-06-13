path = @document.relativeDirPath

render = (items)->
  ul ->
    items.forEach (item, index)->

      if item.noRender
        return

      if item.navPath
        url = '/' + item.navPath
      else if item.external
        url = item.path
      else
        url = '/' + item.path

      if item.newTab
        target = '_blank'
      else
        target = '_self'

      navClass = ''
      if item.class
        navClass += item.class
      if path.indexOf(item.path) isnt -1
        navClass += ' active'

      li class: navClass, ->
        a href: url, target: target, ->
          if item.title
            text item.title

        if item.children
          render item.children

render @nav
