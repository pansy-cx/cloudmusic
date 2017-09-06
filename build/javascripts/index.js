import initDate from './initDate.js'
import _ from './util.js'
import router from './router.js'
import {
	btnControl,
	bgfunc
} from './playerControl.js'
import lyricFn from './lyric.js'
import BScroll from 'better-scroll'

import remd from '../template/recommend.html'
import hotsong from '../template/hotsong.html'
import search from '../template/search.html'
import playlist from '../template/playlist.html'
import player from '../template/player.html'

var cache = []
// var host = 'http://localhost:3000'
var host = 'http://chenxi.website:8080'

// webpack 不方便解析 html ，所以写在这里
import logo from '../images/logo.svg'
document.getElementById('logo').src = logo

// 切换
function changeFunc() {
	var navLis = document.getElementsByClassName('navbar')[0].getElementsByTagName('li')
	var content = document.getElementsByClassName('content')[0]
	var navChange = [
		{
			name: remd, 
			func: function(index) {
				var remdUrl = host + '/api/recommendLst'
				initDate(remdUrl, '.remd-song', function(){
					var newsongUrl = host + '/api/newmusic'
					initDate(newsongUrl, '.remd-newsong', function() {
						cache[index] = content.innerHTML
						new BScroll('.content', {
							click: true
						})
					})
				})
			}
		},
		{
			name: hotsong,
			func: function(index) {
				var hotsong = host + '/api/hotsong'
				initDate(hotsong, '.content-hotsong', function() {
					cache[index] = content.innerHTML
					new BScroll('.content', {
						click: true
					})
				}) 
			}
		},
		{
			name: search
		}
	]
	var scrollCache = {}
	for (var i = 0, len = navLis.length; i < len; i++) {
		// 初始化
		if (i === 0) {
			navLis[i].className = 'active'
			content.innerHTML = navChange[i].name

			navChange[i].func && navChange[i].func(i)
		}
		(function(i) {
			navLis[i].addEventListener('click', function() {
				// 改变class
				navLis[0].className = ''
				navLis[1].className = ''
				navLis[2].className = ''
				navLis[i].className = 'active'

				if (!cache[i]) {
					content.innerHTML = navChange[i].name
					navChange[i].func && navChange[i].func(i)
				} else {
					content.innerHTML = cache[i]
					new BScroll('.content', {
						click: true
					})
				}

				document.body.scrollTop = 0
			})
		})(i)
	}
}
changeFunc()

// 路由
function routeFunc() {
	var routes = [
		{
			path: '/index',
		},
		{
			path: '/playlist',
			template: playlist
		},
		{
			path: '/m/song',
			template: player
		}
	]

	var oPlayer = document.getElementsByClassName('player')[0]

	var route = new router(routes)
	var cache = {}
	route.beforeEach(function(to, next) {
		switch (to.path) {
			case '/playlist' :
				next()
				var oPlaylist = document.getElementsByClassName('playlist')[0]
				
				function playlistFunc () {
					var oIntro = document.getElementsByClassName('intro-content')[0]

					if (!oIntro) return
					
					oIntro.addEventListener('click', function() {
						if (oIntro.className.match(/(?:^|\s)thide3(?!\S)/)) {
							oIntro.className = oIntro.className.replace(/(?:^|\s)thide3(?!\S)/g ,'')
						} else {
							oIntro.className += ' thide3'
						}
					})
					new BScroll(oPlaylist, {
						click: true
					})
				}
				var remdUrl = host + '/api/playlist?id=' + to.query.id
				document.body.scrollTop = 0
				
				if (!cache[to.query.id]) {
					initDate(remdUrl, '.playlist', function() {
						playlistFunc()
						cache[to.query.id] = oPlaylist.innerHTML
					})	
				} else {
					oPlaylist.innerHTML = cache[to.query.id]
					playlistFunc()
				}
				
				break
			case '/m/song' :
				// 播放器
				next()
				document.body.scrollTop = 0
				
				var id = to.query.id ? to.query.id : to.query.detail

				var playUrl = host + '/api/music/url?id=' + id
				var playDetail = host + '/api/song/detail?ids=' + id
				var lyric = host + '/api/lyric?id=' + id

				initDate(playDetail, '.player-name')
				initDate(playDetail, '.cover-mask', bgfunc)
				initDate(playUrl, '.player-audio-r', btnControl)
				
				lyricFn(document.getElementsByClassName('body-lrc')[0], lyric)
				break;
			default :
				next()
				break
		}
	})
}

routeFunc()
