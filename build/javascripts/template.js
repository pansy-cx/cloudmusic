import _ from './util.js'

export default function (el, data) {
	var text = el.getElementsByTagName('script')[0].innerHTML
	var compiled = template(text)
	var html = compiled(data)
	el.innerHTML = html
}

var settings = {
	evaluate    : /<%([\s\S]+?)%>/g,
  interpolate : /<%=([\s\S]+?)%>/g,
  escape      : /<%-([\s\S]+?)%>/g
}

var noMatch = /(.)^/

var escapes = {
  "'":      "'",
  '\\':     '\\',
  '\r':     'r',  // 回车符
  '\n':     'n',  // 换行符
  // http://stackoverflow.com/questions/16686687/json-stringify-and-u2028-u2029-check
  '\u2028': 'u2028', // Line separator
  '\u2029': 'u2029'  // Paragraph separator
}

var escaper = /\\|'|\r|\n|\u2028|\u2029/g

var escapeChar = function(match) {
  /**
    '      => \\'
    \\     => \\\\
    \r     => \\r
    \n     => \\n
    \u2028 => \\u2028
    \u2029 => \\u2029
  **/
  return '\\' + escapes[match]
}

function template(text) {
	var matcher = RegExp([
		settings.escape.source,
		settings.interpolate.source,
		settings.evaluate.source
	].join('|') + '|$', 'g')
	var index = 0
	var source = "__p+='"

	text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
    // \n => \\n
    source += text.slice(index, offset).replace(escaper, escapeChar)
    // 改变 index 值，为了下次的 slice
    index = offset + match.length
    if (escape) {
      // 需要对变量进行编码（=> HTML 实体编码）
      // 避免 XSS 攻击
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"
    } else if (interpolate) {
      // 单纯的插入变量
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"
    } else if (evaluate) {
      // 可以直接执行的 JavaScript 语句
      // 注意 "__p+="，__p 为渲染返回的字符串
      source += "';\n" + evaluate + "\n__p+='"
    }

    return match
  })

	source += "';\n"
	source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n'

  try {
    var render = new Function('obj', '_', source)
  } catch (e) {
    // 抛出错误
    e.source = source
    throw e
  }

  var template = function(obj) {
    return render.call(this, obj, _)
  }

  var argument = 'obj';
  template.source = 'function(' + argument + '){\n' + source + '}'

  return template
}