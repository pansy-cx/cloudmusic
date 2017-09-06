function util() {
	var _ = {}
	_.getElem = function(el) {
		if (!el) return
		if (el.nodeType === 1) {
			return el
		} else if (el.indexOf('#') === 0) {
			return document.getElementById(el.slice(1))
		} else if (el.indexOf('.') === 0) {
			return document.getElementsByClassName(el.slice(1))[0]
		} else {
			return document.querySelector(el)
		}
	}
	_.isElement = function(node) {
		if (!node) return
		return node.nodeType === 1
	}
	_.isText = function(node) {
		if (!node) return
		return node.nodeType === 3
	}
	_.isArray = function(obj) {
		return Array.isArray(obj)
	}
 	_.each = function(arr, fn) {
 		for (var i = 0, len = arr.length; i < len; i++) {
 			fn(arr[i], i, arr)
 		}
 	}
 	_.xmlhttp = function() {
 		if (window.XMLHttpRequest){
	  	return new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			return new ActiveXObject('Microsoft.xmlHttp')
		} else {
			throw new Error('can\'t use ajax')
			return
		}
 	}

 	_.date = function jsonDate(timeStamp, fmt) { 
	  if (!timeStamp) {
	    return ''
	  }
	  var _timeStamp = parseInt(timeStamp)
	  if (_timeStamp.toString().length === 10) {
	    _timeStamp *= 1000
	  }
	  !fmt && (fmt = 'yyyy-MM-dd')  // 默认返回格式

	  var t = new Date(_timeStamp)

	  var o = {
	    'M+': t.getMonth() + 1, // 月份
	    'd+': t.getDate(),      // 日
	    'h+': t.getHours(),     // 小时
	    'm+': t.getMinutes(),   // 分
	    's+': t.getSeconds(),   // 秒
	    'q+': Math.floor((t.getMonth() + 3) / 3), // 季度
	    'S': t.getMilliseconds() // 毫秒
	  }
	  if (/(y+)/.test(fmt)) 
	    fmt = fmt.replace(RegExp.$1, (t.getFullYear() + '').substr(4 - RegExp.$1.length))
	  for (var k in o) {
	    if (new RegExp('(' + k + ')').test(fmt)) 
	        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
	  }
	  return fmt
	}

	_.timer = function(second) {
		var minute = Math.floor(second / 60)
		second = second - 60 * minute
		minute = minute < 10 
			? '0' + minute 
			: '' + minute
		second = second < 10
			? '0' + second
			: '' + second

		return minute + ':' + second
	}

	_.strTime = function(str) {
		str = str.match(/(\d+)/g)
		var minute = parseInt(str[0])
		var second = parseInt(str[1])
		var minsecond = parseInt(str[2])
		minsecond = minsecond < 100 
			? minsecond / 100
			: minsecond / 1000

		return minute * 60 + second + minsecond
	}

	return _
}

export default util()