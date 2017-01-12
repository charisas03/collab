(function() {

  function throttle(fn, delay, scope) {
    delay = delay || 250;
    var last, defer;
    return function() {
      var context = scope || this,
        now = +new Date(),
        args = arguments;
      if (last && now < last + delay) {
        clearTimeout(defer);
        defer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, delay);
      } else {
        last = now;
        fn.apply(context, args);
      }
    }
  }

  function extend(destination, source) {
    for (var k in source) {
      if (source.hasOwnProperty(k)) {
        destination[k] = source[k];
      }
    }
    return destination;
  }

  var ScrollManager = (function() {

    var defaults = {

        steps: null,
        navigationContainer: null,
        links: null,
        scrollToTopBtn: null,

        navigationElementClass: '.Quick-navigation',
        currentStepClass: 'current',
        smoothScrollEnabled: true,
        stepsCheckEnabled: true,

        // Callbacks
        onScroll: null,

        onStepChange: function(step) {
          var self = this;
          var relativeLink = [].filter.call(options.links, function(link) {
            link.classList.remove(self.currentStepClass);
            return link.hash === '#' + step.id;
          });
          relativeLink[0].classList.add(self.currentStepClass);
        },

        // Provides a default scroll animation
        smoothScrollAnimation: function(target) {
          $('html, body').animate({
            scrollTop: target
          }, 'slow');
        }
      },

      options = {};

    // Privates
    var _animation = null,
      currentStep = null,
      throttledGetScrollPosition = null;

    return {

      scrollPosition: 0,

      init: function(opts) {

        options = extend(defaults, opts);

        if (options.steps === null) {
          console.warn('Smooth scrolling require some sections or steps to scroll to :)');
          return false;
        }

        _animation = function(target) {
          target = typeof target === 'number' ? target : $(target).offset().top;
          return options.smoothScrollAnimation(target);
        };

        // Activate smooth scrolling
        if (options.smoothScrollEnabled) this.smoothScroll();

        // Scroll to top handling
        if (options.scrollToTopBtn) {
          options.scrollToTopBtn.addEventListener('click', function() {
            options.smoothScrollAnimation(0);
          });
        }

        // Throttle 
        throttledGetScrollPosition = throttle(this.getScrollPosition).bind(this);
        window.addEventListener('scroll', throttledGetScrollPosition);
        window.addEventListener('resize', throttledGetScrollPosition);

        this.getScrollPosition();
      },

      getScrollPosition: function() {
        this.scrollPosition = window.pageYOffset || window.scrollY;
        if (options.stepsCheckEnabled) this.checkActiveStep();
        if (typeof options.onScroll === 'function') options.onScroll(this.scrollPosition);
      },

      scrollPercentage: function() {
        var body = document.body,
          html = document.documentElement,
          documentHeight = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);

        var percentage = Math.round(this.scrollPosition / (documentHeight - window.innerHeight) * 100);
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        return percentage;
      },

      doSmoothScroll: function(e) {
        if (e.target.nodeName === 'A') {
          e.preventDefault();
          if (location.pathname.replace(/^\//, '') === e.target.pathname.replace(/^\//, '') && location.hostname === e.target.hostname) {
            var targetStep = document.querySelector(e.target.hash);
            targetStep ? _animation(targetStep) : console.warn('Hi! You should give an animation callback function to the Scroller module! :)');
          }
        }
      },

      smoothScroll: function() {
        if (options.navigationContainer !== null) options.navigationContainer.addEventListener('click', this.doSmoothScroll);
      },

      checkActiveStep: function() {
        var scrollPosition = this.scrollPosition;

        [].forEach.call(options.steps, function(step) {
          var bBox = step.getBoundingClientRect(),
            position = step.offsetTop,
            height = position + bBox.height;

          if (scrollPosition >= position && scrollPosition < height && currentStep !== step) {
            currentStep = step;
            step.classList.add(self.currentStepClass);
            if (typeof options.onStepChange === 'function') options.onStepChange(step);
          }
          step.classList.remove(options.currentStepClass);
        });
      },

      destroy: function() {
        window.removeEventListener('scroll', throttledGetScrollPosition);
        window.removeEventListener('resize', throttledGetScrollPosition);
        options.navigationContainer.removeEventListener('click', this.doSmoothScroll);
      }
    }
  })();

  var scrollToTopBtn = document.querySelector('.Scroll-to-top'),
    steps = document.querySelectorAll('.js-scroll-step'),
    navigationContainer = document.querySelector('.Quick-navigation'),
    links = navigationContainer.querySelectorAll('a'),
    progressIndicator = document.querySelector('.Scroll-progress-indicator');

  ScrollManager.init({
    steps: steps,
    scrollToTopBtn: scrollToTopBtn,
    navigationContainer: navigationContainer,
    links: links,

    // Customize onScroll behavior
    onScroll: function() {
      var percentage = ScrollManager.scrollPercentage();
      percentage >= 90 ? scrollToTopBtn.classList.add('visible') : scrollToTopBtn.classList.remove('visible');

      if (percentage >= 10) {
        progressIndicator.innerHTML = percentage + "%";
        progressIndicator.classList.add('visible');
      } else {
        progressIndicator.classList.remove('visible');
      }
    },


  });



})();

function autoType(elementClass, typingSpeed){
  var thhis = $(elementClass);
  thhis.css({
    "position": "relative",
    "display": "inline-block"
  });
  thhis.prepend('<div class="cursor" style="right: initial; left:0;"></div>');
  thhis = thhis.find(".text-js");
  var text = thhis.text().trim().split('');
  var amntOfChars = text.length;
  var newString = "";
  thhis.text("|");
  setTimeout(function(){
    thhis.css("opacity",1);
    thhis.prev().removeAttr("style");
    thhis.text("");
    for(var i = 0; i < amntOfChars; i++){
      (function(i,char){
        setTimeout(function() {
          newString += char;
          thhis.text(newString);
        },i*typingSpeed);
      })(i+1,text[i]);
    }
  },1500);
}

$(document).ready(function(){
  autoType(".type-js",200);


});
