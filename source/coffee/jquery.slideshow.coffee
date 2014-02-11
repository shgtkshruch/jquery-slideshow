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

  constructor: ($el, options) ->

    @options = $.extend {}, @defaults, options

    # get jQuery object
    @$window = $ window
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

    @$start = $ '#start'
    @$stop = $ '#stop'

    @slideShow = ''
    @running = false

    # task run
    @init()
    @windowResize()
    @start()
    @stop()

  init: ->
    if @options.center
      @$slider
        .css
          'width': @lw
          'height': @lh
          'overflow': 'hidden'
          'margin': '0 auto'
      @$ul
        .css
          'width': @lw * 2
    else
      @$slider
        .css
          'width': '100%'
          'height': @lh
          'overflow': 'hidden'
          'position': 'relative'
      @$ul
        .css
          'position': 'absolute'
      @$li
        .eq @len
        .remove()
        .prependTo @$ul

      i = 0
      while i < 2
        $layer = $ '<div class="layer"></div>'
        $layer
          .css
            'height': '100%'
            'background-color': @options.backgroundColor
            'opacity': @options.opacity
            'position': 'absolute'
          .insertAfter @$ul
        i++

      @$leftlayer = 
        @$slider
          .find '.layer'
          .eq 0
      @$rightLayer = 
        @$slider
          .find '.layer'
          .eq 1

      @resize()

  windowResize: ->
    @$window
      .resize =>
        @resize() if !@options.center

  resize: ->
    windowWidth = @$window.width()

    @$ul
      .css
        'width': @lw * 4 + @lw / 2
        'left': -(@lw - (windowWidth - @lw) / 2)

    @$leftlayer
      .css
        'width': (windowWidth - @lw) / 2
        'left': 0
    @$rightLayer
      .css
        'width': (windowWidth - @lw) / 2
        'right': 0

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

  start: ->
    return if @running
    @running = true
    @slideShow = setInterval @slide, @options.interval
    @

  stop: ->
    @$stop.click =>
      return false if !@running
      @running = false
      clearInterval @slideShow
      @

# jQuery plugin setting
$.fn.slideshow = (options) ->
  $el = @
  slideshow = new Slideshow $el, options
  return
