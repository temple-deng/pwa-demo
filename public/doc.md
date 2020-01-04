如果想要安装，chrome 要求至少提供了 192x192 和 512x512 的icon。    

ios 上的 safari 还不支持 manifest，需要添加传统的 meta tags：    

```html
<!-- CODELAB: Add iOS meta tags and icons -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Weather PWA">
<link rel="apple-touch-icon" href="/images/icons/icon-152x152.png">
```    

activate 事件在每次 sw 启动的时候都会触发一次