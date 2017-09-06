import _ from './util.js'
export default function(el, url) {
	var xmlHttp = _.xmlhttp()
	xmlHttp.open('GET', url, true)
	xmlHttp.onload = function() {
		if (xmlHttp.status >= 200 && xmlHttp.status < 400) {
			var data = JSON.parse(xmlHttp.responseText)
			var str = compileLrc(data.lrc.lyric)
			var lrcContent = ''
			for (var i = 0, len = str.length; i < len; i++) {
				if (i === 0) {
					lrcContent +=
						'<p class="active" data="' + str[i].time + '">' + str[i].content + '</p>'
				} else {
					lrcContent += 
						'<p data="' + str[i].time + '">' + str[i].content + '</p>'
				}
				
			}
			el.innerHTML = lrcContent
			var aLrc = el.getElementsByTagName('p');

			var timer = setInterval(function() {
				var audio = document.getElementsByTagName('audio')[0]
				var lastIndex = 0
				var lastTop = 0
				if (audio !== void 0) {
					audio.addEventListener('timeupdate', function() {
						var currentTime = audio.currentTime

						for (var i = 0, len = aLrc.length; i < len; i++) {

							if (Math.abs(currentTime - (+aLrc[i].getAttribute('data'))) < 0.3) {
								aLrc[lastIndex].className = 
									aLrc[lastIndex].className.replace(/(?:^|\s)active(?!\S)/g ,'')
								aLrc[i].className += ' active'
								var lrcTop = -aLrc[i].offsetTop
								transtion(el, lastTop, lrcTop)
								lastIndex = i
								lastTop = lrcTop
							}
						}
					})
					clearInterval(timer)
				}
			}, 50)
		} else {
			throw new Error('can\'t get ' + url)
		}
	}
	xmlHttp.send()
}

function compileLrc(lrc) {
	var reg = /\[(.+)\]+(.+)/g
	var lrc = lrc.match(reg)
	var str = []
	for (var i = 0, len = lrc.length; i < len; i++) {
		var slrc = lrc[i].split(reg)
		str[i] = {
			time: _.strTime(slrc[1]),
			content: slrc[2]
		}
	}
	return str
}

function transtion(el, last, now) {
	var dispart = (now - last) / 10
	var timer = setInterval(function() {
		last += dispart
		el.style.transform = 'translate(0,' + last + 'px)'

		if (Math.abs(last) >= Math.abs(now)) {
			clearInterval(timer)
		}
	}, 30)
}