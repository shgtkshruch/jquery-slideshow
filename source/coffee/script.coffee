$ ->
  $window = $ window
  $slider = $ '#slider'
  $ul = $slider.find 'ul'
  $li = $ul.find 'li'
  listLength = $li.length - 1
  lw = $li.width()

  $leftlayer = ''
  $rightLayer = ''

  $start = $ '#start'
  $stop = $ '#stop'

  slideShow = ''
  running = false

  options =
    # animation
    duration: 1000
    interval: 4000
    easing: 'easeOutQuad'

    center: false

  init = ->
    if options.center
      $slider
        .css
          'width': lw
          'margin': '0 auto'
        .find 'ul'
        .css
          'width': lw * 2
    else
      windowWidth = $window.width()
      i = 0
      while i < 2
        $layer = $ '<div class="layer"></div>'
        $layer.insertAfter $ul
        i++

      $leftlayer = $slider
        .find '.layer'
        .eq 0
      $rightLayer = $slider
        .find '.layer'
        .eq 1

      $ul
        .find 'li'
        .eq listLength
        .remove()
        .prependTo $ul

      resizeWindow()

  $window
    .resize ->
      resizeWindow() if !options.center

  resizeWindow = ->
    windowWidth = $window.width()

    $ul
      .css
        'width': lw * 4 + lw / 2
        'left': -(lw - (windowWidth - lw) / 2)

    $leftlayer
      .css
        'width': (windowWidth - lw) / 2
        'left': 0
    $rightLayer
      .css
        'width': (windowWidth - lw) / 2
        'right': 0

  slide = ->
    $ul.animate
      'margin-left': -960
    , options.duration, options.easing, callback

  callback = ->
    $ul
      .css
        'margin-left': 0
      .find 'li'
      .eq 0
      .remove()
      .appendTo $ul

  init()

  $start.click ->
    return if running
    running = true
    slideShow = setInterval slide, options.interval

  $stop.click ->
    false if !running
    running = false
    clearInterval slideShow
    @
