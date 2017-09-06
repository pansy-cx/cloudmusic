import _ from './util.js'

var timerCover = null
var roundCount = 0


export function btnControl() {
	var oBody = document.getElementsByClassName('player-body')[0]
	if (!oBody) return
	var oBodyChild = oBody.children;
	
	var oPlayAudio = document.getElementsByClassName('player-audio-r')[0]
	var oAudio = oPlayAudio.getElementsByTagName('audio')[0]
	var oCover = document.getElementsByClassName('cover-round')[0]
	var oBtn = document.getElementsByClassName('player-btn')[0]

	oBtn.addEventListener('click', function() {
		if (oAudio.paused) {
			oAudio.play()
			oBtn.innerHTML = '&#x1010;'
			timerCover = setInterval(roundFn(oCover), 50)
		} else {
			oAudio.pause()
			oBtn.innerHTML = '&#x1004;'
			clearInterval(timerCover)
		}
	})
	processBtn(oAudio)
}

function roundFn(el) {
	return function() {
		el.style.transform = 'rotate(' + roundCount++ + 'deg)'
		if (roundCount >= 360) {
			roundCount = 0
		}
	}
}

function processBtn(audio) {
	if (!audio) return

	var oProcess = document.getElementsByClassName('process')[0]
	var currentTime = oProcess.getElementsByClassName('current-time')[0]
	var totalTime = oProcess.getElementsByClassName('total-time')[0]
	var oProcessBar = oProcess.getElementsByClassName('process-bar')[0]
	var oBarLeft = oProcessBar.getElementsByClassName('left')[0]
	var oBarRight = oProcessBar.getElementsByClassName('right')[0]
	var oRound = oProcessBar.getElementsByClassName('process-round')[0]
	
	var barWidth = oBarRight.clientWidth
	var lastTime = 0
	
	function playTime() {
		var current = audio.currentTime
		var duration = audio.duration

		if (current !== lastTime) {
			currentTime.innerHTML = _.timer(Math.floor(current))
			totalTime.innerHTML = _.timer(Math.floor(duration))
			
			var currentWidth = (current / duration) * barWidth
			
			oBarLeft.style.width = currentWidth + 'px'
			// -2 防止出现偏移
			oBarRight.style.width = (barWidth - currentWidth - 2) + 'px'
			oRound.style.left = currentWidth + 'px'
		}

		if (audio.ended) {
			document.getElementsByClassName('player-btn')[0].innerHTML = '&#x1004;'
			clearInterval(timerCover)
		}
		
		lastTime = current
	}

	var setTimer = setInterval(playTime, 1000)
	
	var events = {
		distance: {
			start: 0,
			move: 0
		},
		handleEvent: function(event) {
			switch (event.type) {
				case 'touchstart' :
					this.start(event) 
					break
				case 'touchmove' :
					this.move(event)
					break
				case 'touchend' :
					this.end(event)
					break
			}
		},
		start: function(event) {
			this.distance.start = event.touches[0].pageX
			this.startLeft = oRound.style.left 
				? parseInt(oRound.style.left)
				: 0
			clearInterval(setTimer)
			oRound.addEventListener('touchmove', this, false)
			oRound.addEventListener('touchend', this, false)
		},
		move: function(event) {
			event.preventDefault()
			this.distance.move = event.touches[0].pageX
			var offset = event.touches[0].pageX - this.distance.start + this.startLeft
			if (offset <= 0) {
				offset = 0
			} else if (offset >= barWidth) {
				offset = barWidth
			}
			oRound.style.left = offset + 'px'
			oBarLeft.style.width = offset + 'px'
			oBarRight.style.width = (barWidth - offset -2) > 0
				? barWidth - offset -2 + 'px'
				: 0
			
			this.current = (offset / barWidth) * audio.duration
			currentTime.innerHTML = _.timer(Math.floor(this.current))
		},
		end: function(end) {
			var dir = this.distance.move - this.distance.start
			audio.currentTime = this.current
			setTimer = setInterval(playTime, 1000)
			
			if (audio.paused) {
				document.getElementsByClassName('player-btn')[0].click()
				audio.currentTime = this.current
			}
		}
	}

	// 在 audio 加载后才能监听
	var interval = setInterval(function() {

		if (audio.duration === audio.duration) {
			oRound.addEventListener('touchstart', events, false)
			clearInterval(interval)
		}
	},50)
}

export function bgfunc() {
	var img = document.getElementsByClassName('cover-pic')[0]
	if (!img) return
	var imgSrc = img.src
	var createDiv = document.createElement('div')
	createDiv.style.backgroundImage = 'url(' + imgSrc + ')'
	createDiv.className = 'player-bg'

	var oPlay = document.getElementsByClassName('player-r')[0]
	oPlay.appendChild(createDiv)
}