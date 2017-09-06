### 网易云音乐 SPA 版

[预览](http://chenxi.website/cloudmusic)

##### 思路

之前做过 Vue 版的饿了么，当时第一次接触到框架，对 SPA、WebPack、前端路由这之类的都不太懂。做着也是不求甚解。  
所以现在想从前端工程搭建，前端路由，模板引擎，移动端适配等大大小小的问题都自己用纯原生写一遍。不求能写的多好，主要目的是了解其中的原理。 

页面用纯前端写。hash 实现前端路由，自己封装个函数；数据使用 Ajax 异步获取；渲染使用 ```underscore.tempalte()``` 方法，本来想自己写的，没写出来 ○|￣|__；工程构架用 WebPack，可以很好的将 HTML 拆分成多个页面进行维护；移动端适配用 flexible 方案；滚动通过监听 touchstart 等事件来模拟，自己写的效果不是太好，后来使用 better-scroll 处理。

后台 API 用 NodeJs 转发，参考：[NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/) ，代码不贴上来了。。都是 bug，需要注意的是，后台的端口放在 8080，前端则是纯静态，使用 Nginx 转发，所以需要处理跨域问题

```js
res.header("Access-Control-Allow-Origin", "*")
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
```

服务器在国外，所以有些歌曲信息获取不了，代理到国内的 IP
```js
res.header("X-Real-IP", IP)
```

##### 问题

- 对安卓适配不是很好
- 播放页面滚动会卡顿
- 还未添加搜索功能

纯手写真的是写到吐 /(ㄒoㄒ)/~~ ，现在暂时不想看到网易云这几个字了，我需要休息

##### 使用

- npm run dev
- npm run build

测试？不存在的

