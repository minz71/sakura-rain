# 櫻花動畫

這個項目可以在網頁上創建櫻花飄落動畫。
Demo: https://minz71.github.io/sakura-rain/


## 功能
- 提供櫻花飄落動畫。
- 可自定義櫻花數量。
- 可配置花瓣的速度和方向。

## 入門指南
1. 使用CDN的方式

* jsdelivr
```html
<script src="https://cdn.jsdelivr.net/gh/minz71/sakura-rain/sakura-rain.js" defer></script>
```

2. 將這個 js 放入你的專案，並使用 `startSakura` 函數。

```js
startSakura(maxSakura, direction, zindex);
```
## example

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sakura-rain.js</title>
  <script src="path/to/your/sakura.js"></script>
</head>
<body>
  <script>
    startSakura(50, 'TopRight', 1);
  </script>
</body>
</html>

```

## 參數

||說明|預設值|傳入說明|
|:---:|:---:|:---:|:---:|
|sakura|櫻花花瓣的最大數量，在手機上會自動減半數量。|30|整數|
|xSpeed|花瓣在水平方向上的速度。|0.5|浮點數，可以大於1|
|ySpeed|花瓣在垂直方向上的速度。|0.5|浮點數，可以大於1|
|rSpeed|花瓣旋轉的速度。|0.025|浮點數，可以大於1|
|direction|花瓣開始飄落的方向。TopRight指由螢幕上方或右方邊緣掉落，BottomLeft指由螢幕下方或左方邊緣掉落。當設定為下方(Bottom)時櫻花會往上飄，當設定為左方(Left)時櫻花會往右飄。|TopRight|可以是 TopRight、TopLeft、BottomRight 或 BottomLeft 之一。|
|zIndex|zIndex|-1||

* 傳入說明
```html
<script>
  window.sakuraConfig = {
    sakura: 30,
    xSpeed: 0.5,
    ySpeed: 0.5,
    rSpeed: 0.025,
    direction: "TopRight",
    zIndex: -1,
  };
</script>

<script src="https://cdn.jsdelivr.net/gh/minz71/sakura-rain/sakura-rain.js" defer></script>
```