import _ from './util.js'
export default function SPARouter(routes) {
	this.currentRoute = {}
	this.beforeFunc = null
	this.afterFunc = null
	this.initRouters(routes)
	this.init()
}
SPARouter.prototype = {
	initRouters: function(routers) {
		var self = this
		this.routers = routers.map(function(item) {
			item.$router = self
			return item
		})
	},
	init: function() {
		window.SPA_RESOLVE_INIT = null
		this.initEvent()
	},
	initEvent: function() {
		var self = this
		window.addEventListener('load', function() {
			self.routerUpdate()
		})
		window.addEventListener('hashchange', function() {
			self.routerUpdate()
		})
	},
	routerUpdate: function() {
		var currentLocation = this.getHashRoute()
		var self = this
		this.routers.map(function(item) {
			if (item.path === currentLocation['path']) {
				self.currentRoute = item
				self.currentRoute.query = currentLocation['query']
				self.refresh()
			}
		})
		if (!this.currentRoute.path) {
			location.hash = '/index'
		}
	},
	getHashRoute: function() {
		var hashDetail = window.location.hash.split('?')
		var hasName = hashDetail[0].split('#')[1]
		var params = hashDetail[1]
			? hashDetail[1].split('&')
			: []

		var query = {}
		params.map(function(item) {
			var temp = item.split('=')
			query[temp[0]] = temp[1]
		})

		return {path: hasName, query: query}
	},
	refresh: function() {
		var self = this
		if (self.beforeFunc) {
			// beforeFunc(to, next)
			self.beforeFunc({
				path: self.currentRoute.path,
				query: self.currentRoute.query
			}, function(el) {
				self.loadComponent(el)
			})
		} else {
			self.loadComponent()
		}
	},
	loadComponent: function(el) {
		var self = this
		// console.log(el)
		if (_.isElement(el)) {
			this.divRoute = el
		}
		if (!this.divRoute) {
			var routeView = document.getElementsByTagName('router-view')[0]
			var createDiv = document.createElement('div')

			for (var i in routeView.attributes) {
				if (routeView.attributes.hasOwnProperty(i)){
					var attr = routeView.attributes[i]
					createDiv.setAttribute(attr.name, attr.value)
				}
			}

			routeView.parentNode.replaceChild(createDiv, routeView)
			this.divRoute = createDiv
		}
		this.divRoute.innerHTML = self.currentRoute.template 
			? self.currentRoute.template
			: ''
	},
	beforeEach: function(callback) {
		if (Object.prototype.toString.call(callback) === '[object Function]') {
			this.beforeFunc = callback
		} else {
			console.log('路由切换前钩子函数不正确')
		}
	},
	afterEach: function(callback) {
		if (Object.prototype.toString.call(callback) === '[object Function]') {
			this.afterFunc = callback
		} else {
			console.log('路由切换后钩子函数不正确')
		}
	}
}