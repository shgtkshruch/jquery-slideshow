(function() {
  var Slideshow,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Slideshow = (function() {
    Slideshow.prototype.defaults = {
      duration: 1500,
      interval: 4000,
      easing: 'easeInOutQuint',
      center: false,
      backgroundColor: 'black',
      opacity: 0.5,
      icon: false,
      iconName: 'angle',
      iconSize: 5,
      iconColor: '#fff',
      iconPositionHorizon: '5%'
    };

    function Slideshow($el, options) {
      this._prevCallback = __bind(this._prevCallback, this);
      this._callback = __bind(this._callback, this);
      this.slide = __bind(this.slide, this);
      this.options = $.extend({}, this.defaults, options);
      this.$window = $(window);
      this.$windowWidth = this.$window.width();
      this.$slider = $el;
      this.$ul = this.$slider.find('ul');
      this.$li = this.$ul.find('li');
      this.$img = this.$ul.find('img');
      this.len = this.$li.length - 1;
      this.$imgAlign = this.$img.css('vertical-align');
      if (this.$imgAlign !== 'bottom') {
        this.$img.css({
          'vertical-align': 'bottom'
        });
      }
      this.lw = this.$li.width();
      this.lh = this.$li.height();
      this.$leftlayer = '';
      this.$rightLayer = '';
      this.iconLeft = 'fa-' + this.options.iconName + '-left';
      this.iconRight = 'fa-' + this.options.iconName + '-right';
      this.iconSize = 'fa-' + this.options.iconSize + 'x';
      this.$leftIcon = '';
      this.$rightIcon = '';
      this.$start = $('#start');
      this.$stop = $('#stop');
      this.slideTimer = '';
      this.running = false;
      this.slideRunning = false;
      this.init();
      this.start();
      this.stop();
      this.next();
      this.prev();
      this.windowResize();
    }

    Slideshow.prototype.init = function() {
      if (this.options.center) {
        this.$slider.css({
          'width': this.lw,
          'height': this.lh,
          'overflow': 'hidden',
          'margin': '0 auto'
        });
        this.$ul.css({
          'width': this.lw * 2
        });
      } else {
        this.$slider.css({
          'width': '100%',
          'height': this.lh,
          'overflow': 'hidden',
          'position': 'relative'
        });
        this.$ul.css({
          'position': 'absolute'
        });
        this.$li.eq(this.len).remove().prependTo(this.$ul);
        this.layer();
        this.resize();
      }
      return this;
    };

    Slideshow.prototype.layer = function() {
      var $i, $layer, height, i;
      i = 0;
      while (i < 2) {
        $layer = $('<div class="layer"></div>');
        $layer.css({
          'height': '100%',
          'background-color': this.options.backgroundColor,
          'opacity': this.options.opacity,
          'position': 'absolute'
        }).insertAfter(this.$ul);
        if (this.options.icon) {
          $i = $('<i></i>');
          $i.addClass('fa').addClass(this.iconSize).css({
            'color': this.options.iconColor,
            'position': 'absolute',
            'top': '50%'
          }).appendTo($layer);
        }
        i++;
      }
      this.$leftLayer = this.$slider.find('.layer').eq(0);
      this.$rightLayer = this.$slider.find('.layer').eq(1);
      if (this.options.icon) {
        this.$leftIcon = this.$leftLayer.find('i');
        this.$rightIcon = this.$rightLayer.find('i');
        this.$leftIcon.addClass(this.iconLeft);
        this.$rightIcon.addClass(this.iconRight);
        height = this.$leftIcon.height();
        this.$leftIcon.css({
          'margin-top': -height / 2,
          'left': this.options.iconPositionHorizon
        });
        this.$rightIcon.css({
          'margin-top': -height / 2,
          'right': this.options.iconPositionHorizon
        });
      }
      return this;
    };

    Slideshow.prototype.windowResize = function() {
      this.$window.resize((function(_this) {
        return function() {
          if (!_this.options.center) {
            return _this.resize();
          }
        };
      })(this));
      return this;
    };

    Slideshow.prototype.resize = function() {
      this.$windowWidth = this.$window.width();
      this.$ul.css({
        'width': this.lw * 4,
        'left': -(this.lw - (this.$windowWidth - this.lw) / 2)
      });
      this.$leftLayer.css({
        'width': (this.$windowWidth - this.lw) / 2,
        'left': 0
      });
      this.$rightLayer.css({
        'width': (this.$windowWidth - this.lw) / 2,
        'right': 0
      });
      if (this.$windowWidth < this.lw + this.$leftIcon.width() * 4) {
        this.$slider.find('i').css({
          'display': 'none'
        });
      } else {
        this.$slider.find('i').css({
          'display': 'block'
        });
      }
      return this;
    };

    Slideshow.prototype.slide = function() {
      this.$ul.animate({
        'margin-left': -this.lw
      }, this.options.duration, this.options.easing, this._callback);
      return this;
    };

    Slideshow.prototype._callback = function() {
      this.$ul.css({
        'margin-left': 0
      }).find('li').eq(0).remove().appendTo(this.$ul);
      this.slideRunning = false;
      return this;
    };

    Slideshow.prototype.next = function() {
      this.$leftLayer.find('i').click((function(_this) {
        return function() {
          if (_this.slideRunning) {
            return;
          }
          _this.slideRunning = true;
          clearInterval(_this.slideTimer);
          _this.slide();
          _this.slideTimer = setInterval(_this.slide, _this.options.interval);
          return _this;
        };
      })(this));
      return this;
    };

    Slideshow.prototype.prev = function() {
      this.$rightLayer.find('i').click((function(_this) {
        return function() {
          if (_this.slideRunning) {
            return;
          }
          _this.slideRunning = true;
          clearInterval(_this.slideTimer);
          _this.prevSlide();
          _this.slideTimer = setInterval(_this.slide, _this.options.interval);
          return _this;
        };
      })(this));
      return this;
    };

    Slideshow.prototype.prevSlide = function() {
      this.$ul.css({
        'left': (this.$windowWidth - this.lw) / 2 - this.lw * 2
      }).find('li').eq(this.len).remove().prependTo(this.$ul);
      this.$ul.animate({
        'margin-left': this.lw
      }, this.options.duration, this.options.easing, this._prevCallback);
      return this;
    };

    Slideshow.prototype._prevCallback = function() {
      this.$ul.css({
        'left': (this.$windowWidth - this.lw) / 2 - this.lw,
        'margin-left': 0
      });
      this.slideRunning = false;
      return this;
    };

    Slideshow.prototype.start = function() {
      if (this.running) {
        return;
      }
      this.running = true;
      this.slideTimer = setInterval(this.slide, this.options.interval);
      return this;
    };

    Slideshow.prototype.stop = function() {
      return this.$stop.click((function(_this) {
        return function() {
          clearInterval(_this.slideTimer);
          return _this;
        };
      })(this));
    };

    return Slideshow;

  })();

  $.fn.slideshow = function(options) {
    var $el, slideshow;
    $el = this;
    slideshow = new Slideshow($el, options);
  };

}).call(this);
