---
title: 使用 Node.js 自創 API 部署到 heroku 並且 解決 cors
slug: 2021-07-16T07:55:00.000Z
date: 2021-07-16T07:55:00.000Z
tags: ["Node.js","Deploy","Javascript","Backend"]
---

<style> 
.rem25{
font-size:2.5rem;
}
.rem40{
font-size:4.0rem;
}
.red {
color:red;
}
.gray{
background-color:#d3d3d3;
}
</style>


以下是紀錄最簡易部署方式並非最好的做法，可能造成冗 code，僅作為操作筆記用。

- 下載 Node.js
- 下載 heroku cli

使用 terminal cd 到對應的資料夾
然後

1. npm install express-generator -g <br>建立一個 ejs 的 Node.js 名叫做 myapp 伺服器
2. express --view=ejs myapp <br>可以自己取名字不一定要叫 myapp
3. cd myapp<br>移動到該資料夾
4. npm install

[參見方法 express generator](https://expressjs.com/zh-tw/starter/generator.html)

<font color="red">`注意`</font>
如果之前已經全域安裝過，也就是已經執行過 npm install exrpess-generator -g 的話就從第二步開始

## 建立一個 api 路由

![](https://i.imgur.com/TMsW4hc.png)

在 routes 底下新建一個名叫做`api.js`(名稱可以自取)

複製<span class="red">`index.js`</span>的內容到<span class="red">`api.js`</span>
記得將`router.get('/', function(req, res, next) { });`的內容 改成 res.json();

意思是當有人存取這個路由的時候要回傳的內容
這邊定義為回傳 json 檔這邊先以物件
`{id:1,name: 'Tom'}`為例子

```html{numberLines: true}
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(
    {
        id:1,
        name: 'Tom'
    }
  )
});
module.exports = router;
```

在<span class="red">app.js</span>的地方增加路由存取
如下第九行的地方和第二十五行的地方

```javascript{numberLines: true}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
```

這個時候開啟**terminal** 使用**cd**指令到該資料夾

<span class="red">`npm start`</span>
然後開啟瀏覽器<span class="red">localhost:3000/api</span>

這時候應該能在瀏覽器看到圖如下
![](https://i.imgur.com/Ljn9nah.png)

後來回來到 terminal 按下<kbd>Ctrl</kbd>+<kbd>C</kbd>來關閉伺服器

注意:每次更改該專案的程式碼的時候伺服器並不會自動更新，必須重啟，也就是在此重複以下動作 <kbd>Ctrl</kbd>+<kbd>C</kbd>再輸入<span class="red">npm start</span>

## fetch 遠端資料到本伺服器

1.開啟 postman 擷取遠端資料按下 send 後
![](https://i.imgur.com/f38ThBW.png) 2.再按下右邊 code
![](https://i.imgur.com/GCRenIg.png) 3.左邊選擇 Node.js axios 複製程式碼

![](https://i.imgur.com/zA2fNxQ.png)

回到<span class="red">routes</span>的自創的那個`api.js` 撰寫對應的 function

宣告一個 data = [];
撰寫一個 function 然後把剛剛 postman 的 request 複製的 code 貼到 function 底下
在 if 的地方將 body 的內容轉成 JSON 的格式存到 data 如第 14 行

當使用者存取進來的時候以 json 格式則轉送 data 出去如第 21 行

```javascript{numberLines: true}
var express = require('express');
var router = express.Router();
var axios = require('axios');
let data = [];
function getData(){
  var config = {
    method: 'get',
    url: 'https://od.cdc.gov.tw/eic/Day_Confirmation_Age_County_Gender_19CoV.json',
    headers: { }
  };
  axios(config)
  .then(function (response) {
    data = response.data
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
}
getData();

router.get('/',function(req, res, next) {
    res.json(data);
});

module.exports = router;

```

注意 必須安裝`npm install axios --save`

才可以發送遠端 API 請求

接下來<span class="red">`npm start`</span>在瀏覽器輸入<span class="red">`localhost:3000/api`</span>應該就可以看到對應的物件

## 部署到 heroku

- 到 heroku 的官網
- 按下 new→create new app
  如下圖
  ![](https://i.imgur.com/OIBNpC8.png)

- 取一個 app name 的名字

回到終端機，由於 heroku 是可以透過 git 指令建立遠端伺服器

接下來建立一個 git 連結遠端資料庫

- 輸入<span class="red">git init</span>
- 輸入<span class="red">heroku git:remote -a `<你的遠端資料庫名字>`</span>
- 輸入<span class="red">git add .</span>
- 輸入<span class="red">git commit -m "你的該分支名字"</span>

然後必須設定一個頭
<span class="red">`git push --set-upstream heroku master`</span>
接下來的上傳改用
<span class="red">git push heroku master</span>就可以了

之後回到瀏覽器做 fetch 會發現還沒有解決 cors 的問題

```javascript{numberLines: true}
fetch('你的heroku/api網址')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
  });
```

## 解決 cors 以便跨瀏覽器 fetch 資料

在 terminal 輸入<span class="red">`npm install cors`</span>

> 更多可觀看文件
> [cors express node js ](https://www.npmjs.com/package/cors#configuring-cors)

在<span class="red">`app.js`</span>加入 cors 開啟的語法
如第 11 行和第 23 行

```javascript{numberLines: true}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

const cors = require('cors');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

```

重新在終端機設置

<span class="red">`git add .`</span>
<span class="red">`git commit -m "add cors"`</span>

然後<span class="red">`git push heroku master`</span>

然後用瀏覽器 fecth 資料

```javascript{numberLines: true}
fetch('你的API路由')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
  });
```

就可以成功接回來了

