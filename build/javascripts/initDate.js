import _ from './util.js'
import template from './template.js'

export default function init(url, el, fn) {
	var element = _.getElem(el)
	var xmlHttp = _.xmlhttp()
	xmlHttp.open('GET', url, true)
	xmlHttp.onload = function() {
		if (xmlHttp.status >= 200 && xmlHttp.status < 400) {
			var json = JSON.parse(xmlHttp.responseText)
			template(element, json)

			if (typeof fn === 'function') {
				fn()
			}
		} else {
			throw new Error('can\'t get ' + url)
		}
	}
	xmlHttp.send()
}