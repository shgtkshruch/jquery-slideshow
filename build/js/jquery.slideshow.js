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
      opacity: 0.5
    };

    function Slideshow($el, options) {
      this._callback = __bind(this._callback, this);
      this.slide = __bind(this.slide, this);
      this.options = $.extend({}, this.defaults, options);
      this.$window = $(window);
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
      this.$start = $('#start');
      this.$stop = $('#stop');
      this.slideShow = '';
      this.running = false;
      this.init();
      this.windowResize();
      this.start();
      this.stop();
    }

    Slideshow.prototype.init = function() {
      var $layer, i;
      if (this.options.center) {
        this.$slider.css({
          'width': this.lw,
          'height': this.lh,
          'overflow': 'hidden',
          'margin': '0 auto'
        });
        return this.$ul.css({
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
        i = 0;
        while (i < 2) {
          $layer = $('<div class="layer"></div>');
          $layer.css({
            'height': '100%',
            'background-color': this.options.backgroundColor,
            'opacity': this.options.opacity,
            'position': 'absolute'
          }).insertAfter(this.$ul);
          i++;
        }
        this.$leftlayer = this.$slider.find('.layer').eq(0);
        this.$rightLayer = this.$slider.find('.layer').eq(1);
        return this.resize();
      }
    };

    Slideshow.prototype.windowResize = function() {
      return this.$window.resize((function(_this) {
        return function() {
          if (!_this.options.center) {
            return _this.resize();
          }
        };
      })(this));
    };

    Slideshow.prototype.resize = function() {
      var windowWidth;
      windowWidth = this.$window.width();
      this.$ul.css({
        'width': this.lw * 4 + this.lw / 2,
        'left': -(this.lw - (windowWidth - this.lw) / 2)
      });
      this.$leftlayer.css({
        'width': (windowWidth - this.lw) / 2,
        'left': 0
      });
      return this.$rightLayer.css({
        'width': (windowWidth - this.lw) / 2,
        'right': 0
      });
    };

    Slideshow.prototype.slide = function() {
      this.$ul.animate({
        'margin-left': -this.lw
      }, this.options.duration, this.options.easing, this._callback);
      return this;
    };

    Slideshow.prototype._callback = function() {
      return this.$ul.css({
        'margin-left': 0
      }).find('li').eq(0).remove().appendTo(this.$ul);
    };

    Slideshow.prototype.start = function() {
      if (this.running) {
        return;
      }
      this.running = true;
      this.slideShow = setInterval(this.slide, this.options.interval);
      return this;
    };

    Slideshow.prototype.stop = function() {
      return this.$stop.click((function(_this) {
        return function() {
          if (!_this.running) {
            return false;
          }
          _this.running = false;
          clearInterval(_this.slideShow);
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
