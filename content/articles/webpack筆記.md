---
title: webpack一堆筆記
slug: 2021-11-15T07:49:37.000Z
date: 2021-11-15T07:49:37.000Z
tags: ["Webpack"]
---

指令輸入`npm install webpack webpack-cli --save-dev` 開始安裝

## webpack 優點

- 編譯多種東西像是 scss react pug 還可以壓縮圖片、html
- 多人團隊開發 統一開發
  - 可以記錄套件的版本號
- 打包成一隻 JS 檔案解決 src 非同步的問題
- 跨瀏覽器版本的問題
  - 例如 babel、polyfill 等等

## 使用 plugin 需要注意的地方

使用 plugin 的時候必須 reuire 後方可在配置檔使用例如以下程式碼

```javascript{numberLines: true}
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
```

## 如何建置一個簡單有 webpack 伺服器和 html 模板自動注入 JS 的設定檔

在 npm 套件的部分安裝 corss-env、webpack-dev-server、html-webpack-plugin

### 使用 cross-env 使得在 windows 或 linux 的指令統一

由於在 linux 系統底下和 windows 系統設置環境變數的指令不同，為了統一執行指令因此使用`npm install corss-env --save-dev`指令

如果是在 linux 指令設置環境變數的話是輸入 export
如下

```javascript{numberLines: true}
"script":{
    "build" : "export NODE_ENV=development webpack"
}
```

如果是在 winodws 指令設置環境變數的話是輸入 set
如下

```javascript{numberLines: true}
"script":{
    "build" : "set NODE_ENV=development webpack"
}
```

為了統一設定因此使用 corss-env，指令如下

```javascript{numberLines: true}
"start": "cross-env NODE_ENV=development webpack",
```

這裡設置幾個 package.json 腳本
在 script 裡面添加自己的腳本，script 裡面的 key 可以自己取
可以參照以下的名字取名

```javascript{numberLines: true}
 "scripts": {
    "start": "cross-env NODE_ENV=development webpack",
    "deploy": "cross-env NODE_ENV=production webpack"
  },
```

在 webpack.config.js 設定檔的部分使用

```javascript{numberLines: true}
const path = require('path');
const modeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development' //使用node的process.env抓取環境變數來判斷當下的

module.exports = {
    mode: modeEnv,//設定要打包的模式可以設定production或development
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),//使用絕對路徑方式設定打包後產生出的資料夾
        filename: 'bundle.js',//打包後要取的名字
      },
}

```

順帶一提如果 entry 進入點有多個的話可以使用物件的方式
通常原本 src 內的注入檔案名稱叫做什麼的話，在 entry 的物件 key 值也會設定相同的名稱

範例如下

```javascript{numberLines: true}
module.exports = {
  entry: {
    home: './home.js',
    about: './about.js',
    contact: './contact.js',
  },
};
```

> [環境搭建好幫手 process && env 環境變數](https://ithelp.ithome.com.tw/articles/10248363)

### 使用 webpack 的伺服器

為了測試方便使用 webpack 的伺服器來開啟網頁進行測試
指令輸入`npm install webpack-dev-server --save-dev`安裝

在 webpack.config 添加如下

```javascript{numberLines: true}
devServer:{
    static :{
      directory: path.join(__dirname, './dist/')
    },
    open: true, //自動打開瀏覽器
    port: 8080,//開啟的port號是8080
    hot:true,//4.0.0默認是開啟的
}
```

### cross-env

設定環境變數為 NODE_ENV=production
`npm install cross-env --save-dev`

### html 模板而且也可以自動注入 script

`npm install html-webpack-plugin --save-dev`

在 webpack.config.js 的底下帶入參數
例如 title 參數，範例如下

```javascript{numberLines: true}
plugins: [new HtmlWebpackPlugin({
        title: 'Custom template',
        filename: 'index.html',//這樣會在output指定的資料夾建立一個html資料夾後再產出名叫index.html的檔案
        template:'src/html/index.html',//模板的來源
        chunks: ['index','index2'] //指定注入哪些js文件，如果沒有設定預設是全部注入
    })],
```

建立一個 html 模板的資料夾
其中部分可以帶入模板語言如下

```html{numberLines: true}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= htmlWebpackPlugin.options.title %></title><!-- 使用<% %>來添加參數這裡是取得key是title的參數 -->

</head>
<body>
    hello world!
</body>
</html>
```

---

## 如何編譯 sass 並且產生有 hash 值的獨立 css 檔案

`npm install sass-loader node-sass --save-dev`

這邊 npm 安裝了兩個套件
一個是 sass 用來編譯 sass
一個是 sass-loader 用來讓 webpack 讀取 sass 檔案

另外由於編譯完的 css 檔案還是要給 webpack 讀取因此得安裝`css-loader`
安裝`npm install css-loader -D`

最後如果希望將 css 注入到 html 在上方用`<style></style>`樣式的話就使用 style-loader
在 webpack.config.js 裡面的 module 的 rules 配置如下

```javascript{numberLines: true}
module.exports = {
    mode: modeEnv,
    module: {
        rules: [
            {
              test: /\.s[ac]ss$/i,//使用正則表達式選擇副檔名含有scss或sass的檔案
              // 使用loader webpack是從後面讀到前面所以sass-loader放陣列最後一筆不過是優先處理的loader
              use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
          ],
      },
    entry: './src/js/index.js',
//以下省略
```

另外記得在 index.js 入口點的 js 檔案要 import scss
語法如下

```javascript{numberLines: true}
import '../scss/all.scss'
console.log("hello");
```

如果希望建置獨立的 css 檔案的話就用 MiniCssExtractPlugin
使用`npm i mini-css-extract-plugin -D`

在 webpack.config 設置檔案需要改成使用**MiniCssExtractPlugin.loader**和 plugin 要添加 MiniCssExtractPlugin 程式碼如下

```javascript{numberLines: true}
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const modeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: modeEnv,
    module: {
        rules: [
            {
              test: /\.s[ac]ss$/i,
              // 把 sass-loader 放在首要處理 (第一步)
              use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
          ],
      },
    entry: //中間省略
    //中間省略//中間省略//中間省略//中間省略//中間省略
    //中間省略//中間省略//中間省略//中間省略//中間省略
    //中間省略//中間省略//中間省略//中間省略//中間省略
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Custom template',
            filename: 'html/index.html',
            template:'src/html/index.html'
        }),
       new MiniCssExtractPlugin({
        filename: "./css/[contenthash].bundle.css"
           //filename的value地方意思是產生出css資料夾並且隨機產生hash檔名+bundle的css，產生隨機檔名可以避免瀏覽器快取
       }),
    ],

}
```

---

## postcss 編譯 css 讓之前瀏覽器支援且自動加入語法前綴

如果想要將新版的 css 轉成舊版的 css 就需要 postcss-preset-env 套件
使用`npm i postcss-preset-env -D`
如果想要讓 css 自動加入前綴的話就要安裝 autoprefixer 套件
使用`npm i autoprefixer -D`

不過在使用 postcss-preset-env 或者 autoprefixer 的套件的時候必須預先安裝
這時候在 webpack.config.js 的配置就要改成如下

```javascript{numberLines: true}
module.exports = {
    mode: modeEnv,
    module: {
        rules: [
            {
              test: /\.s[ac]ss$/i,
              // 把 sass-loader 放在首要處理 (第一步)
              use: [MiniCssExtractPlugin.loader, 'css-loader','postcss-loader', 'sass-loader'],
            },
          ],
      },
//以下省略
//以下省略
//以下省略
}
```

接下來建議新增一個 postcss.config.js 檔案
postcss-loader 會自動搜尋如果檔名叫做 postcss.config.js 的檔案就會讀取
裡面我們配置如下

```javascript{numberLines: true}
module.exports = {
    map: true,//是否開啟source-map
    plugins: [require('postcss-preset-  env'),require('autoprefixer'),]
    //引入postcss-preset-env和autoprefixer
};
```

另外瀏覽器設定也建議抽離出來成一個檔案，因此官方說新增一個.browserslistrc
設置如下

```javascript{numberLines: true}
last 1 version
> 1%
IE 10 # sorry
```

詳情可以搜尋 Browserslist 的文件
[BrowserslistGitHub](https://github.com/browserslist/browserslist)

---

## 如果 css 裡面有要載入圖片的話，可以對圖片處理的相關設定

在 webpack4 以前需要 file-loader 或者 url-loader
webpack5 只需要在<span class="red">webpack.config</span>添加就好了
程式碼如下

```javascript{numberLines: true}
module.exports = {
    mode: modeEnv,
   module: {
        rules: [
            {
              test: /\.s[ac]ss$/i,
              use: [MiniCssExtractPlugin.loader, 'css-loader','postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][name][ext]' //建立至images資料夾且自動產生hash和原檔案名稱和副檔名
                  },
                },

            //主要是這邊 添加此項配置來讓webpack對以上副檔名做處理
          ],
      },
```

> [webpack 官方資源模組](https://webpack.docschina.org/guides/asset-modules/)

## 想要使用 base64 解決圖片檔案多次對伺服器發送請求

如果想要設置多少 kb 以下壓縮成 base64 的話可以參照以下配置
如果未設定的話，預設是 8kb 以下就會自動轉成 base64 而不會另外生成 jpg 檔案

> 使用 base64 可以避免小圖片和伺服器多次請求，因為是夾帶在 css 檔案裡面

```javascript{numberLines: true}
module.exports = {
    mode: modeEnv,
    module: {
        rules: [
            {
              test: /\.s[ac]ss$/i,
              // 把 sass-loader 放在首要處理 (第一步)
              use: [MiniCssExtractPlugin.loader, 'css-loader','postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
                generator: {
                    filename: 'images/[hash][name][ext]'
                  },
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 //在多少位元組以下就變成base64
                    }
                }
            },
          ],
    },
//以下省略
//以下省略
//以下省略
}
```

## 為了向下相容瀏覽器使用 babel 幫我們轉換成以前的 JS 語法

首先要安裝**babel-loader** 和 **@babel/core**
`npm install --save-dev babel-loader @babel/core`
在 webpack.config 裡面的 module 添加規則
如下

```javascript{numberLines: true}
module.exports = {
    mode: modeEnv,
    module: {
        rules: [       {
                test: /\.m?js$/,
                exclude: /node_modules/, //node module底下的東西就不用做了
                use: {
                  loader: "babel-loader",
                }
              }]
    }
}
```

上面設定了 exclude 就表示在 node_modules 資料夾底下的不用透過 bable 轉換

> [Using Babel 官方說明](https://babeljs.io/setup#installation)

**如果你想要支援 2015 到現在的語法就要安裝 preset-env**

`npm install @babel/preset-env --save-dev`

新建一個 babel.config.json 內容如下

```javascript{numberLines: true}
{
    "presets": ["@babel/preset-env"],
}
```

之後去抓你的.browserslistrc 的檔案看你需要支援到哪個版本的瀏覽器

你也可以自行設定內容在 babel.config.json 這個檔案

```javascript{numberLines: true}
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        }
      }
    ]
  ]
}
```

> [官方說明—preset-env](https://babeljs.io/docs/en/usage/#configuration)

### 如果使用 async await 的話

如果要使用 async await 的話在 bable 要安裝如下

`npm i @babel/runtime regenerator-runtime`

然後在 babel.config 添加以下片段

```javascript{numberLines: true}
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    ["@babel/transform-runtime"]
  ]
}
```

最後你在 js 檔案就可以使用**async await**了
範例代碼如下

```javascript{numberLines: true}
(async function (){
    const a= await fetch('某個API');
    const b = await a.json();
    console.log(b);
}())
```

> [Babel ReferenceError: regeneratorRuntime is not defined](https://exerror.com/babel-referenceerror-regeneratorruntime-is-not-defined/) 
> [How to fix regeneratorRuntime is not defined?](https://dev.to/hulyakarakaya/how-to-fix-regeneratorruntime-is-not-defined-doj)

## 想要即時更新的話使用 watch 指令

在 package.json 添加 script 指令如下

```javascript{numberLines: true}
  "scripts": {
    "watch": "cross-env NODE_ENV=development webpack --watch",//添加這一行
    "start": "cross-env NODE_ENV=development webpack",
    "server": "cross-env NODE_ENV=development webpack server",
    "deploy": "cross-env NODE_ENV=production webpack",
    "deploy-server": "cross-env NODE_ENV=production webpack server"
  },
```

> [Webpack 教學 (三)：永不停止的 Watch](https://medium.com/i-am-mike/webpack%E6%95%99%E5%AD%B8-%E4%B8%89-%E6%B0%B8%E4%B8%8D%E5%81%9C%E6%AD%A2%E7%9A%84watch-dbf98ebf8356)

## 每次自動先清除 dist 資料夾的東西可以在 output 設定

```javascript{numberLines: true}
module.exports = {
    mode: modeEnv,
    output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
        clean: true //設定這樣就可以自動清除之後再
        },
    }
```

### 其他有關處理圖片問題可以參考以下

> [ImageMinimizerWebpackPlugin](https://runebook.dev/zh-CN/docs/webpack/plugins/image-minimizer-webpack-plugin)

> [webpack5 loading-image](https://webpack.docschina.org/guides/asset-management/#loading-images)

## 其他推薦與 webpack 有關

### 其他知識點

> [知識大補帖](https://cloud.tencent.com/developer/article/1606601)
> [webpack5 和 webpack4 的區別](https://juejin.cn/post/6990869970385109005)

### webpack 線上配置產生器

> [Generate Custom Webpack Configuration](https://generatewebpackconfig.netlify.app/) 
> [Create App](https://createapp.dev/webpack/no-library)
