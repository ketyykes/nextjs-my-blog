---
title: 008 重新認識 Javascript 讀書會 - 網頁的事件與生命週期
slug: 2022-01-22T04:00:00.000Z
date: 2022-01-22T04:00:00.000Z
tags: ["008 重新認識 Javascript 讀書會","Javascript"]
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

本篇為參與 0 陷阱！0 誤解！8 天重新認識 Javascript 讀書會的導讀內容加上自己所蒐尋的資料後所構成的文章。

## 網頁介面相關事件

### load 事件

註冊在 window 物件上，指的是網頁資源 (包括 CSS、JS、圖片等) 全數載入完畢後觸發。
範例如下

```javascript{numberLines: true}
function testAlert() {
  alert('hello!');
}
document.addEventListener('click', testAlert);
window.addEventListener('load', function() {
  alert('頁面已載入！');
});
```

> [MDN-load 事件](https://developer.mozilla.org/zh-TW/docs/Web/API/Window/load_event)

### unload 事件

> [MDN-unload](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/unload_event)

### onbeforeunload 事件

#### 觸發時機

- 嘗試要關閉網頁
- 往上/下一頁
- 重新整理頁面

**unload**和**onbeforeunload**事件類似，兩者的差別在**beforeunload** 是在網頁被卸載「之前」觸發，而 **unload** 是在網頁被卸載「之後」觸發，所以如果我們想要跳出警告視窗提醒使用者是否離開，就得在 **beforeunload** 事件處理，而不是 **unload** ，因為此時網頁已經離開。

<span class="rem25">~~換句話說 unload 事件觸發後就已經離開網頁了 QQ~~
~~onbeforeunload 事件觸發後他就問你真的要離開我嗎？~~</span>

值得一提的是，過去我們在 beforeunload 事件可以自訂提示訊息，這個功能在 Chrome v51 (2016/04) 時被取消了，理由是防止 beforeunload 的自訂訊息被用來做為詐騙用途。

> 詳情請見 [Remove custom messages in onbeforeunload dialogs](https://developers.google.com/web/updates/2016/04/chrome-51-deprecations?hl=en#remove_custom_messages_in_onbeforeunload_dialogs)

```javascript{numberLines: true}
window.onbeforeunload = function(event) {

    // 回傳要顯示給使用者看的提醒文字
     return '你寫什麼都沒用了'; //但是 IE 有用
};
```

### error 事件：

- error 事件在 document 或是圖片載入錯誤時觸發
- error 適合使用 on-event handler 的寫法 (多數事件建議使用「非侵入式 JavaScript」的寫法)

看以下範例就能知道 on-event handler 的寫法

```javascript{numberLines: true}
<img src="image.jpg" onerror="this.src='default.jpg'"> //將 javascript 寫在 html 裡面
```

上述程式碼，當 image.jpg 這個圖檔不存在，就會觸發 error 事件。
此時就會透過 this.src 將 <img> 的 src 屬性替換成指定的圖檔，是相當實用的技巧。

若是在網頁 load 完成後才註冊 error 事件的 handler，你只會看到叉燒包或者破圖的結果，因為 error 事件不會再次被觸發，後來掛上去的 handler 就等於沒有一樣。

> [MDN-error](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/error_event)

### DOMContentLoaded 事件

類似 load 事件，但是 DOMContentLoaded 事件是等待 DOM 結構完整讀取和解析被觸發 (換句話說不需等待像是外部 css 檔案就會觸發，反之 load 需要)

> [DOMContentLoaded](https://developer.mozilla.org/zh-TW/docs/Web/API/Window/DOMContentLoaded_event)

## 滑鼠相關事件

當定點設備（通常指滑鼠游標）移動到元素上時就會觸發 mouseenter 事件

類似 mouseover，它們兩者之間的差別是 mouseenter 不會冒泡（bubble），也就是說當指針從它的子層物理空間移到它的物理空間上時不會觸發

> [MDN-mouseenter](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/mouseenter_event)

以下面的範例可以發現當滑鼠游標從子元素移動父元素的時候只有 mouseover 會被觸發

```html{numberLines: true}
<style>
  .outer {
    height: 400px;
    width: 400px;
    background-color: pink;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .inner {
    height: 200px;
    width: 200px;
    background-color: lightgreen;
  }
</style>
<div class="outer">
  <div class="inner"></div>
</div>
<script>
    const outer = document.querySelector(".outer");
    const inner = document.querySelector(".inner");
        outer.addEventListener("mouseenter", function (event) {
        console.log("我是 Outer mouseenter");
    });
        outer.addEventListener("mouseover", function (event) {
        console.log("我是 Outer mouseover");
    });
        inner.addEventListener("mouseenter", function (event) {
        console.log("我是 Inner mouseenter");
    });
        inner.addEventListener("mouseover", function (event) {
        console.log("我是 Inner mouseover");
    });
</script>
```

另外可以發現如果從外面移入父元素的時候，mouseover 會早於 mouseenter 觸發。

與 mouseenter 和 mouserover 對應的另外兩個事件是 mouseleave 和 mouseout

mouseout 有事件冒泡

## 鍵盤事件

- keydown 事件：「壓下」鍵盤按鍵時會觸發 keydown 事件。
- keypress 事件：除了 Shift, Fn, CapsLock 這三種按鍵外按住時會觸發，若按著不放則會連續觸發。
  <span class="red">警告：由於此事件已被棄用，你應該使用 beforeinput 或 keydown 代替</span>
- keyup 事件：「放開」鍵盤按鍵時觸發。

[MDN-keypress 棄用](https://developer.mozilla.org/en-US/docs/Web/API/Document/keypress_event)

可以觀看 MDN 的範例

> [MDN-KeyboardEvent.key](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key)

### 使用 event.keyCode

```javascript{numberLines: true}
const keyboard = document.getElementById("keyboard");
    keyboard.addEventListener("keypress", function(event) {
        console.log(event.keyCode);//已經棄用
})
```

[MDN-棄用 keyCode](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)

### 使用 event.key

推薦使用以下範例

```javascript{numberLines: true}
const keyboard = document.getElementById("keyboard");
    keyboard.addEventListener("keypress", function(event) {
        console.log(event.key);//推薦使用
})
```

> [MDN-Event.key](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/code)

### 使用 event.code

不論使用[QWERTY 鍵盤](https://zh.wikipedia.org/wiki/QWERTY%E9%8D%B5%E7%9B%A4)或是[其他鍵盤配置](https://zh.wikipedia.org/wiki/%E9%94%AE%E7%9B%98%E5%B8%83%E5%B1%80#%E6%B3%95%E5%9B%BD)接回傳該鍵盤實體，換句話說如果不是使用 QWERTY 配置的方式就會出現非預期輸入的字元

## 表單相關事件

### input 事件

> 參考資料[JS input 事件介紹](https://morecoke.coderbridge.io/2021/03/28/js-input-%E4%BA%8B%E4%BB%B6/)

### select 事件

- e.target.selectionStart
- e.target.selectionEnd

範例可以參見 MDN

> [MDN-select 事件](https://developer.mozilla.org/en-US/docs/Web/API/Element/select_event)

### change

change 事件：當 **input、select、textarea、radio、checkbox** 等表單元素被改變時觸發。但與 **input** 事件不同的是，**input** 事件會在輸入框輸入內容的當下觸發，而 **change** 事件則是在目前焦點離開輸入框後才觸發。

### 其他 form 相關事件

- submit 事件：當表單被送出時觸發，通常表單驗證都會在這一步處理，若驗證未通過則 return false;。
- focus 事件：當元素被聚焦時觸發。
- blur 事件：當元素失去焦點時觸發。
- reset：當`<from>`被重置時觸發。

## 特殊事件

### Composition events 事件

> [MDN-Composition events](https://developer.mozilla.org/en-US/docs/Web/API/Element#composition_events)

### 剪貼簿事件

[MDN-剪貼簿事件](https://developer.mozilla.org/en-US/docs/Web/API/Element#clipboard_events)

### 自定義事件

自定義事件可以參見如下

> [JavaScript Pattern: Using Custom Events](https://www.youtube.com/watch?v=KuEVmf-Fxk0&t=1s&ab_channel=AllThingsJavaScript%2CLLC)

