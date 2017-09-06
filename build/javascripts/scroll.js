var browser = {
	addEventListener : !!window.addEventListener,
  gravity : !!window.DeviceOrientationEvent,
  touch : ('ontouchstart' in window) || 
          window.DocumentTouch && document instanceof DocumentTouch,

  version: function() {
    var u = navigator.userAgent,
        androidVer;

    if (u.indexOf('Android') !== -1) {
        androidVer = u.substring(u.indexOf('Android') + 7, u.indexOf('Android') + 11).replace(' ', '');
    }
    return androidVer || 0;     // 0: not Android device
  }(),

  cssCore: function(obj) {
    switch (true) {
      case obj.webkitTransition === '':
      return 'webkit'; break;
      case obj.MozTransition === '':
      return 'Moz'; break;
      case obj.msTransition === '':
      return 'ms'; break;
      case obj.OTransition === '':
      return 'O'; break;
      default:
      return '';
    }
  }(document.body.style)
}

var _touch
if (!browser.touch && isWindowsPhone) {
	if (window.navigator.msPointerEnabled) {
		_touch = {
			start: 'MSPointerDown',
			move: 'MSPointerMove',
			end: 'MSPointerUp'
		}
	} else {
		_touch = {
			start: 'pointerDown',
			move: 'pointerMove',
			end: 'pointerUp'
		}
	}
} else {
	_touch = {
		start: 'touchstart',
		move: 'touchmove',
		end: 'touchend'
	}
}

function getNow() {
  return window.performance && window.performance.now ? (window.performance.now() + window.performance.timing.navigationStart) : +new Date()
}

var cubicCurve = {
	a: 0.165,
	b: 0.84,
	c: 0.44,
	d: 1
}

export default function Scroll(el) {
	this.el = el.nodeType === 1 ? el : document.querySelector(el)
	this.scroller = this.el.children[0]
	this.scrollerStyle = this.scroller.style
	this.endLength = this.scroller.clientHeight - this.el.clientHeight
	this._init()
	this._swipe(this.scroller)
}

Scroll.prototype = {
	_init: function() {
		this.scrollerStyle[browser.cssCore + 'TransitionTimingFunction'] = 
			'cubic-bezier(' + cubicCurve.a + ',' 
											+ cubicCurve.b + ',' 
											+ cubicCurve.c + ',' 
											+ cubicCurve.d + ')'
	},
	_swipe: function(el) {
		var self = this
		var starts = {}
		var moves = {}
		var ends = {
			x: 0,
			y: 0
		}
		var starttime
		var endtime
		var touchEvent = {
			start: function(e) {
				e = e || window.event
				var touches = e.touches ? e.touches[0] : e
				starts = {
					x: touches.pageX,
					y: touches.pageY
				}
				// var translate = self.scrollerStyle[browser.cssCore + 'Transform']
				// var dis = translate ? 
				// 	/\D+\((\d+)\D+(\-\d+\.\d+)\D+/g.exec(translate)
				// 	: 0

				starttime = getNow()
				el.addEventListener(_touch.move, touchEvent.move, false)
				el.addEventListener(_touch.end, touchEvent.end, false)
			},
			move: function(e) {
				var transTime = 0
				e = e || window.event
				var touches = e.touches ? e.touches[0] : e
				moves = {
					x: ends.x + touches.pageX - starts.x,
					y: ends.y + touches.pageY - starts.y
				}
				var timestamp = getNow()
	
				if (moves.y > 150) {
					moves.y = 0
					transTime = 700
				} else if (moves.y < -150 - self.endLength) {
					moves.y = -self.endLength
					transTime = 700
				}
				self.trans(moves, transTime)
			},
			end: function(e) {
				e = e || window.event
				var touches = e.changedTouches ? e.changedTouches[0] : e
				ends = moves
				
				var dir = (touches.pageY - starts.y) > 0 ? 1 : -1
				
				endtime = getNow()
				var duration = endtime - starttime
				var durationDis = touches.pageY - starts.y
				if (duration < 200 && Math.abs(durationDis) > 5) {
					moves.y += duration * dir / self.endLength * 2000
					self.trans(moves, 1000)
				}

				if (moves.y >= 0) {
					moves.y = 0
					self.trans(moves, 700) 
				} else if (moves.y <= -self.endLength) {
					moves.y = -self.endLength
					self.trans(moves, 700)
				}
			}
		}
		el.addEventListener(_touch.start, touchEvent.start, false)
	},
	trans: function(dir, time) {
		time = time === void 0 ? 2500 : time
		this.scrollerStyle[browser.cssCore + 'TransitionDuration'] = time + 'ms'
		this.scrollerStyle[browser.cssCore + 'Transform'] = 
			'translate(' + 0 + 'px, ' + dir.y + 'px)'
	}
}