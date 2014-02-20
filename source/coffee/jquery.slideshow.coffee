# Slideshow class
class Slideshow

  defaults:

    # animation
    duration: 1500
    interval: 4000
    easing: 'easeInOutQuint'

    # position
    center: false

    # layer
    backgroundColor: 'black'
    opacity: 0.5

    # controller
    icon: false
    iconName: 'angle'
    iconSize: 5
    iconColor: '#fff'
    iconPositionHorizon: '5%'

  constructor: ($el, options) ->

    @options = $.extend {}, @defaults, options

    # get jQuery object
    @$window = $ window
    @$windowWidth = @$window.width()
    @$slider = $el
    @$ul = @$slider.find 'ul'
    @$li = @$ul.find 'li'
    @$img = @$ul.find 'img'

    @len = @$li.length - 1
    @$imgAlign = @$img.css 'vertical-align'

    # image position setting
    if @$imgAlign isnt 'bottom'
      @$img
        .css
          'vertical-align': 'bottom'

    @lw = @$li.width()
    @lh = @$li.height()

    @$leftlayer = ''
    @$rightLayer = ''

    @iconLeft = 'fa-' + @options.iconName + '-left'
    @iconRight = 'fa-' + @options.iconName + '-right'
    @iconSize = 'fa-' + @options.iconSize + 'x'
    @$leftIcon = ''
    @$rightIcon = ''

    @$start = $ '#start'
    @$stop = $ '#stop'

    @slideTimer = ''
    @running = false
    @slideRunning = false

    # task run
    @init()
    @start()
    @stop()
    @next()
    @prev()
    @windowResize()

  init: ->
    if @options.center
      @$slider
        .css
          width: @lw
          height: @lh
          overflow: 'hidden'
          margin: '0 auto'
      @$ul
        .css
          width: @lw * 2
    else
      @$slider
        .css
          width: '100%'
          height: @lh
          overflow: 'hidden'
          position: 'relative'
      @$ul
        .css
          position: 'absolute'
      @$li
        .eq @len
        .remove()
        .prependTo @$ul

      @layer()
      @resize()
    @

  layer: ->
    i = 0
    while i < 2
      $layer = $ '<div class="layer"></div>'
      $layer
        .css
          height: '100%'
          'background-color': @options.backgroundColor
          opacity: @options.opacity
          position: 'absolute'
        .insertAfter @$ul

      if @options.icon
        $i = $ '<i></i>'
        $i
          .addClass 'fa'
          .addClass @iconSize
          .css
            color: @options.iconColor
            position: 'absolute'
            top: '50%'
          .appendTo $layer
      i++

    @$leftLayer = 
      @$slider
        .find '.layer'
        .eq 0
    @$rightLayer = 
      @$slider
        .find '.layer'
        .eq 1

    if @options.icon

      @$leftIcon = @$leftLayer
        .find 'i'
      @$rightIcon = @$rightLayer
        .find 'i'

      @$leftIcon
        .addClass @iconLeft

      @$rightIcon
        .addClass @iconRight

      height = @$leftIcon.height()

      @$leftIcon
        .css
          'margin-top': - height / 2
          left: @options.iconPositionHorizon

      @$rightIcon
        .css
          'margin-top': - height / 2
          right: @options.iconPositionHorizon
    @

  windowResize: ->
    @$window.resize =>
        @resize() if !@options.center
    @

  resize: ->
    @$windowWidth = @$window.width()

    @$ul
      .css
        width: @lw * 4
        left: -(@lw - (@$windowWidth - @lw) / 2)

    @$leftLayer
      .css
        width: (@$windowWidth - @lw) / 2
        left: 0
    @$rightLayer
      .css
        width: (@$windowWidth - @lw) / 2
        right: 0

    if @$windowWidth < @lw + @$leftIcon.width() * 4
      @$slider
        .find 'i'
        .css
          'display': 'none'
    else 
      @$slider
        .find 'i'
        .css
          'display': 'block'
    @

  slide: =>
    @$ul.animate
      'margin-left': -@lw
    , @options.duration, @options.easing, @_callback
    @

  _callback: =>
    @$ul
      .css
        'margin-left': 0
      .find 'li'
      .eq 0
      .remove()
      .appendTo @$ul
    @slideRunning = false
    @

  next: ->
    @$leftLayer
      .find 'i'
      .click =>
        return if @slideRunning
        @slideRunning = true
        clearInterval @slideTimer
        @slide()
        @slideTimer = setInterval @slide, @options.interval
        @
    @

  prev: ->
    @$rightLayer
      .find 'i'
      .click =>
        return if @slideRunning
        @slideRunning = true
        clearInterval @slideTimer
        @prevSlide()
        @slideTimer = setInterval @slide, @options.interval
        @
    @

  prevSlide: ->
    @$ul
      .css
        left: (@$windowWidth - @lw) / 2 - @lw * 2 
      .find 'li'
        .eq @len
          .remove()
            .prependTo @$ul
          .end()
        .end()
      .end()
      .animate
        'margin-left': @lw
      , @options.duration, @options.easing, @_prevCallback
    @

  _prevCallback: =>
    @$ul
      .css
        left: (@$windowWidth - @lw) / 2 - @lw
        'margin-left': 0
    @slideRunning = false
    @

  start: ->
    return if @running
    @running = true
    @slideTimer = setInterval @slide, @options.interval
    @

  stop: ->
    @$stop.click =>
      # return false if !@running
      # @running = false
      clearInterval @slideTimer
      @

# jQuery plugin setting
$.fn.slideshow = (options) ->
  $el = @
  slideshow = new Slideshow $el, options
  return
