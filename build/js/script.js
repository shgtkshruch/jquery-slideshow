(function() {
  $(function() {
    var $leftlayer, $li, $rightLayer, $slider, $start, $stop, $ul, $window, callback, init, listLength, lw, options, resizeWindow, running, slide, slideShow;
    $window = $(window);
    $slider = $('#slider');
    $ul = $slider.find('ul');
    $li = $ul.find('li');
    listLength = $li.length - 1;
    lw = $li.width();
    $leftlayer = '';
    $rightLayer = '';
    $start = $('#start');
    $stop = $('#stop');
    slideShow = '';
    running = false;
    options = {
      duration: 1000,
      interval: 4000,
      easing: 'easeOutQuad',
      center: false
    };
    init = function() {
      var $layer, i, windowWidth;
      if (options.center) {
        return $slider.css({
          'width': lw,
          'margin': '0 auto'
        }).find('ul').css({
          'width': lw * 2
        });
      } else {
        windowWidth = $window.width();
        i = 0;
        while (i < 2) {
          $layer = $('<div class="layer"></div>');
          $layer.insertAfter($ul);
          i++;
        }
        $leftlayer = $slider.find('.layer').eq(0);
        $rightLayer = $slider.find('.layer').eq(1);
        $ul.find('li').eq(listLength).remove().prependTo($ul);
        return resizeWindow();
      }
    };
    $window.resize(function() {
      if (!options.center) {
        return resizeWindow();
      }
    });
    resizeWindow = function() {
      var windowWidth;
      windowWidth = $window.width();
      $ul.css({
        'width': lw * 4 + lw / 2,
        'left': -(lw - (windowWidth - lw) / 2)
      });
      $leftlayer.css({
        'width': (windowWidth - lw) / 2,
        'left': 0
      });
      return $rightLayer.css({
        'width': (windowWidth - lw) / 2,
        'right': 0
      });
    };
    slide = function() {
      return $ul.animate({
        'margin-left': -960
      }, options.duration, options.easing, callback);
    };
    callback = function() {
      return $ul.css({
        'margin-left': 0
      }).find('li').eq(0).remove().appendTo($ul);
    };
    init();
    $start.click(function() {
      if (running) {
        return;
      }
      running = true;
      return slideShow = setInterval(slide, options.interval);
    });
    return $stop.click(function() {
      if (!running) {
        false;
      }
      running = false;
      clearInterval(slideShow);
      return this;
    });
  });

}).call(this);
